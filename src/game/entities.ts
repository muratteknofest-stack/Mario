// ============================================
// Oyun Varlıkları: Karakter, Düşmanlar, Güçlendirmeler
// ============================================

import Phaser from 'phaser';
import { PLAYER, PowerUpType, EnemyType } from './core';

// ---- OYUNCU ----

export class Player {
  sprite: Phaser.Physics.Arcade.Sprite;
  scene: Phaser.Scene;
  state: {
    onGround: boolean;
    facing: 1 | -1;
    lives: number;
    score: number;
    invincible: boolean;
    invincibleTimer: number;
    powerUp: PowerUpType | null;
    powerUpTimer: number;
    coyoteTimer: number;
    jumpBuffer: number;
    jumpHeld: boolean;
    jumpTime: number;
    dead: boolean;
    moveSpeed: number;
  };
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private keys: Record<string, Phaser.Input.Keyboard.Key> = {};
  private sparkGroup: Phaser.Physics.Arcade.Group | null = null;
  private lastJumpDown: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, 'player_idle');
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setSize(PLAYER.width, PLAYER.height);
    this.sprite.setOffset(0, 0);
    this.sprite.setBounce(0);
    this.sprite.setDepth(10);

    this.state = {
      onGround: false,
      facing: 1,
      lives: PLAYER.maxLives,
      score: 0,
      invincible: false,
      invincibleTimer: 0,
      powerUp: null,
      powerUpTimer: 0,
      coyoteTimer: 0,
      jumpBuffer: 0,
      jumpHeld: false,
      jumpTime: 0,
      dead: false,
      moveSpeed: 0,
    };

    this.setupInput();
  }

  private setupInput(): void {
    if (this.scene.input.keyboard) {
      this.cursors = this.scene.input.keyboard.createCursorKeys();
      const kb = this.scene.input.keyboard;
      this.keys = {
        W: kb.addKey('W'),
        A: kb.addKey('A'),
        S: kb.addKey('S'),
        D: kb.addKey('D'),
        SPACE: kb.addKey('SPACE'),
        SHIFT: kb.addKey('SHIFT'),
        E: kb.addKey('E'),
        ESC: kb.addKey('ESC'),
      };
    }
  }

  getInput() {
    const left = (this.cursors?.left?.isDown || this.keys.A?.isDown) ?? false;
    const right = (this.cursors?.right?.isDown || this.keys.D?.isDown) ?? false;
    const jumpDown = (this.cursors?.up?.isDown || this.keys.SPACE?.isDown || this.keys.W?.isDown) ?? false;
    const jumpPressed = jumpDown && !this.lastJumpDown;
    const jumpReleased = !jumpDown && this.lastJumpDown;
    this.lastJumpDown = jumpDown;
    const run = this.keys.SHIFT?.isDown ?? false;
    const ability = this.keys.E?.isDown ?? false;
    const pause = this.keys.ESC?.isDown ?? false;
    return { left, right, jump: jumpDown, jumpPressed, jumpReleased, run, ability, pause };
  }

  update(dt: number, touchInput?: { left: boolean; right: boolean; jump: boolean; jumpPressed: boolean; jumpReleased: boolean; run: boolean; ability: boolean }): void {
    if (this.state.dead) return;

    const input = touchInput || this.getInput();
    const wasOnGround = this.state.onGround;

    // Yatay hareket
    const maxSpeed = input.run ? PLAYER.runSpeed : PLAYER.walkSpeed;
    const accel = this.state.onGround ? PLAYER.acceleration : PLAYER.airAcceleration;

    if (input.left) {
      this.state.moveSpeed = Phaser.Math.MaxAdd(this.state.moveSpeed, -maxSpeed, accel * dt);
      this.state.facing = -1;
    } else if (input.right) {
      this.state.moveSpeed = Phaser.Math.MaxAdd(this.state.moveSpeed, maxSpeed, accel * dt);
      this.state.facing = 1;
    } else {
      if (this.state.onGround) {
        if (this.state.moveSpeed > 0) this.state.moveSpeed = Math.max(0, this.state.moveSpeed - PLAYER.deceleration * dt);
        else this.state.moveSpeed = Math.min(0, this.state.moveSpeed + PLAYER.deceleration * dt);
      } else {
        this.state.moveSpeed *= 0.98;
      }
    }

    this.sprite.setVelocityX(this.state.moveSpeed);

    // Coyote time
    if (wasOnGround && !this.state.onGround && (this.sprite.body?.velocity.y ?? 0) >= 0) {
      this.state.coyoteTimer = PLAYER.coyoteTime;
    }
    if (this.state.coyoteTimer > 0) this.state.coyoteTimer -= dt;

    // Jump buffer
    if (input.jumpPressed) this.state.jumpBuffer = PLAYER.jumpBuffer;
    if (this.state.jumpBuffer > 0) this.state.jumpBuffer -= dt;

    // Zıplama
    if (this.state.jumpBuffer > 0 && (this.state.onGround || this.state.coyoteTimer > 0)) {
      this.sprite.setVelocityY(PLAYER.jumpForce);
      this.state.jumpHeld = true;
      this.state.jumpTime = 0;
      this.state.jumpBuffer = 0;
      this.state.coyoteTimer = 0;
      this.state.onGround = false;
      this.scene.events.emit('playerJump');
    }

    // Değişken zıplama yüksekliği
    if (this.state.jumpHeld && input.jump && this.state.jumpTime < PLAYER.maxJumpTime) {
      const vy = this.sprite.body?.velocity.y ?? 0;
      if (vy > PLAYER.jumpHoldForce) {
        this.sprite.setVelocityY(PLAYER.jumpHoldForce);
      }
      this.state.jumpTime += dt;
    }
    if (input.jumpReleased || !input.jump) this.state.jumpHeld = false;

    // Max düşme hızı
    const vy = this.sprite.body?.velocity.y ?? 0;
    if (vy > PLAYER.maxFallSpeed) this.sprite.setVelocityY(PLAYER.maxFallSpeed);

    // Dokunulmazlık
    if (this.state.invincible) {
      this.state.invincibleTimer -= dt;
      this.sprite.setAlpha(Math.sin(this.state.invincibleTimer * 15) > 0 ? 1 : 0.4);
      if (this.state.invincibleTimer <= 0) {
        this.state.invincible = false;
        this.sprite.setAlpha(1);
      }
    }

    // Güçlendirme
    if (this.state.powerUp && this.state.powerUp !== 'shield') {
      this.state.powerUpTimer -= dt;
      if (this.state.powerUpTimer <= 0) {
        this.state.powerUp = null;
        this.scene.events.emit('powerUpExpired');
      }
    }

    // Yetenek
    if (input.ability && this.state.powerUp === 'spark') this.fireSpark();

    // Sprite
    this.sprite.setFlipX(this.state.facing === -1);
    this.updateAnimation(input);
  }

  private updateAnimation(input: { left: boolean; right: boolean; run: boolean }): void {
    const speed = Math.abs(this.state.moveSpeed);
    let texture = 'player_idle';

    if (this.state.dead) {
      texture = 'player_hurt';
    } else if (!this.state.onGround) {
      texture = (this.sprite.body?.velocity.y ?? 0) < 0 ? 'player_jump' : 'player_fall';
    } else if (speed > 10) {
      if (input.run && speed > PLAYER.walkSpeed) {
        texture = Math.sin(Date.now() * 0.015) > 0 ? 'player_run1' : 'player_run2';
      } else {
        texture = Math.sin(Date.now() * 0.008) > 0 ? 'player_walk1' : 'player_walk2';
      }
    }
    this.sprite.setTexture(texture);
  }

  private fireSpark(): void {
    if (!this.sparkGroup) {
      this.sparkGroup = this.scene.physics.add.group({ classType: Phaser.Physics.Arcade.Sprite, maxSize: 10 });
    }
    const spark = this.sparkGroup.get(this.sprite.x + this.state.facing * 20, this.sprite.y) as Phaser.Physics.Arcade.Sprite;
    if (spark) {
      spark.setTexture('spark_projectile');
      spark.setActive(true);
      spark.setVisible(true);
      spark.setVelocityX(this.state.facing * 500);
      if (spark.body) (spark.body as any).allowGravity = false;
      this.scene.time.delayedCall(2000, () => { spark.setActive(false); spark.setVisible(false); });
    }
  }

  takeDamage(): boolean {
    if (this.state.invincible || this.state.dead) return false;
    if (this.state.powerUp === 'shield') {
      this.state.powerUp = null;
      this.state.invincible = true;
      this.state.invincibleTimer = 0.5;
      this.scene.events.emit('shieldBroken');
      return false;
    }
    this.state.lives--;
    this.scene.events.emit('playerHit', this.state.lives);
    if (this.state.lives <= 0) { this.die(); return true; }
    this.state.invincible = true;
    this.state.invincibleTimer = PLAYER.invincibleTime;
    this.sprite.setVelocityY(-300);
    return false;
  }

  die(): void {
    this.state.dead = true;
    this.sprite.setVelocity(0, -400);
    this.sprite.setImmovable(true);
    this.scene.events.emit('playerDeath');
  }

  respawn(x: number, y: number): void {
    this.sprite.setPosition(x, y);
    this.sprite.setVelocity(0, 0);
    this.sprite.setImmovable(false);
    this.sprite.setAlpha(1);
    this.state.dead = false;
    this.state.invincible = true;
    this.state.invincibleTimer = PLAYER.invincibleTime;
    this.state.onGround = false;
    this.state.moveSpeed = 0;
  }

  setGrounded(val: boolean): void {
    if (!this.state.onGround && val) this.scene.events.emit('playerLand');
    this.state.onGround = val;
    if (val) this.state.coyoteTimer = 0;
  }

  addScore(amount: number): void { this.state.score += amount; }

  setPowerUp(type: PowerUpType): void {
    this.state.powerUp = type;
    this.state.powerUpTimer = type === 'cloak' ? 8 : type === 'boots' ? 10 : Infinity;
    this.scene.events.emit('powerUpCollected', type);
  }

  getSparkGroup(): Phaser.Physics.Arcade.Group | null { return this.sparkGroup; }

  destroy(): void {
    this.sprite.destroy();
    if (this.sparkGroup) this.sparkGroup.destroy();
  }
}

