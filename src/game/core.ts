// ============================================
// KIVILCIM — GÖK YÜZÜ ADALARI
// Temel Tipler, Sabitler, Kayıt ve Ses Sistemi
// ============================================

// ---- TİP TANIMLARI ----

export interface GameConfig {
  logicalWidth: number;
  logicalHeight: number;
  gravity: number;
  maxFPS: number;
  physicsFPS: number;
}

export interface PlayerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
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
  animState: PlayerAnim;
}

export type PlayerAnim = 'idle' | 'walk' | 'run' | 'brake' | 'jump' | 'fall' | 'land' | 'crouch' | 'attack' | 'hurt' | 'dead' | 'victory';

export type PowerUpType = 'shield' | 'spark' | 'cloak' | 'boots';

export interface EnemyDef {
  id: string;
  type: EnemyType;
  x: number;
  y: number;
  patrolRange?: number;
  direction?: 1 | -1;
}

export type EnemyType = 'patrol' | 'edge' | 'jumper' | 'flyer' | 'shooter' | 'shielded' | 'charger' | 'burrower';

export interface PlatformDef {
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'solid' | 'oneway' | 'moving' | 'falling' | 'bounce' | 'breakable' | 'reward';
  moveAxis?: 'x' | 'y';
  moveRange?: number;
  moveSpeed?: number;
  rewardType?: string;
}

export interface CollectibleDef {
  id: string;
  x: number;
  y: number;
  type: 'coin' | 'special' | 'powerup';
  powerUpType?: PowerUpType;
}

export interface HazardDef {
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'spikes' | 'lava' | 'falling' | 'crusher';
  active?: boolean;
  cycleTime?: number;
}

export interface CheckpointDef {
  id: string;
  x: number;
  y: number;
}

export interface LevelData {
  id: string;
  world: number;
  stage: number;
  name: string;
  isBoss: boolean;
  width: number;
  height: number;
  bgColor: string;
  bgColor2: string;
  platforms: PlatformDef[];
  enemies: EnemyDef[];
  collectibles: CollectibleDef[];
  hazards: HazardDef[];
  checkpoints: CheckpointDef[];
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  cameraBounds?: { left: number; right: number; top: number; bottom: number };
  bossDef?: BossDef;
  parallaxLayers: ParallaxLayer[];
}

export interface ParallaxLayer {
  color: string;
  speed: number;
  elements: { x: number; y: number; w: number; h: number; type: string }[];
}

export interface BossDef {
  id: string;
  name: string;
  hp: number;
  phases: number;
  arenaLeft: number;
  arenaRight: number;
  arenaTop: number;
  arenaBottom: number;
  patterns: BossPattern[];
}

export interface BossPattern {
  type: 'charge' | 'projectile' | 'summon' | 'slam' | 'sweep';
  damage: number;
  duration: number;
  cooldown: number;
  telegraph: number;
}

export interface SaveData {
  version: number;
  slot: number;
  playerName: string;
  worldsUnlocked: number;
  levelsCompleted: string[];
  bossDefeated: string[];
  specialsCollected: string[];
  bestTimes: Record<string, number>;
  highScores: Record<string, number>;
  currentLevel: string | null;
  currentCheckpoint: string | null;
  lives: number;
  score: number;
  settings: GameSettings;
  timestamp: number;
}

export interface GameSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  screenShake: boolean;
  autoRun: boolean;
  quality: 'auto' | '720p' | '1080p' | '1440p' | '4k';
  language: 'tr' | 'en';
  accessibility: {
    extraLives: boolean;
    wideTolerance: boolean;
    simplifiedControls: boolean;
  };
  keyBindings: Record<string, string>;
}

// ---- SABİTLER ----

export const GAME_CONFIG: GameConfig = {
  logicalWidth: 1280,
  logicalHeight: 720,
  gravity: 1200,
  maxFPS: 60,
  physicsFPS: 60,
};

export const PLAYER = {
  width: 32,
  height: 48,
  walkSpeed: 200,
  runSpeed: 360,
  acceleration: 1200,
  deceleration: 1800,
  airAcceleration: 800,
  jumpForce: -520,
  jumpHoldForce: -280,
  maxJumpTime: 0.25,
  maxFallSpeed: 700,
  coyoteTime: 0.1,
  jumpBuffer: 0.12,
  invincibleTime: 1.2,
  maxLives: 3,
  bounceForce: -650,
};

export const TILE = 40;

