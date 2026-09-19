// ============================================
// Oyun Sahneleri: Boot, Menu, WorldMap, Play, Results
// ============================================

import Phaser from 'phaser';
import { GAME_CONFIG, PLAYER, WORLDS, SaveData, createEmptySave, saveGame, loadSave, loadAllSaves, AudioSystem, t, LevelData } from './core';
import { generateTextures } from './textures';
import { Player, Enemy, Boss, Collectible, GamePlatform } from './entities';
import { getAllLevels, getLevelById, getLevelsByWorld } from './levels';

// ---- BOOT SCENE ----
export class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'Boot' }); }

  create(): void {
    generateTextures(this);
    this.scene.start('Menu');
  }
}

// ---- MENU SCENE ----
export class MenuScene extends Phaser.Scene {
  private audio: AudioSystem | null = null;
  private menuItems: Phaser.GameObjects.Text[] = [];

  constructor() { super({ key: 'Menu' }); }

  create(): void {
    this.audio = (this.game as any).audioSys || null;
    if (this.audio) this.audio.resume();

    const cx = GAME_CONFIG.logicalWidth / 2;

    // Arka plan
    const bg = this.add.graphics();
    bg.fillStyle(0x0a1628, 1);
    bg.fillRect(0, 0, GAME_CONFIG.logicalWidth, GAME_CONFIG.logicalHeight);

    // Gradient overlay
    const bg2 = this.add.graphics();
    bg2.fillStyle(0x1a2d4a, 0.5);
    bg2.fillRect(0, GAME_CONFIG.logicalHeight / 2, GAME_CONFIG.logicalWidth, GAME_CONFIG.logicalHeight / 2);

    // Yıldızlar
    for (let i = 0; i < 50; i++) {
      const sx = Math.random() * GAME_CONFIG.logicalWidth;
      const sy = Math.random() * GAME_CONFIG.logicalHeight * 0.6;
      this.add.circle(sx, sy, Math.random() * 2 + 0.5, 0xffffff, Math.random() * 0.5 + 0.3);
    }

    // Başlık
    this.add.text(cx, 100, 'KIVILCIM', {
      fontSize: '64px', fontFamily: 'Arial, sans-serif', color: '#2dd4bf',
      stroke: '#0a1628', strokeThickness: 6,
    }).setOrigin(0.5);

    this.add.text(cx, 165, 'Gök Yüzü Adaları', {
      fontSize: '24px', fontFamily: 'Arial, sans-serif', color: '#94a3b8',
    }).setOrigin(0.5);

    // Ana karakter önizleme
    this.add.image(cx, 270, 'player_idle').setScale(3);

    this.showMainMenu();
  }

  private clearMenuItems(): void {
    this.menuItems.forEach(item => item.destroy());
    this.menuItems = [];
  }