// ---- DÜŞMANLAR ----

export class Enemy {
  sprite: Phaser.Physics.Arcade.Sprite;
  scene: Phaser.Scene;
  type: EnemyType;
  alive: boolean = true;
  hp: number = 1;
  state: string = 'patrol';
  stateTimer: number = 0;
  direction: 1 | -1 = 1;
  patrolOrigin: number;
  patrolRange: number;
  private shootTimer: number = 0;
  private projGroup: Phaser.Physics.Arcade.Group | null = null;

  constructor(scene: Phaser.Scene, type: EnemyType, x: number, y: number, patrolRange: number = 120) {
    this.scene = scene;
    this.type = type;
    this.patrolOrigin = x;
    this.patrolRange = patrolRange;
    this.sprite = scene.physics.add.sprite(x, y, `enemy_${type}`);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setDepth(8);
    if (type === 'flyer' && this.sprite.body) (this.sprite.body as any).allowGravity = false;
    switch (type) {
      case 'shielded': this.hp = 3; break;
      case 'charger': this.hp = 2; break;
      default: this.hp = 1;
    }
  }

  update(dt: number, px: number, py: number): void {
    if (!this.alive) return;
    this.stateTimer += dt;
    const dist = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, px, py);

    switch (this.type) {
      case 'patrol': case 'edge':
        this.sprite.setVelocityX(this.direction * 80);
        if (Math.abs(this.sprite.x - this.patrolOrigin) > this.patrolRange) this.direction *= -1;
        break;
      case 'jumper':
        this.sprite.setVelocityX(this.direction * 100);
        if (Math.abs(this.sprite.x - this.patrolOrigin) > this.patrolRange) this.direction *= -1;
        if (this.stateTimer > 2 && this.sprite.body?.touching.down) { this.sprite.setVelocityY(-400); this.stateTimer = 0; }
        break;
      case 'flyer':
        this.sprite.setVelocityY(Phaser.Math.Clamp((py - 60 - this.sprite.y) * 2, -60, 60));
        this.sprite.setVelocityX(this.direction * 60);
        if (Math.abs(this.sprite.x - this.patrolOrigin) > this.patrolRange * 1.5) this.direction *= -1;
        break;
      case 'shooter':
        this.sprite.setVelocityX(0);
        this.shootTimer += dt;
        if (this.shootTimer > 2.5 && dist < 400) { this.shootTimer = 0; this.fireAt(px, py); }
        break;
      case 'shielded':
        this.sprite.setVelocityX(this.direction * 50);
        if (Math.abs(this.sprite.x - this.patrolOrigin) > this.patrolRange) this.direction *= -1;
        break;
      case 'charger':
        if (this.state === 'patrol') {
          this.sprite.setVelocityX(this.direction * 60);
          if (Math.abs(this.sprite.x - this.patrolOrigin) > this.patrolRange) this.direction *= -1;
          if (dist < 300) { this.state = 'prepare'; this.stateTimer = 0; this.sprite.setTint(0xff6666); }
        } else if (this.state === 'prepare') {
          this.sprite.setVelocityX(0);
          if (this.stateTimer > 0.8) { this.state = 'attack'; this.stateTimer = 0; this.direction = px > this.sprite.x ? 1 : -1; }
        } else if (this.state === 'attack') {
          this.sprite.setVelocityX(this.direction * 400);
          if (this.stateTimer > 1) { this.state = 'recover'; this.stateTimer = 0; this.sprite.clearTint(); }
        } else if (this.state === 'recover') {
          this.sprite.setVelocityX(0);
          if (this.stateTimer > 1.5) { this.state = 'patrol'; this.stateTimer = 0; }
        }
        break;
      case 'burrower':
        if (this.state === 'patrol') {
          this.sprite.setVisible(false);
          if (this.sprite.body) this.sprite.body.enable = false;
          if (dist < 200) { this.state = 'prepare'; this.stateTimer = 0; }
        } else if (this.state === 'prepare') {
          this.sprite.setVisible(true);
          if (this.sprite.body) this.sprite.body.enable = true;
          this.sprite.setVelocityY(-300);
          this.sprite.x = px;
          if (this.stateTimer > 0.5) { this.state = 'attack'; this.stateTimer = 0; }
        } else if (this.state === 'attack') {
          this.sprite.setVelocityY(0);
          if (this.stateTimer > 2) { this.state = 'recover'; this.stateTimer = 0; }
        } else if (this.state === 'recover') {
          this.sprite.setVelocityY(200);
          if (this.stateTimer > 0.5) { this.state = 'patrol'; this.stateTimer = 0; }
        }
        break;
    }