export const WORLDS = [
  { id: 1, name: 'Çiy Bahçeleri', color: '#4ade80', bgColor: '#0f2b1a', bgColor2: '#1a4a2e', theme: 'garden' },
  { id: 2, name: 'Bakır Ocakları', color: '#f59e0b', bgColor: '#2d1a0a', bgColor2: '#4a2d15', theme: 'mines' },
  { id: 3, name: 'Rüzgâr Kemerleri', color: '#60a5fa', bgColor: '#0a1a2d', bgColor2: '#152d4a', theme: 'wind' },
  { id: 4, name: 'Buzlu Aynalar', color: '#a5f3fc', bgColor: '#0a1a2d', bgColor2: '#1a3050', theme: 'ice' },
  { id: 5, name: 'Köz Nehri', color: '#ef4444', bgColor: '#2d0a0a', bgColor2: '#4a1515', theme: 'lava' },
  { id: 6, name: 'Fırtına Hisarı', color: '#a855f7', bgColor: '#1a0a2d', bgColor2: '#2d154a', theme: 'storm' },
];

export const BOSS_DATA: BossDef[] = [
  {
    id: 'boss1', name: 'Kök Bekçisi', hp: 8, phases: 2,
    arenaLeft: 200, arenaRight: 1080, arenaTop: 200, arenaBottom: 640,
    patterns: [
      { type: 'charge', damage: 1, duration: 1.5, cooldown: 2, telegraph: 0.8 },
      { type: 'summon', damage: 1, duration: 2, cooldown: 3, telegraph: 0.5 },
    ]
  },
  {
    id: 'boss2', name: 'Pres Ustası', hp: 10, phases: 2,
    arenaLeft: 160, arenaRight: 1120, arenaTop: 100, arenaBottom: 640,
    patterns: [
      { type: 'slam', damage: 1, duration: 1, cooldown: 2.5, telegraph: 1 },
      { type: 'projectile', damage: 1, duration: 2, cooldown: 3, telegraph: 0.6 },
    ]
  },
  {
    id: 'boss3', name: 'Pusula Kuşu', hp: 10, phases: 2,
    arenaLeft: 100, arenaRight: 1180, arenaTop: 100, arenaBottom: 600,
    patterns: [
      { type: 'sweep', damage: 1, duration: 2, cooldown: 2.5, telegraph: 0.7 },
      { type: 'projectile', damage: 1, duration: 1.5, cooldown: 2, telegraph: 0.5 },
    ]
  },
  {
    id: 'boss4', name: 'Prizma Geyiği', hp: 12, phases: 2,
    arenaLeft: 200, arenaRight: 1080, arenaTop: 200, arenaBottom: 640,
    patterns: [
      { type: 'charge', damage: 1, duration: 1.2, cooldown: 2, telegraph: 0.9 },
      { type: 'summon', damage: 1, duration: 2.5, cooldown: 3.5, telegraph: 0.6 },
    ]
  },
  {
    id: 'boss5', name: 'Ocak Kalbi', hp: 14, phases: 3,
    arenaLeft: 160, arenaRight: 1120, arenaTop: 100, arenaBottom: 640,
    patterns: [
      { type: 'slam', damage: 1, duration: 1.5, cooldown: 2, telegraph: 1.2 },
      { type: 'projectile', damage: 1, duration: 2, cooldown: 2.5, telegraph: 0.7 },
    ]
  },
  {
    id: 'boss6', name: 'Fırtına Çekirdeği', hp: 16, phases: 3,
    arenaLeft: 100, arenaRight: 1180, arenaTop: 80, arenaBottom: 640,
    patterns: [
      { type: 'charge', damage: 1, duration: 1.5, cooldown: 1.8, telegraph: 0.6 },
      { type: 'sweep', damage: 1, duration: 2, cooldown: 2.5, telegraph: 0.8 },
      { type: 'projectile', damage: 1, duration: 2, cooldown: 3, telegraph: 0.5 },
    ]
  },
];

// ---- KAYIT SİSTEMİ ----

const SAVE_KEY = 'kivilsicim_save';
const SAVE_VERSION = 1;

export function getDefaultSettings(): GameSettings {
  return {
    masterVolume: 0.8,
    musicVolume: 0.6,
    sfxVolume: 0.8,
    screenShake: true,
    autoRun: false,
    quality: 'auto',
    language: 'tr',
    accessibility: {
      extraLives: false,
      wideTolerance: false,
      simplifiedControls: false,
    },
    keyBindings: {
      left: 'ArrowLeft,A',
      right: 'ArrowRight,D',
      jump: 'Space',
      run: 'ShiftLeft,ShiftRight',
      ability: 'KeyE',
      pause: 'Escape',
    },
  };
}

export function createEmptySave(slot: number): SaveData {
  return {
    version: SAVE_VERSION,
    slot,
    playerName: `Oyuncu ${slot}`,
    worldsUnlocked: 1,
    levelsCompleted: [],
    bossDefeated: [],
    specialsCollected: [],
    bestTimes: {},
    highScores: {},
    currentLevel: null,
    currentCheckpoint: null,
    lives: PLAYER.maxLives,
    score: 0,
    settings: getDefaultSettings(),
    timestamp: Date.now(),
  };
}