  private addMenuItem(x: number, y: number, text: string, color: string, onClick: () => void): Phaser.GameObjects.Text {
    const txt = this.add.text(x, y, text, {
      fontSize: '22px', fontFamily: 'Arial, sans-serif', color: color,
      backgroundColor: '#1e293b', padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    txt.on('pointerover', () => txt.setBackgroundColor('#334155'));
    txt.on('pointerout', () => txt.setBackgroundColor('#1e293b'));
    txt.on('pointerdown', onClick);
    this.menuItems.push(txt);
    return txt;
  }

  private showMainMenu(): void {
    this.clearMenuItems();
    const cx = GAME_CONFIG.logicalWidth / 2;
    const saves = loadAllSaves();
    const hasSave = saves.some(s => s !== null);

    this.addMenuItem(cx, 370, t('continue'), hasSave ? '#e2e8f0' : '#475569', () => {
      if (hasSave) this.showSlotSelect('continue');
    });
    this.addMenuItem(cx, 425, t('newGame'), '#e2e8f0', () => this.showSlotSelect('new'));
    this.addMenuItem(cx, 480, t('worldMap'), '#e2e8f0', () => this.showWorldMap());
    this.addMenuItem(cx, 535, t('settings'), '#e2e8f0', () => this.showSettings());
    this.addMenuItem(cx, 590, t('howToPlay'), '#e2e8f0', () => this.showHelp());
  }

  private showSlotSelect(mode: 'new' | 'continue'): void {
    this.clearMenuItems();
    const cx = GAME_CONFIG.logicalWidth / 2;
    const saves = loadAllSaves();

    const titleTxt = this.add.text(cx, 350, t('selectSlot'), {
      fontSize: '20px', fontFamily: 'Arial, sans-serif', color: '#94a3b8',
    }).setOrigin(0.5);
    this.menuItems.push(titleTxt);

    for (let i = 0; i < 3; i++) {
      const save = saves[i];
      const label = save ? `${save.playerName} - Dünya ${save.worldsUnlocked}` : `${t('empty')} ${i + 1}`;
      this.addMenuItem(cx, 400 + i * 50, label, '#e2e8f0', () => {
        if (mode === 'new') {
          const newSave = createEmptySave(i);
          saveGame(newSave);
          this.startGame(newSave);
        } else if (save) {
          this.startGame(save);
        }
      });
    }

    this.addBackButton(() => this.showMainMenu());
  }

  private showSettings(): void {
    this.clearMenuItems();
    const cx = GAME_CONFIG.logicalWidth / 2;
    const save = loadSave(0) || createEmptySave(0);

    const settings = [
      { label: `${t('masterVol')}: ${Math.round(save.settings.masterVolume * 100)}%` },
      { label: `${t('musicVol')}: ${Math.round(save.settings.musicVolume * 100)}%` },
      { label: `${t('sfxVol')}: ${Math.round(save.settings.sfxVolume * 100)}%` },
      { label: `${t('screenShake')}: ${save.settings.screenShake ? 'Açık' : 'Kapalı'}` },
      { label: `${t('autoRun')}: ${save.settings.autoRun ? 'Açık' : 'Kapalı'}` },
      { label: `${t('quality')}: ${save.settings.quality}` },
    ];

    settings.forEach((s, i) => {
      this.addMenuItem(cx, 370 + i * 42, s.label, '#e2e8f0', () => {
        switch (i) {
          case 0: save.settings.masterVolume = Math.min(1, save.settings.masterVolume + 0.2); if (save.settings.masterVolume > 1) save.settings.masterVolume = 0; break;
          case 1: save.settings.musicVolume = Math.min(1, save.settings.musicVolume + 0.2); if (save.settings.musicVolume > 1) save.settings.musicVolume = 0; break;
          case 2: save.settings.sfxVolume = Math.min(1, save.settings.sfxVolume + 0.2); if (save.settings.sfxVolume > 1) save.settings.sfxVolume = 0; break;
          case 3: save.settings.screenShake = !save.settings.screenShake; break;
          case 4: save.settings.autoRun = !save.settings.autoRun; break;
          case 5: const q = ['auto', '720p', '1080p', '1440p', '4k']; const idx = q.indexOf(save.settings.quality); save.settings.quality = q[(idx + 1) % q.length] as any; break;
        }
        saveGame(save);
        if (this.audio) {
          this.audio.setMasterVolume(save.settings.masterVolume);
          this.audio.setMusicVolume(save.settings.musicVolume);
          this.audio.setSfxVolume(save.settings.sfxVolume);
        }
        this.showSettings();
      });
    });

    this.addBackButton(() => this.showMainMenu());
  }

  private showHelp(): void {
    this.clearMenuItems();
    const cx = GAME_CONFIG.logicalWidth / 2;

    const lines = [
      `${t('move')}: A/D veya ←/→`,
      `${t('jump')}: Space veya ↑`,
      `${t('run')}: Shift`,
      `${t('ability')}: E`,
      `${t('pauseKey')}: Esc`,
      '',
      'Düşmanların üstüne zıplayarak yen!',
      'Özel koleksiyonları bul!',
      '6 dünyada 30 bölümü geç.',
      'Her dünyanın bossunu yen!',
    ];

    lines.forEach((line, i) => {
      const txt = this.add.text(cx, 360 + i * 28, line, {
        fontSize: '16px', fontFamily: 'Arial, sans-serif', color: '#cbd5e1',
      }).setOrigin(0.5);
      this.menuItems.push(txt);
    });

    this.addBackButton(() => this.showMainMenu());
  }

  private addBackButton(action: () => void): void {
    const cx = GAME_CONFIG.logicalWidth / 2;
    this.addMenuItem(cx, 650, t('back'), '#94a3b8', action);
  }

  private showWorldMap(): void {
    this.scene.start('WorldMap');
  }

  private startGame(save: SaveData): void {
    (this.game as any).currentSave = save;
    const firstLevel = save.currentLevel || '1-1';
    (this.game as any).pendingLevelId = firstLevel;
    this.scene.start('Play');
  }
}

// ---- WORLD MAP SCENE ----
export class WorldMapScene extends Phaser.Scene {
  private save: SaveData | null = null;
  private menuItems: Phaser.GameObjects.GameObject[] = [];

  constructor() { super({ key: 'WorldMap' }); }

  create(): void {
    this.save = (this.game as any).currentSave || loadSave(0) || createEmptySave(0);
    const cx = GAME_CONFIG.logicalWidth / 2;

    // Arka plan
    const bg = this.add.graphics();
    bg.fillStyle(0x0a1628, 1);
    bg.fillRect(0, 0, GAME_CONFIG.logicalWidth, GAME_CONFIG.logicalHeight);

    const title = this.add.text(cx, 40, t('worldMap'), {
      fontSize: '32px', fontFamily: 'Arial, sans-serif', color: '#2dd4bf',
    }).setOrigin(0.5);
    this.menuItems.push(title);

    WORLDS.forEach((world, wi) => {
      const unlocked = wi + 1 <= (this.save!.worldsUnlocked || 1);
      const wx = 120 + (wi % 3) * 400;
      const wy = 120 + Math.floor(wi / 3) * 280;

      // Dünya kartı
      const card = this.add.graphics();
      const bgColor = unlocked ? parseInt(world.bgColor2.replace('#', ''), 16) : 0x1e293b;
      card.fillStyle(bgColor, 0.8);
      card.fillRoundedRect(wx - 150, wy - 10, 300, 220, 12);
      const lineColor = unlocked ? parseInt(world.color.replace('#', ''), 16) : 0x475569;
      card.lineStyle(2, lineColor);
      card.strokeRoundedRect(wx - 150, wy - 10, 300, 220, 12);

      // Dünya adı
      const nameText = this.add.text(wx, wy + 10, world.name, {
        fontSize: '20px', fontFamily: 'Arial, sans-serif',
        color: unlocked ? world.color : '#475569',
      }).setOrigin(0.5);
      this.menuItems.push(nameText);

      if (unlocked) {
        const levels = getLevelsByWorld(world.id);
        levels.forEach((level, li) => {
          const completed = this.save!.levelsCompleted.includes(level.id);
          const lx = wx - 100 + (li % 5) * 50;
          const ly = wy + 60 + Math.floor(li / 5) * 50;

          const dotColor = completed ? parseInt(world.color.replace('#', ''), 16) : 0x334155;
          const dot = this.add.circle(lx, ly, 16, dotColor);
          dot.setInteractive({ useHandCursor: true });

          const label = this.add.text(lx, ly, level.isBoss ? 'B' : `${level.stage}`, {
            fontSize: '12px', fontFamily: 'Arial, sans-serif', color: '#fff',
          }).setOrigin(0.5);
          this.menuItems.push(label);

          dot.on('pointerdown', () => {
            this.save!.currentLevel = level.id;
            saveGame(this.save!);
            (this.game as any).currentSave = this.save;
            (this.game as any).pendingLevelId = level.id;
            this.scene.start('Play');
          });
        });

        const worldSpecials = this.save!.specialsCollected.filter(s => s.startsWith(`${world.id}-`)).length;
        const colText = this.add.text(wx, wy + 170, `${t('collectibles')}: ${worldSpecials}/15`, {
          fontSize: '14px', fontFamily: 'Arial, sans-serif', color: '#94a3b8',
        }).setOrigin(0.5);
        this.menuItems.push(colText);
      } else {
        const lockText = this.add.text(wx, wy + 80, t('locked'), {
          fontSize: '18px', fontFamily: 'Arial, sans-serif', color: '#475569',
        }).setOrigin(0.5);
        this.menuItems.push(lockText);
      }
    });

    // Geri butonu
    const backBtn = this.add.text(cx, 680, t('back'), {
      fontSize: '18px', fontFamily: 'Arial, sans-serif', color: '#94a3b8',
      backgroundColor: '#1e293b', padding: { x: 20, y: 8 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    backBtn.on('pointerdown', () => this.scene.start('Menu'));
    this.menuItems.push(backBtn);
  }
}

// ---- PLAY SCENE ----
export class PlayScene extends Phaser.Scene {
  private player!: Player;
  private enemies: Enemy[] = [];
  private boss: Boss | null = null;
  private collectibles: Collectible[] = [];
  private platforms: GamePlatform[] = [];
  private level!: LevelData;
  private save!: SaveData;
  private hud!: HUD;
  private paused: boolean = false;
  private levelTime: number = 0;
  private audio: AudioSystem | null = null;
  private touchControls: TouchControls | null = null;
  private hazards: Phaser.Physics.Arcade.StaticGroup | null = null;
  private checkpointPos: { x: number; y: number } = { x: 0, y: 0 };
  private activatedCheckpoints: Set<string> = new Set();
  private pauseOverlay: Phaser.GameObjects.Container | null = null;

  constructor() { super({ key: 'Play' }); }

  create(): void {
    this.audio = (this.game as any).audioSys || null;
    this.save = (this.game as any).currentSave || createEmptySave(0);
    const levelId = (this.game as any).pendingLevelId || '1-1';
    this.level = getLevelById(levelId)!;
    
    if (!this.level) {
      this.scene.start('Menu');
      return;
    }

    this.paused = false;
    this.levelTime = 0;
    this.enemies = [];
    this.collectibles = [];
    this.platforms = [];
    this.boss = null;
    this.activatedCheckpoints.clear();

    // Dünya ayarı
    this.cameras.main.setBackgroundColor(this.level.bgColor);
    this.physics.world.setBounds(0, 0, this.level.width, this.level.height);

    // Parallax arka plan
    this.createParallax();

    // Platformlar
    this.createPlatforms();

    // Tehlikeler
    this.createHazards();

    // Düşmanlar
    this.createEnemies();

    // Koleksiyonlar
    this.createCollectibles();

    // Kontrol noktaları
    this.createCheckpoints();

    // Boss
    if (this.level.isBoss && this.level.bossDef) {
      this.boss = new Boss(this, this.level.bossDef);
    }

    // Oyuncu
    this.checkpointPos = { x: this.level.startX, y: this.level.startY };
    this.player = new Player(this, this.level.startX, this.level.startY);

    // Çarpışmalar
    this.setupCollisions();

    // Kamera
    this.cameras.main.setBounds(0, 0, this.level.width, this.level.height);
    this.cameras.main.startFollow(this.player.sprite, true, 0.08, 0.08);
    if (this.level.cameraBounds) {
      this.cameras.main.setBounds(
        this.level.cameraBounds.left,
        this.level.cameraBounds.top,
        this.level.cameraBounds.right - this.level.cameraBounds.left,
        this.level.cameraBounds.bottom - this.level.cameraBounds.top
      );
    }

    // HUD
    this.hud = new HUD(this, this.save);

    // Mobil kontroller
    if (this.sys.game.device.input.touch) {
      this.touchControls = new TouchControls(this);
    }

    // Müzik
    if (this.audio) this.audio.playMusic(this.level.world);

    // Olay dinleyicileri
    this.setupEvents();

    // Duraklatma
    if (this.input.keyboard) {
      this.input.keyboard.on('keydown-ESC', () => this.togglePause());
    }
  }

  private createParallax(): void {
    this.level.parallaxLayers.forEach(layer => {
      layer.elements.forEach(el => {
        const g = this.add.graphics();
        const color = parseInt(layer.color.replace('#', '').substring(0, 6), 16) || 0x334155;
        g.fillStyle(color, 0.3);
        if (el.type === 'cloud') {
          g.fillEllipse(el.x + el.w / 2, el.y + el.h / 2, el.w, el.h);
        } else if (el.type === 'mountain') {
          g.fillTriangle(el.x, el.y + el.h, el.x + el.w / 2, el.y, el.x + el.w, el.y + el.h);
        } else {
          g.fillRect(el.x, el.y, el.w, el.h);
        }
        g.setScrollFactor(layer.speed);
        g.setDepth(0);
      });
    });
  }

  private createPlatforms(): void {
    this.level.platforms.forEach(p => {
      const plat = new GamePlatform(this, p.x, p.y, p.w, p.h, p.type, p.moveAxis, p.moveRange, p.moveSpeed);
      this.platforms.push(plat);
    });
  }

  private createHazards(): void {
    this.hazards = this.physics.add.staticGroup();
    this.level.hazards.forEach(h => {
      const tex = h.type === 'lava' ? 'hazard_lava' : 'hazard_spikes';
      const spike = this.hazards!.create(h.x + h.w / 2, h.y + h.h / 2, tex) as Phaser.Physics.Arcade.Sprite;
      if (spike) {
        spike.setDisplaySize(h.w, h.h);
        spike.setSize(h.w, h.h);
      }
    });
  }

  private createEnemies(): void {
    this.level.enemies.forEach(e => {
      const enemy = new Enemy(this, e.type, e.x, e.y, e.patrolRange);
      this.enemies.push(enemy);
    });
  }

  private createCollectibles(): void {
    this.level.collectibles.forEach(c => {
      if (c.type === 'special' && this.save.specialsCollected.includes(c.id)) return;
      const col = new Collectible(this, c.id, c.x, c.y, c.type, c.powerUpType);
      this.collectibles.push(col);
    });
  }

  private createCheckpoints(): void {
    this.level.checkpoints.forEach(cp => {
      const sprite = this.add.sprite(cp.x, cp.y, 'checkpoint');
      sprite.setDepth(6);
      sprite.setData('checkpointId', cp.id);
      sprite.setData('pos', { x: cp.x, y: cp.y - 48 });
    });
  }

  private setupCollisions(): void {
    // Oyuncu - Platformlar
    this.platforms.forEach(plat => {
      if (plat.broken || !plat.sprite.active) return;
      this.physics.add.collider(this.player.sprite, plat.sprite, (obj1: any) => {
        if (obj1 === this.player.sprite) {
          const body = this.player.sprite.body as Phaser.Physics.Arcade.Body;
          if (body && body.velocity.y >= 0 && this.player.sprite.y < plat.sprite.y - 10) {
            this.player.setGrounded(true);
            if (plat.type === 'bounce') {
              this.player.sprite.setVelocityY(PLAYER.bounceForce);
              this.player.setGrounded(false);
            }
            if (plat.type === 'falling') plat.activate();
          }
        }
      });
    });

    // Oyuncu - Tehlikeler
    if (this.hazards) {
      this.physics.add.overlap(this.player.sprite, this.hazards, () => {
        this.player.takeDamage();
        if (this.audio) this.audio.playHit();
      });
    }

    // Oyuncu - Düşmanlar
    this.enemies.forEach(enemy => {
      if (!enemy.sprite.active) return;
      this.physics.add.overlap(this.player.sprite, enemy.sprite, () => {
        if (!enemy.alive) return;
        const playerBottom = this.player.sprite.y + PLAYER.height / 2;
        const enemyTop = enemy.sprite.y - enemy.sprite.height / 2;
        const playerVy = this.player.sprite.body ? (this.player.sprite.body as Phaser.Physics.Arcade.Body).velocity.y : 0;
        
        if (playerVy > 0 && playerBottom < enemyTop + 15) {
          const killed = enemy.takeDamage();
          this.player.sprite.setVelocityY(-300);
          if (killed) {
            this.player.addScore(100);
            if (this.audio) this.audio.playCoin();
          }
        } else {
          this.player.takeDamage();
          if (this.audio) this.audio.playHit();
        }
      });
    });

    // Oyuncu - Koleksiyonlar
    this.collectibles.forEach(col => {
      if (!col.sprite.active) return;
      this.physics.add.overlap(this.player.sprite, col.sprite, () => {
        if (col.collected) return;
        col.collect();
        if (col.type === 'coin') {
          this.player.addScore(10);
          if (this.audio) this.audio.playCoin();
        } else if (col.type === 'special') {
          this.save.specialsCollected.push(col.id);
          this.player.addScore(500);
          if (this.audio) this.audio.playPowerUp();
        } else if (col.type === 'powerup' && col.powerUpType) {
          this.player.setPowerUp(col.powerUpType);
          if (this.audio) this.audio.playPowerUp();
        }
      });
    });

    // Oyuncu - Boss
    if (this.boss && this.boss.sprite.active) {
      this.physics.add.overlap(this.player.sprite, this.boss.sprite, () => {
        if (!this.boss || !this.boss.alive) return;
        const playerBottom = this.player.sprite.y + PLAYER.height / 2;
        const bossTop = this.boss.sprite.y - this.boss.sprite.height / 2;
        const playerVy = this.player.sprite.body ? (this.player.sprite.body as Phaser.Physics.Arcade.Body).velocity.y : 0;
        
        if (playerVy > 0 && playerBottom < bossTop + 20) {
          const killed = this.boss.takeDamage();
          this.player.sprite.setVelocityY(-350);
          if (this.audio) this.audio.playBossHit();
          if (killed) {
            this.player.addScore(2000);
            if (this.audio) this.audio.playVictory();
          }
        } else {
          this.player.takeDamage();
          if (this.audio) this.audio.playHit();
        }
      });

      // Boss mermileri
      this.physics.add.overlap(this.player.sprite, this.boss.getProjGroup(), () => {
        this.player.takeDamage();
        if (this.audio) this.audio.playHit();
      });
    }

    // Düşman mermileri
    this.enemies.forEach(enemy => {
      const pg = enemy.getProjGroup();
      if (pg) {
        this.physics.add.overlap(this.player.sprite, pg, () => {
          this.player.takeDamage();
          if (this.audio) this.audio.playHit();
        });
      }
    });

    // Oyuncu kıvılcım - düşmanlar
    const sparkGroup = this.player.getSparkGroup();
    if (sparkGroup) {
      this.enemies.forEach(enemy => {
        if (!enemy.sprite.active) return;
        this.physics.add.overlap(sparkGroup, enemy.sprite, (_obj1: any, obj2: any) => {
          if (!enemy.alive) return;
          enemy.takeDamage();
          if (obj2 && obj2.setActive) { obj2.setActive(false); obj2.setVisible(false); }
        });
      });
    }

    // Kontrol noktaları
    const checkpointSprites = this.children.list.filter(c => 
      c.type === 'Sprite' && 
      typeof (c as any).getData === 'function' && 
      (c as any).getData('checkpointId')
    ) as Phaser.GameObjects.Sprite[];
    
    checkpointSprites.forEach(cpSprite => {
      this.physics.add.overlap(this.player.sprite, cpSprite, (_obj1: any, obj2: any) => {
        const cpId = obj2.getData('checkpointId');
        if (cpId && !this.activatedCheckpoints.has(cpId)) {
          this.activatedCheckpoints.add(cpId);
          const pos = obj2.getData('pos');
          if (pos) this.checkpointPos = pos;
          obj2.setTexture('checkpoint_active');
          if (this.audio) this.audio.playCoin();
        }
      });
    });

    // Zemin kontrolü
    if (this.player.sprite.body) {
      (this.player.sprite.body as Phaser.Physics.Arcade.Body).onWorldBounds = true;
    }
  }

  private setupEvents(): void {
    this.events.on('playerJump', () => { if (this.audio) this.audio.playJump(); });
    this.events.on('playerLand', () => { if (this.audio) this.audio.playLand(); });
    this.events.on('playerDeath', () => {
      if (this.audio) this.audio.playDeath();
      this.time.delayedCall(1500, () => {
        this.player.respawn(this.checkpointPos.x, this.checkpointPos.y);
      });
    });
  }

  update(_time: number, dt: number): void {
    if (this.paused) return;
    const deltaSec = Math.min(dt / 1000, 0.05);
    this.levelTime += deltaSec;

    // Oyuncu güncelleme
    const touchInput = this.touchControls ? this.touchControls.getInput() : undefined;
    this.player.update(deltaSec, touchInput);

    // Zemin kontrolü
    const body = this.player.sprite.body as Phaser.Physics.Arcade.Body;
    if (body) {
      if (body.touching.down || body.blocked.down) {
        this.player.setGrounded(true);
      } else {
        this.player.setGrounded(false);
      }
    }

    // Düşmanlar
    this.enemies.forEach(e => {
      if (e.alive) e.update(deltaSec, this.player.sprite.x, this.player.sprite.y);
    });

    // Boss
    if (this.boss && this.boss.alive) {
      this.boss.update(deltaSec, this.player.sprite.x, this.player.sprite.y);
    }

    // Platformlar
    this.platforms.forEach(p => {
      if (!p.broken) p.update(deltaSec);
    });

    // Ölüm kontrolü
    if (this.player.sprite.y > this.level.height + 100) {
      this.player.die();
    }

    // Bölüm sonu
    if (!this.level.isBoss && this.player.sprite.x >= this.level.endX) {
      this.completeLevel();
    }

    // Boss yenilgi
    if (this.level.isBoss && this.boss && !this.boss.alive) {
      this.completeLevel();
    }

    // HUD güncelle
    this.hud.update(this.player.state, this.levelTime, this.level);
  }

  private completeLevel(): void {
    if (this.audio) { this.audio.stopMusic(); this.audio.playVictory(); }
    
    if (!this.save.levelsCompleted.includes(this.level.id)) {
      this.save.levelsCompleted.push(this.level.id);
    }
    if (this.level.isBoss && this.level.bossDef) {
      if (!this.save.bossDefeated.includes(this.level.bossDef.id)) {
        this.save.bossDefeated.push(this.level.bossDef.id);
      }
      if (this.save.worldsUnlocked <= this.level.world) {
        this.save.worldsUnlocked = Math.min(6, this.level.world + 1);
      }
    }
    this.save.score = Math.max(this.save.score, this.player.state.score);
    const bestKey = this.level.id;
    if (!this.save.bestTimes[bestKey] || this.levelTime < this.save.bestTimes[bestKey]) {
      this.save.bestTimes[bestKey] = this.levelTime;
    }
    saveGame(this.save);
    (this.game as any).currentSave = this.save;
    (this.game as any).lastResults = {
      level: this.level,
      time: this.levelTime,
      score: this.player.state.score,
    };

    this.time.delayedCall(1000, () => {
      this.scene.start('Results');
    });
  }

  private togglePause(): void {
    this.paused = !this.paused;
    if (this.paused) {
      this.physics.world.pause();
      this.showPauseMenu();
    } else {
      this.physics.world.resume();
      this.hidePauseMenu();
    }
  }

  private showPauseMenu(): void {
    const cx = GAME_CONFIG.logicalWidth / 2;
    const cy = GAME_CONFIG.logicalHeight / 2;
    
    this.pauseOverlay = this.add.container(0, 0);
    this.pauseOverlay.setDepth(1000);
    
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, GAME_CONFIG.logicalWidth, GAME_CONFIG.logicalHeight);
    this.pauseOverlay.add(overlay);

    const title = this.add.text(cx, cy - 80, t('pause'), {
      fontSize: '36px', fontFamily: 'Arial, sans-serif', color: '#2dd4bf',
    }).setOrigin(0.5);
    this.pauseOverlay.add(title);

    const btns = [
      { label: t('resume'), action: () => this.togglePause() },
      { label: t('restart'), action: () => { this.paused = false; this.physics.world.resume(); this.scene.restart(); } },
      { label: t('quitToMap'), action: () => { if (this.audio) this.audio.stopMusic(); this.scene.start('WorldMap'); } },
      { label: t('quitToMenu'), action: () => { if (this.audio) this.audio.stopMusic(); this.scene.start('Menu'); } },
    ];

    btns.forEach((btn, i) => {
      const txt = this.add.text(cx, cy + i * 50, btn.label, {
        fontSize: '20px', fontFamily: 'Arial, sans-serif', color: '#e2e8f0',
        backgroundColor: '#1e293b', padding: { x: 20, y: 8 },
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      txt.on('pointerdown', btn.action);
      this.pauseOverlay!.add(txt);
    });
  }

  private hidePauseMenu(): void {
    if (this.pauseOverlay) { this.pauseOverlay.destroy(); this.pauseOverlay = null; }
  }

  shutdown(): void {
    if (this.audio) this.audio.stopMusic();
    this.enemies.forEach(e => e.destroy());
    this.collectibles.forEach(c => c.destroy());
    this.platforms.forEach(p => p.destroy());
    if (this.boss) this.boss.destroy();
    if (this.player) this.player.destroy();
    if (this.touchControls) this.touchControls.destroy();
  }
}

// ---- HUD ----
class HUD {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private livesText: Phaser.GameObjects.Text;
  private scoreText: Phaser.GameObjects.Text;
  private timeText: Phaser.GameObjects.Text;
  private powerUpText: Phaser.GameObjects.Text;
  private levelText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, save: SaveData) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setScrollFactor(0);
    this.container.setDepth(100);

    // Arka plan şeridi
    const bg = scene.add.graphics();
    bg.fillStyle(0x000000, 0.5);
    bg.fillRoundedRect(10, 10, 320, 40, 8);
    this.container.add(bg);

    this.livesText = scene.add.text(20, 18, `❤ ${save.lives}`, {
      fontSize: '16px', fontFamily: 'Arial, sans-serif', color: '#ef4444',
    });
    this.container.add(this.livesText);

    this.scoreText = scene.add.text(100, 18, `★ 0`, {
      fontSize: '16px', fontFamily: 'Arial, sans-serif', color: '#fbbf24',
    });
    this.container.add(this.scoreText);

    this.timeText = scene.add.text(180, 18, `⏱ 0:00`, {
      fontSize: '16px', fontFamily: 'Arial, sans-serif', color: '#60a5fa',
    });
    this.container.add(this.timeText);

    this.powerUpText = scene.add.text(20, 55, '', {
      fontSize: '14px', fontFamily: 'Arial, sans-serif', color: '#a78bfa',
    });
    this.container.add(this.powerUpText);

    this.levelText = scene.add.text(GAME_CONFIG.logicalWidth - 20, 18, '', {
      fontSize: '14px', fontFamily: 'Arial, sans-serif', color: '#94a3b8',
    }).setOrigin(1, 0);
    this.container.add(this.levelText);
  }

  update(state: any, time: number, level: LevelData): void {
    this.livesText.setText(`❤ ${state.lives}`);
    this.scoreText.setText(`★ ${state.score}`);
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    this.timeText.setText(`⏱ ${mins}:${secs.toString().padStart(2, '0')}`);
    
    if (state.powerUp) {
      const names: Record<string, string> = { shield: 'Kalkan', spark: 'Kıvılcım', cloak: 'Pelerin', boots: 'Çizme' };
      this.powerUpText.setText(`⚡ ${names[state.powerUp] || state.powerUp}`);
    } else {
      this.powerUpText.setText('');
    }

    this.levelText.setText(level.name);
  }
}

// ---- TOUCH CONTROLS ----
class TouchControls {
  private scene: Phaser.Scene;
  private left: boolean = false;
  private right: boolean = false;
  private jumpBtn: boolean = false;
  private jumpPressed: boolean = false;
  private jumpReleased: boolean = false;
  private abilityBtn: boolean = false;
  private pointers: Map<number, string> = new Map();
  private container: Phaser.GameObjects.Container;
  private onDown: (p: Phaser.Input.Pointer) => void;
  private onUp: (p: Phaser.Input.Pointer) => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setScrollFactor(0);
    this.container.setDepth(200);

    // Sol yön butonları
    const leftBtn = scene.add.text(60, GAME_CONFIG.logicalHeight - 80, '◀', {
      fontSize: '36px', color: '#ffffff80',
    }).setOrigin(0.5);
    leftBtn.setScrollFactor(0);

    const rightBtn = scene.add.text(160, GAME_CONFIG.logicalHeight - 80, '▶', {
      fontSize: '36px', color: '#ffffff80',
    }).setOrigin(0.5);
    rightBtn.setScrollFactor(0);

    // Zıplama
    const jumpB = scene.add.text(GAME_CONFIG.logicalWidth - 120, GAME_CONFIG.logicalHeight - 80, '▲', {
      fontSize: '36px', color: '#ffffff80',
    }).setOrigin(0.5);
    jumpB.setScrollFactor(0);

    // Yetenek
    const abilityB = scene.add.text(GAME_CONFIG.logicalWidth - 220, GAME_CONFIG.logicalHeight - 80, '✦', {
      fontSize: '30px', color: '#ffffff60',
    }).setOrigin(0.5);
    abilityB.setScrollFactor(0);

    this.container.add([leftBtn, rightBtn, jumpB, abilityB]);

    this.onDown = (pointer: Phaser.Input.Pointer) => {
      const x = pointer.x, y = pointer.y;
      if (x < 200 && y > GAME_CONFIG.logicalHeight - 140) {
        if (x < 110) { this.left = true; this.pointers.set(pointer.id, 'left'); }
        else { this.right = true; this.pointers.set(pointer.id, 'right'); }
      } else if (x > GAME_CONFIG.logicalWidth - 180 && y > GAME_CONFIG.logicalHeight - 140) {
        this.jumpBtn = true; this.jumpPressed = true;
        this.pointers.set(pointer.id, 'jump');
      } else if (x > GAME_CONFIG.logicalWidth - 280 && x < GAME_CONFIG.logicalWidth - 180 && y > GAME_CONFIG.logicalHeight - 140) {
        this.abilityBtn = true;
        this.pointers.set(pointer.id, 'ability');
      }
    };

    this.onUp = (pointer: Phaser.Input.Pointer) => {
      const action = this.pointers.get(pointer.id);
      if (action === 'left') this.left = false;
      else if (action === 'right') this.right = false;
      else if (action === 'jump') { this.jumpBtn = false; this.jumpReleased = true; }
      else if (action === 'ability') this.abilityBtn = false;
      this.pointers.delete(pointer.id);
    };

    scene.input.on('pointerdown', this.onDown);
    scene.input.on('pointerup', this.onUp);
  }

  getInput(): { left: boolean; right: boolean; jump: boolean; jumpPressed: boolean; jumpReleased: boolean; run: boolean; ability: boolean } {
    const input = {
      left: this.left,
      right: this.right,
      jump: this.jumpBtn,
      jumpPressed: this.jumpPressed,
      jumpReleased: this.jumpReleased,
      run: false,
      ability: this.abilityBtn,
    };
    this.jumpPressed = false;
    this.jumpReleased = false;
    return input;
  }

  destroy(): void {
    this.scene.input.off('pointerdown', this.onDown);
    this.scene.input.off('pointerup', this.onUp);
    this.container.destroy();
  }
}

// ---- RESULTS SCENE ----
export class ResultsScene extends Phaser.Scene {
  constructor() { super({ key: 'Results' }); }

  create(): void {
    const results = (this.game as any).lastResults;
    if (!results) { this.scene.start('Menu'); return; }
    
    const level: LevelData = results.level;
    const time: number = results.time;
    const score: number = results.score;
    const save: SaveData = (this.game as any).currentSave || createEmptySave(0);

    const cx = GAME_CONFIG.logicalWidth / 2;

    const bg = this.add.graphics();
    bg.fillStyle(0x0a1628, 1);
    bg.fillRect(0, 0, GAME_CONFIG.logicalWidth, GAME_CONFIG.logicalHeight);

    const title = level.isBoss ? t('bossDefeated') : t('levelComplete');
    this.add.text(cx, 120, title, {
      fontSize: '40px', fontFamily: 'Arial, sans-serif', color: '#4ade80',
    }).setOrigin(0.5);

    this.add.text(cx, 200, level.name, {
      fontSize: '24px', fontFamily: 'Arial, sans-serif', color: '#94a3b8',
    }).setOrigin(0.5);

    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    this.add.text(cx, 280, `${t('time')}: ${mins}:${secs.toString().padStart(2, '0')}`, {
      fontSize: '22px', fontFamily: 'Arial, sans-serif', color: '#60a5fa',
    }).setOrigin(0.5);

    this.add.text(cx, 320, `${t('score')}: ${score}`, {
      fontSize: '22px', fontFamily: 'Arial, sans-serif', color: '#fbbf24',
    }).setOrigin(0.5);

    const bestTime = save.bestTimes[level.id];
    if (bestTime) {
      const bm = Math.floor(bestTime / 60);
      const bs = Math.floor(bestTime % 60);
      this.add.text(cx, 360, `${t('bestTime')}: ${bm}:${bs.toString().padStart(2, '0')}`, {
        fontSize: '18px', fontFamily: 'Arial, sans-serif', color: '#a78bfa',
      }).setOrigin(0.5);
    }

    // Butonlar
    const buttons = [
      { label: t('nextLevel'), action: () => this.nextLevel(level, save) },
      { label: t('retry'), action: () => { (this.game as any).pendingLevelId = level.id; this.scene.start('Play'); } },
      { label: t('quitToMap'), action: () => this.scene.start('WorldMap') },
      { label: t('quitToMenu'), action: () => this.scene.start('Menu') },
    ];

    buttons.forEach((btn, i) => {
      const txt = this.add.text(cx, 430 + i * 50, btn.label, {
        fontSize: '20px', fontFamily: 'Arial, sans-serif', color: '#e2e8f0',
        backgroundColor: '#1e293b', padding: { x: 20, y: 8 },
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      txt.on('pointerdown', btn.action);
    });
  }

  private nextLevel(level: LevelData, save: SaveData): void {
    const allLevels = getAllLevels();
    const idx = allLevels.findIndex(l => l.id === level.id);
    if (idx >= 0 && idx < allLevels.length - 1) {
      const next = allLevels[idx + 1];
      if (next.world > save.worldsUnlocked) {
        this.scene.start('WorldMap');
        return;
      }
      (this.game as any).pendingLevelId = next.id;
      this.scene.start('Play');
    } else {
      this.scene.start('WorldMap');
    }
  }
}