    if (this.sprite.active) {
      if ((this.sprite.body?.velocity.x ?? 0) < -10) this.sprite.setFlipX(true);
      else if ((this.sprite.body?.velocity.x ?? 0) > 10) this.sprite.setFlipX(false);
    }
  }

  private fireAt(tx: number, ty: number): void {
    if (!this.projGroup) {
      this.projGroup = this.scene.physics.add.group({ classType: Phaser.Physics.Arcade.Sprite, maxSize: 5 });
    }
    const p = this.projGroup.get(this.sprite.x, this.sprite.y) as Phaser.Physics.Arcade.Sprite;
    if (p) {
      p.setTexture('enemy_projectile');
      p.setActive(true); p.setVisible(true);
      const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, tx, ty);
      p.setVelocity(Math.cos(angle) * 250, Math.sin(angle) * 250);
      if (p.body) (p.body as any).allowGravity = false;
      this.scene.time.delayedCall(3000, () => { p.setActive(false); p.setVisible(false); });
    }
  }

  takeDamage(): boolean {
    this.hp--;
    if (this.hp <= 0) {
      this.alive = false;
      this.scene.tweens.add({ targets: this.sprite, alpha: 0, y: this.sprite.y - 20, duration: 300, onComplete: () => this.sprite.destroy() });
      return true;
    }
    this.sprite.setTint(0xffffff);
    this.scene.time.delayedCall(100, () => { if (this.alive) this.sprite.clearTint(); });
    return false;
  }

  getProjGroup(): Phaser.Physics.Arcade.Group | null { return this.projGroup; }
  destroy(): void { if (this.sprite.active) this.sprite.destroy(); if (this.projGroup) this.projGroup.destroy(); }
}