export function saveGame(data: SaveData): boolean {
  try {
    const saves = loadAllSaves();
    data.timestamp = Date.now();
    saves[data.slot] = data;
    localStorage.setItem(SAVE_KEY, JSON.stringify(saves));
    return true;
  } catch {
    return false;
  }
}

export function loadSave(slot: number): SaveData | null {
  try {
    const saves = loadAllSaves();
    return saves[slot] || null;
  } catch {
    return null;
  }
}

export function loadAllSaves(): (SaveData | null)[] {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return [null, null, null];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [null, null, null];
    return [parsed[0] || null, parsed[1] || null, parsed[2] || null];
  } catch {
    return [null, null, null];
  }
}

export function deleteSave(slot: number): void {
  try {
    const saves = loadAllSaves();
    saves[slot] = null;
    localStorage.setItem(SAVE_KEY, JSON.stringify(saves));
  } catch { /* ignore */ }
}

export function exportSave(slot: number): string | null {
  const data = loadSave(slot);
  if (!data) return null;
  return btoa(JSON.stringify(data));
}

export function importSave(slot: number, encoded: string): boolean {
  try {
    const json = atob(encoded);
    const data = JSON.parse(json) as SaveData;
    if (!data.version || !data.slot) return false;
    data.slot = slot;
    return saveGame(data);
  } catch {
    return false;
  }
}

// ---- SES SİSTEMİ (Web Audio API ile prosedürel) ----

export class AudioSystem {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private currentMusic: OscillatorNode | null = null;
  private musicInterval: number | null = null;
  private muted = false;

  init(): void {
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      if (!this.ctx) return;
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.8;
      this.masterGain.connect(this.ctx.destination);
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.3;
      if (this.musicGain && this.masterGain) this.musicGain.connect(this.masterGain);
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.6;
      if (this.sfxGain && this.masterGain) this.sfxGain.connect(this.masterGain);
    } catch (e) {
      console.warn('Audio init hatası:', e);
    }
  }

  resume(): void {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setMasterVolume(v: number): void {
    if (this.masterGain) this.masterGain.gain.value = v;
  }

  setMusicVolume(v: number): void {
    if (this.musicGain) this.musicGain.gain.value = v * 0.5;
  }

  setSfxVolume(v: number): void {
    if (this.sfxGain) this.sfxGain.gain.value = v;
  }

  playTone(freq: number, duration: number, type: OscillatorType = 'square', volume = 0.3): void {
    if (!this.ctx || !this.sfxGain || this.muted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = volume;
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playJump(): void { this.playTone(400, 0.1, 'square', 0.2); setTimeout(() => this.playTone(600, 0.1, 'square', 0.15), 50); }
  playLand(): void { this.playTone(150, 0.08, 'triangle', 0.2); }
  playCoin(): void { this.playTone(880, 0.08, 'square', 0.2); setTimeout(() => this.playTone(1100, 0.12, 'square', 0.15), 80); }
  playHit(): void { this.playTone(200, 0.15, 'sawtooth', 0.3); }
  playDeath(): void { this.playTone(400, 0.1, 'square', 0.3); setTimeout(() => this.playTone(300, 0.1, 'square', 0.25), 100); setTimeout(() => this.playTone(200, 0.2, 'square', 0.2), 200); }
  playPowerUp(): void { this.playTone(500, 0.08, 'square', 0.2); setTimeout(() => this.playTone(700, 0.08, 'square', 0.2), 80); setTimeout(() => this.playTone(900, 0.12, 'square', 0.2), 160); }
  playBlockBreak(): void { this.playTone(300, 0.05, 'noise' as any, 0.2); this.playTone(150, 0.1, 'triangle', 0.2); }
  playBossHit(): void { this.playTone(100, 0.2, 'sawtooth', 0.4); }
  playVictory(): void { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.playTone(f, 0.2, 'square', 0.2), i * 150)); }

  playMusic(world: number): void {
    this.stopMusic();
    if (!this.ctx || !this.musicGain) return;
    
    const scales = [
      [262, 294, 330, 349, 392, 440, 494], // C major - garden
      [262, 294, 311, 349, 392, 415, 466], // C minor - mines
      [277, 311, 349, 370, 415, 466, 494], // Db major - wind
      [262, 294, 330, 349, 392, 440, 494], // C major bright - ice
      [247, 277, 311, 330, 370, 415, 466], // B minor - lava
      [262, 311, 330, 370, 392, 440, 494], // C mix - storm
    ];
    
    const scale = scales[(world - 1) % scales.length];
    let noteIndex = 0;
    
    this.musicInterval = window.setInterval(() => {
      if (!this.ctx || !this.musicGain || this.muted) return;
      const freq = scale[noteIndex % scale.length];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = world % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.value = freq * (Math.random() > 0.7 ? 2 : 1);
      gain.gain.value = 0.15;
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(this.musicGain!);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
      noteIndex++;
      if (noteIndex > 16) noteIndex = 0;
    }, 350);
  }

  stopMusic(): void {
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.currentMusic) {
      try { this.currentMusic.stop(); } catch { /* */ }
      this.currentMusic = null;
    }
  }

  destroy(): void {
    this.stopMusic();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

// ---- YERELLEŞTİRME ----

export const L10N = {
  tr: {
    title: 'KIVILCIM',
    subtitle: 'Gök Yüzü Adaları',
    newGame: 'Yeni Oyun',
    continue: 'Devam Et',
    worldMap: 'Dünya Haritası',
    timeTrial: 'Zaman Yarışı',
    settings: 'Ayarlar',
    howToPlay: 'Nasıl Oynanır',
    credits: 'Jenerik',
    pause: 'Duraklat',
    resume: 'Devam',
    restart: 'Yeniden Başlat',
    quitToMap: 'Haritaya Dön',
    quitToMenu: 'Ana Menü',
    lives: 'Can',
    score: 'Puan',
    time: 'Süre',
    levelComplete: 'Bölüm Tamamlandı!',
    bossDefeated: 'Boss Yenildi!',
    gameOver: 'Oyun Bitti',
    retry: 'Tekrar Dene',
    nextLevel: 'Sonraki Bölüm',
    world: 'Dünya',
    stage: 'Bölüm',
    bestTime: 'En İyi Süre',
    collectibles: 'Koleksiyon',
    locked: 'Kilitli',
    selectSlot: 'Kayıt Yuvası Seç',
    empty: 'Boş',
    masterVol: 'Ana Ses',
    musicVol: 'Müzik',
    sfxVol: 'Efekt',
    quality: 'Grafik Kalitesi',
    auto: 'Otomatik',
    screenShake: 'Ekran Sarsıntısı',
    autoRun: 'Otomatik Koşma',
    back: 'Geri',
    play: 'Oyna',
    controls: 'Kontroller',
    move: 'Hareket',
    jump: 'Zıpla',
    run: 'Koş',
    ability: 'Yetenek',
    pauseKey: 'Duraklat',
    touchHint: 'Yatay çevirin',
    loading: 'Yükleniyor',
    noWebGL: 'WebGL desteklenmiyor',
    gameComplete: 'Tebrikler! Tüm adaları kurtardın!',
    worldNames: ['Çiy Bahçeleri', 'Bakır Ocakları', 'Rüzgâr Kemerleri', 'Buzlu Aynalar', 'Köz Nehri', 'Fırtına Hisarı'],
  },
  en: {
    title: 'KIVILCIM',
    subtitle: 'Sky Islands',
    newGame: 'New Game',
    continue: 'Continue',
    worldMap: 'World Map',
    timeTrial: 'Time Trial',
    settings: 'Settings',
    howToPlay: 'How to Play',
    credits: 'Credits',
    pause: 'Pause',
    resume: 'Resume',
    restart: 'Restart',
    quitToMap: 'World Map',
    quitToMenu: 'Main Menu',
    lives: 'Lives',
    score: 'Score',
    time: 'Time',
    levelComplete: 'Level Complete!',
    bossDefeated: 'Boss Defeated!',
    gameOver: 'Game Over',
    retry: 'Retry',
    nextLevel: 'Next Level',
    world: 'World',
    stage: 'Stage',
    bestTime: 'Best Time',
    collectibles: 'Collectibles',
    locked: 'Locked',
    selectSlot: 'Select Save Slot',
    empty: 'Empty',
    masterVol: 'Master',
    musicVol: 'Music',
    sfxVol: 'SFX',
    quality: 'Quality',
    auto: 'Auto',
    screenShake: 'Screen Shake',
    autoRun: 'Auto Run',
    back: 'Back',
    play: 'Play',
    controls: 'Controls',
    move: 'Move',
    jump: 'Jump',
    run: 'Run',
    ability: 'Ability',
    pauseKey: 'Pause',
    touchHint: 'Rotate to landscape',
    loading: 'Loading',
    noWebGL: 'WebGL not supported',
    gameComplete: 'Congratulations! You saved all islands!',
    worldNames: ['Dew Gardens', 'Copper Mines', 'Wind Arches', 'Frozen Mirrors', 'Ember River', 'Storm Fortress'],
  }
};

export function t(key: string, lang: 'tr' | 'en' = 'tr'): string {
  const trVal = (L10N.tr as any)[key];
  const enVal = (L10N.en as any)[key];
  if (lang === 'en' && enVal) return enVal;
  return trVal || enVal || key;
}