// ---- BOSS ----

export class Boss {
  sprite: Phaser.Physics.Arcade.Sprite;
  scene: Phaser.Scene;
  hp: number;
  maxHp: number;
  phase: number = 1;
  alive: boolean = true;
  state: string = 'idle';
  stateTimer: number = 0;
  currentPattern: number = 0;
  direction: 1 | -1 = 1;
  private patterns: any[];
  private projGroup: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene, bossDef: any) {
    this.scene = scene;
    this.hp = bossDef.hp;
    this.maxHp = bossDef.hp;
    this.patterns = bossDef.patterns;
    const idx = parseInt(bossDef.id.replace(/\D/g, '')) - 1;
    const texKey = `boss_${['root', 'press', 'compass', 'prism', 'hearth', 'storm'][idx] || 'root'}`;
    this.sprite = scene.physics.add.sprite(640, 300, texKey);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setDepth(15);
    if (this.sprite.body) (this.sprite.body as any).allowGravity = false;
    this.projGroup = scene.physics.add.group({ classType: Phaser.Physics.Arcade.Sprite, maxSize: 20 });
  }

  update(dt: number, px: number, py: number): void {
    if (!this.alive) return;
    this.stateTimer += dt;
    const pattern = this.patterns[this.currentPattern % this.patterns.length];

    if (this.state === 'idle') {
      this.sprite.setVelocity(0, 0);
      this.sprite.y += Math.sin(Date.now() * 0.002) * 0.5;
      if (this.stateTimer > pattern.cooldown) { this.state = 'telegraph'; this.stateTimer = 0; this.sprite.setTint(0xffff00); }
    } else if (this.state === 'telegraph') {
      this.sprite.setVelocity(0, 0);
      this.sprite.x += (Math.random() - 0.5) * 4;
      if (this.stateTimer > pattern.telegraph) { this.state = 'attack'; this.stateTimer = 0; this.sprite.clearTint(); this.execAttack(pattern, px, py); }
    } else if (this.state === 'attack') {
      if (pattern.type === 'charge') this.sprite.setVelocityX(this.direction * 400);
      else if (pattern.type === 'sweep') {
        this.sprite.setVelocityX(this.direction * 300);
        if (this.sprite.x < 100 || this.sprite.x > 1180) this.direction *= -1;
      }
      if (this.stateTimer > pattern.duration) { this.state = 'recover'; this.stateTimer = 0; }
    } else if (this.state === 'recover') {
      this.sprite.setVelocity(0, 0);
      if (this.stateTimer > 1) {
        this.state = 'idle'; this.stateTimer = 0; this.currentPattern++;
        if (this.hp <= this.maxHp * 0.5 && this.phase === 1) { this.phase = 2; this.sprite.setTint(0xff4444); this.scene.time.delayedCall(500, () => { if (this.alive) this.sprite.clearTint(); }); }
      }
    }
  }

  private execAttack(pattern: any, px: number, py: number): void {
    this.direction = px > this.sprite.x ? 1 : -1;
    if (pattern.type === 'projectile') {
      for (let i = 0; i < 3; i++) this.scene.time.delayedCall(i * 200, () => this.fireProj(px, py));
    } else if (pattern.type === 'slam') {
      this.sprite.setVelocityY(600);
      this.scene.time.delayedCall(500, () => {
        this.sprite.setVelocityY(0);
        for (let i = -2; i <= 2; i++) this.fireProj(this.sprite.x + i * 80, this.sprite.y + 40);
      });
    } else if (pattern.type === 'summon') {
      for (let i = 0; i < 4; i++) {
        this.scene.time.delayedCall(i * 300, () => {
          const a = (i / 4) * Math.PI * 2;
          this.fireProj(this.sprite.x + Math.cos(a) * 200, this.sprite.y + Math.sin(a) * 200);
        });
      }
    }
  }

  private fireProj(tx: number, ty: number): void {
    const p = this.projGroup.get(this.sprite.x, this.sprite.y) as Phaser.Physics.Arcade.Sprite;
    if (p) {
      p.setTexture('enemy_projectile'); p.setActive(true); p.setVisible(true); p.setScale(1.5);
      const a = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, tx, ty);
      p.setVelocity(Math.cos(a) * 300, Math.sin(a) * 300);
      if (p.body) (p.body as any).allowGravity = false;
      this.scene.time.delayedCall(4000, () => { if (p.active) { p.setActive(false); p.setVisible(false); } });
    }
  }

  takeDamage(amount: number = 1): boolean {
    this.hp -= amount;
    this.sprite.setTint(0xff0000);
    this.scene.time.delayedCall(200, () => { if (this.alive) this.sprite.clearTint(); });
    if (this.hp <= 0) {
      this.alive = false;
      this.scene.tweens.add({ targets: this.sprite, alpha: 0, scaleX: 2, scaleY: 2, duration: 1000 });
      return true;
    }
    return false;
  }

  getProjGroup(): Phaser.Physics.Arcade.Group { return this.projGroup; }
  destroy(): void { this.sprite.destroy(); this.projGroup.destroy(); }
}

// ---- TOPLANABİLİRLER ----

export class Collectible {
  sprite: Phaser.Physics.Arcade.Sprite;
  collected: boolean = false;
  type: string;
  id: string;
  powerUpType?: PowerUpType;

  constructor(scene: Phaser.Scene, id: string, x: number, y: number, type: string, powerUpType?: PowerUpType) {
    this.id = id;
    this.type = type;
    this.powerUpType = powerUpType;
    let texture = 'coin';
    if (type === 'special') texture = 'special_collect';
    else if (type === 'powerup' && powerUpType) texture = `powerup_${powerUpType}`;
    this.sprite = scene.physics.add.sprite(x, y, texture);
    this.sprite.setDepth(7);
    if (this.sprite.body) (this.sprite.body as any).allowGravity = false;
    scene.tweens.add({ targets: this.sprite, y: y - 5, duration: 1000 + Math.random() * 500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  collect(): void {
    if (this.collected) return;
    this.collected = true;
    this.sprite.scene.tweens.add({ targets: this.sprite, y: this.sprite.y - 30, alpha: 0, scale: 1.5, duration: 300, onComplete: () => this.sprite.destroy() });
  }

  destroy(): void { if (this.sprite.active) this.sprite.destroy(); }
}

// ---- PLATFORMLAR ----

export class GamePlatform {
  sprite: Phaser.Physics.Arcade.Sprite;
  scene: Phaser.Scene;
  type: string;
  origX: number;
  origY: number;
  moveAxis?: 'x' | 'y';
  moveRange: number;
  moveSpeed: number;
  moveTimer: number = 0;
  broken: boolean = false;
  fallTimer: number = 0;
  falling: boolean = false;
  activated: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, w: number, h: number, type: string, moveAxis?: 'x' | 'y', moveRange?: number, moveSpeed?: number) {
    this.scene = scene;
    this.type = type;
    this.origX = x + w / 2;
    this.origY = y + h / 2;
    this.moveAxis = moveAxis;
    this.moveRange = moveRange || 0;
    this.moveSpeed = moveSpeed || 0;
    let tex = 'tile_solid';
    if (type === 'oneway' || type === 'falling') tex = 'tile_oneway';
    else if (type === 'moving') tex = 'tile_moving';
    else if (type === 'bounce') tex = 'tile_bounce';
    else if (type === 'breakable') tex = 'tile_breakable';
    else if (type === 'reward') tex = 'tile_reward';
    this.sprite = scene.physics.add.sprite(x + w / 2, y + h / 2, tex);
    this.sprite.setDisplaySize(w, h);
    this.sprite.setSize(w, h);
    this.sprite.setImmovable(true);
    this.sprite.setDepth(5);
    if ((type === 'oneway' || type === 'falling') && this.sprite.body) {
      const b = this.sprite.body as Phaser.Physics.Arcade.Body;
      b.setAllowGravity(false);
      b.checkCollision.down = false;
      b.checkCollision.left = false;
      b.checkCollision.right = false;
    }
  }

  update(dt: number): void {
    if (this.broken) return;
    if (this.type === 'moving' && this.moveRange > 0) {
      this.moveTimer += dt * this.moveSpeed * 0.01;
      const off = Math.sin(this.moveTimer) * this.moveRange;
      if (this.moveAxis === 'x') this.sprite.x = this.origX + off;
      else this.sprite.y = this.origY + off;
    }
    if (this.type === 'falling' && this.falling) {
      this.fallTimer += dt;
      if (this.fallTimer > 0.3) {
        this.sprite.y += 300 * dt;
        if (this.fallTimer > 3) { this.falling = false; this.fallTimer = 0; this.activated = false; this.sprite.y = this.origY; this.sprite.setAlpha(1); }
      } else {
        this.sprite.x = this.origX + (Math.random() - 0.5) * 4;
      }
    }
  }

  activate(): void {
    if (this.type === 'falling' && !this.activated) { this.activated = true; this.falling = true; this.fallTimer = 0; }
    if (this.type === 'breakable') {
      this.broken = true;
      this.scene.tweens.add({ targets: this.sprite, alpha: 0, scale: 0.5, duration: 200, onComplete: () => this.sprite.destroy() });
    }
  }

  destroy(): void { if (this.sprite.active) this.sprite.destroy(); }
}
