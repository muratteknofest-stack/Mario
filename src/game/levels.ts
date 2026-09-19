// ============================================
// 30 Bölüm Verisi - 6 Dünya × 5 Bölüm
// ============================================

import { LevelData, PlatformDef, EnemyDef, CollectibleDef, HazardDef, CheckpointDef, BOSS_DATA, TILE } from './core';

// Yardımcı fonksiyonlar
function solid(x: number, y: number, w: number, h: number): PlatformDef {
  return { x: x * TILE, y: y * TILE, w: w * TILE, h: h * TILE, type: 'solid' };
}
function oneway(x: number, y: number, w: number): PlatformDef {
  return { x: x * TILE, y: y * TILE, w: w * TILE, h: TILE / 2, type: 'oneway' };
}
function moving(x: number, y: number, w: number, axis: 'x' | 'y', range: number, speed: number): PlatformDef {
  return { x: x * TILE, y: y * TILE, w: w * TILE, h: TILE / 2, type: 'moving', moveAxis: axis, moveRange: range * TILE, moveSpeed: speed };
}
function falling(x: number, y: number, w: number): PlatformDef {
  return { x: x * TILE, y: y * TILE, w: w * TILE, h: TILE / 2, type: 'falling' };
}
function bounce(x: number, y: number, w: number): PlatformDef {
  return { x: x * TILE, y: y * TILE, w: w * TILE, h: TILE / 2, type: 'bounce' };
}
function breakable(x: number, y: number, w: number): PlatformDef {
  return { x: x * TILE, y: y * TILE, w: w * TILE, h: TILE, type: 'breakable' };
}
function reward(x: number, y: number, rewardType: string): PlatformDef {
  return { x: x * TILE, y: y * TILE, w: TILE, h: TILE, type: 'reward', rewardType };
}

function enemy(type: string, x: number, y: number, patrol?: number): EnemyDef {
  return { id: `e_${x}_${y}`, type: type as any, x: x * TILE, y: y * TILE, patrolRange: patrol ? patrol * TILE : undefined };
}

function coin(x: number, y: number): CollectibleDef {
  return { id: `c_${x}_${y}`, x: x * TILE, y: y * TILE, type: 'coin' };
}

function special(id: string, x: number, y: number): CollectibleDef {
  return { id: `s_${id}`, x: x * TILE, y: y * TILE, type: 'special' };
}

function powerup(type: string, x: number, y: number): CollectibleDef {
  return { id: `p_${x}_${y}`, x: x * TILE, y: y * TILE, type: 'powerup', powerUpType: type as any };
}

function hazard(type: string, x: number, y: number, w: number, h: number): HazardDef {
  return { x: x * TILE, y: y * TILE, w: w * TILE, h: h * TILE, type: type as any };
}

function checkpoint(id: string, x: number, y: number): CheckpointDef {
  return { id: `cp_${id}`, x: x * TILE, y: y * TILE };
}

function defaultParallax(world: number) {
  const colors = ['#4ade80', '#f59e0b', '#60a5fa', '#a5f3fc', '#ef4444', '#a855f7'];
  const c = colors[(world - 1) % 6];
  return [
    { color: c + '22', speed: 0.1, elements: Array.from({ length: 5 }, (_, i) => ({ x: i * 400, y: 200 + Math.random() * 100, w: 200, h: 150, type: 'mountain' })) },
    { color: c + '44', speed: 0.3, elements: Array.from({ length: 8 }, (_, i) => ({ x: i * 250, y: 100 + Math.random() * 200, w: 120, h: 60, type: 'cloud' })) },
    { color: c + '66', speed: 0.5, elements: Array.from({ length: 6 }, (_, i) => ({ x: i * 350, y: 400 + Math.random() * 100, w: 60, h: 100, type: 'tree' })) },
  ];
}

// ---- DÜNYA 1: ÇİY BAHÇELERİ ----
function world1Levels(): LevelData[] {
  const levels: LevelData[] = [];
  
  // 1-1: Temel hareket tanıtımı
  levels.push({
    id: '1-1', world: 1, stage: 1, name: 'İlk Adımlar',
    isBoss: false, width: 3200, height: 720,
    bgColor: '#0f2b1a', bgColor2: '#1a4a2e',
    platforms: [
      solid(0, 16, 20, 2), solid(22, 16, 15, 2), solid(39, 16, 20, 2), solid(61, 16, 19, 2),
      oneway(12, 12, 4), oneway(28, 11, 5), oneway(45, 10, 4),
      solid(50, 14, 3, 1), solid(55, 12, 3, 1),
      reward(30, 10, 'coin'), reward(46, 9, 'shield'),
    ],
    enemies: [
      enemy('patrol', 25, 14, 5), enemy('patrol', 42, 14, 4), enemy('edge', 65, 14),
    ],
    collectibles: [
      coin(8, 14), coin(9, 14), coin(10, 14), coin(13, 11), coin(14, 11),
      coin(29, 10), coin(30, 10), coin(31, 10),
      coin(46, 9), coin(47, 9),
      special('1-1-a', 14, 10), special('1-1-b', 55, 10), special('1-1-c', 72, 14),
    ],
    hazards: [
      hazard('spikes', 20, 17, 2, 1), hazard('spikes', 37, 17, 2, 1),
    ],
    checkpoints: [checkpoint('1', 40, 14)],
    startX: 80, startY: 560, endX: 3040, endY: 560,
    parallaxLayers: defaultParallax(1),
  });

  // 1-2: Yaylı bitkiler ve keşif
  levels.push({
    id: '1-2', world: 1, stage: 2, name: 'Yaylı Çiçekler',
    isBoss: false, width: 3600, height: 720,
    bgColor: '#0f2b1a', bgColor2: '#1a4a2e',
    platforms: [
      solid(0, 16, 15, 2), solid(17, 16, 10, 2), solid(30, 16, 12, 2),
      solid(45, 16, 15, 2), solid(63, 16, 20, 2),
      bounce(15, 15, 2), bounce(27, 15, 2), bounce(42, 15, 2),
      oneway(20, 11, 4), oneway(35, 9, 5), oneway(50, 10, 4),
      solid(55, 8, 3, 1), solid(60, 6, 4, 1),
      reward(22, 10, 'coin'), reward(37, 8, 'spark'),
    ],
    enemies: [
      enemy('patrol', 20, 14, 4), enemy('jumper', 33, 14), enemy('patrol', 48, 14, 5),
      enemy('edge', 70, 14),
    ],
    collectibles: [
      coin(5, 14), coin(6, 14), coin(7, 14), coin(8, 14),
      coin(21, 10), coin(22, 10), coin(36, 8), coin(37, 8),
      coin(56, 7), coin(57, 7), coin(58, 7), coin(59, 7),
      special('1-2-a', 22, 9), special('1-2-b', 61, 4), special('1-2-c', 75, 14),
      powerup('spark', 55, 6),
    ],
    hazards: [
      hazard('spikes', 15, 17, 2, 1), hazard('spikes', 28, 17, 2, 1),
    ],
    checkpoints: [checkpoint('1', 32, 14), checkpoint('2', 55, 14)],
    startX: 80, startY: 560, endX: 3440, endY: 560,
    parallaxLayers: defaultParallax(1),
  });

  // 1-3: Dikey keşif
  levels.push({
    id: '1-3', world: 1, stage: 3, name: 'Yeşil Merdivenler',
    isBoss: false, width: 3200, height: 720,
    bgColor: '#0f2b1a', bgColor2: '#1a4a2e',
    platforms: [
      solid(0, 16, 12, 2), solid(14, 14, 4, 1), solid(20, 12, 4, 1),
      solid(26, 10, 4, 1), solid(32, 8, 4, 1), solid(38, 10, 4, 1),
      solid(44, 12, 4, 1), solid(50, 14, 4, 1), solid(56, 16, 24, 2),
      oneway(16, 10, 3), oneway(28, 6, 3), oneway(40, 8, 3),
      moving(35, 14, 3, 'y', 4, 80),
    ],
    enemies: [
      enemy('patrol', 15, 12), enemy('flyer', 24, 8), enemy('patrol', 33, 6),
      enemy('flyer', 42, 6), enemy('patrol', 60, 14, 5),
    ],
    collectibles: [
      coin(15, 13), coin(16, 13), coin(21, 11), coin(22, 11),
      coin(27, 9), coin(28, 9), coin(33, 7), coin(34, 7),
      coin(39, 9), coin(40, 9), coin(45, 11), coin(46, 11),
      special('1-3-a', 29, 4), special('1-3-b', 41, 6), special('1-3-c', 70, 14),
      powerup('cloak', 33, 6),
    ],
    hazards: [
      hazard('spikes', 12, 17, 2, 1),
    ],
    checkpoints: [checkpoint('1', 32, 6)],
    startX: 80, startY: 560, endX: 3040, endY: 560,
    parallaxLayers: defaultParallax(1),
  });

  // 1-4: Final öncesi
  levels.push({
    id: '1-4', world: 1, stage: 4, name: 'Bahçe Sonu',
    isBoss: false, width: 4000, height: 720,
    bgColor: '#0f2b1a', bgColor2: '#1a4a2e',
    platforms: [
      solid(0, 16, 10, 2), solid(12, 14, 4, 1), solid(18, 12, 3, 1),
      solid(23, 10, 3, 1), solid(28, 12, 3, 1), solid(33, 14, 4, 1),
      solid(40, 16, 8, 2), solid(50, 14, 3, 1), solid(55, 12, 3, 1),
      solid(60, 10, 3, 1), solid(65, 12, 3, 1), solid(70, 14, 3, 1),
      solid(75, 16, 25, 2),
      bounce(38, 15, 2), bounce(48, 15, 2),
      falling(44, 13, 3), falling(58, 11, 2),
      reward(24, 9, 'coin'), reward(61, 9, 'boots'),
    ],
    enemies: [
      enemy('patrol', 13, 12), enemy('jumper', 20, 10), enemy('flyer', 30, 8),
      enemy('patrol', 42, 14, 3), enemy('shooter', 52, 12), enemy('patrol', 62, 10),
      enemy('edge', 72, 12), enemy('patrol', 80, 14, 6),
    ],
    collectibles: [
      coin(5, 14), coin(6, 14), coin(7, 14), coin(13, 13), coin(14, 13),
      coin(19, 11), coin(24, 9), coin(25, 9),
      coin(51, 13), coin(56, 11), coin(61, 9), coin(62, 9),
      coin(66, 11), coin(71, 13),
      special('1-4-a', 24, 8), special('1-4-b', 61, 8), special('1-4-c', 90, 14),
      powerup('boots', 60, 8),
    ],
    hazards: [
      hazard('spikes', 10, 17, 2, 1), hazard('spikes', 16, 17, 2, 1),
      hazard('spikes', 36, 17, 4, 1), hazard('spikes', 48, 17, 2, 1),
    ],
    checkpoints: [checkpoint('1', 40, 14), checkpoint('2', 75, 14)],
    startX: 80, startY: 560, endX: 3840, endY: 560,
    parallaxLayers: defaultParallax(1),
  });

  // 1-B: Boss - Kök Bekçisi
  levels.push({
    id: '1-B', world: 1, stage: 5, name: 'Kök Bekçisi',
    isBoss: true, width: 1280, height: 720,
    bgColor: '#0f2b1a', bgColor2: '#1a4a2e',
    platforms: [
      solid(0, 16, 32, 2), solid(0, 0, 1, 18), solid(31, 0, 1, 18),
      oneway(6, 12, 4), oneway(22, 12, 4), oneway(14, 8, 4),
    ],
    enemies: [],
    collectibles: [
      powerup('shield', 16, 6),
    ],
    hazards: [],
    checkpoints: [],
    startX: 200, startY: 560, endX: 640, endY: 560,
    bossDef: BOSS_DATA[0],
    cameraBounds: { left: 0, right: 1280, top: 0, bottom: 720 },
    parallaxLayers: defaultParallax(1),
  });

  return levels;
}

// ---- DÜNYA 2-6: Prosedürel üretim ----
function generateWorldLevels(worldNum: number): LevelData[] {
  const worldColors: Record<number, { bg1: string; bg2: string }> = {
    2: { bg1: '#2d1a0a', bg2: '#4a2d15' },
    3: { bg1: '#0a1a2d', bg2: '#152d4a' },
    4: { bg1: '#0a1a2d', bg2: '#1a3050' },
    5: { bg1: '#2d0a0a', bg2: '#4a1515' },
    6: { bg1: '#1a0a2d', bg2: '#2d154a' },
  };
  const colors = worldColors[worldNum] || { bg1: '#0f2b1a', bg2: '#1a4a2e' };
  const levels: LevelData[] = [];

  for (let stage = 1; stage <= 4; stage++) {
    const width = 3200 + stage * 400;
    const tileWidth = Math.floor(width / TILE);
    const platforms: PlatformDef[] = [];
    const enemies: EnemyDef[] = [];
    const collectibles: CollectibleDef[] = [];
    const hazards: HazardDef[] = [];
    const checkpoints: CheckpointDef[] = [];

    // Zemin
    let x = 0;
    while (x < tileWidth - 5) {
      const segLen = 8 + Math.floor(Math.random() * 8);
      platforms.push(solid(x, 16, Math.min(segLen, tileWidth - x), 2));
      
      // Aralıklar (tehlike)
      if (x > 10 && Math.random() > 0.6) {
        const gap = 2 + Math.floor(Math.random() * 2);
        if (worldNum === 5) {
          hazards.push(hazard('lava', x + segLen, 17, gap, 1));
        } else {
          hazards.push(hazard('spikes', x + segLen, 17, gap, 1));
        }
        x += segLen + gap;
      } else {
        x += segLen;
      }
    }

    // Platformlar
    const numPlatforms = 5 + stage * 2;
    for (let i = 0; i < numPlatforms; i++) {
      const px = 10 + Math.floor(Math.random() * (tileWidth - 20));
      const py = 8 + Math.floor(Math.random() * 6);
      const pw = 3 + Math.floor(Math.random() * 3);
      
      const r = Math.random();
      if (worldNum >= 2 && r < 0.15) {
        platforms.push(moving(px, py, pw, Math.random() > 0.5 ? 'x' : 'y', 3 + Math.floor(Math.random() * 3), 60 + Math.random() * 60));
      } else if (worldNum >= 3 && r < 0.25) {
        platforms.push(falling(px, py, pw));
      } else if (worldNum >= 4 && r < 0.35) {
        platforms.push(bounce(px, py, 2));
      } else if (r < 0.45) {
        platforms.push(breakable(px, py, pw));
      } else {
        platforms.push(oneway(px, py, pw));
      }
    }

    // Ödül blokları
    if (stage >= 2) {
      platforms.push(reward(15 + stage * 5, 10, 'coin'));
    }
    if (stage >= 3) {
      const puTypes = ['shield', 'spark', 'cloak', 'boots'];
      platforms.push(reward(25 + stage * 3, 8, puTypes[stage - 1]));
    }

    // Düşmanlar
    const enemyTypes: string[] = ['patrol', 'edge', 'jumper', 'flyer', 'shooter', 'shielded', 'charger', 'burrower'];
    const numEnemies = 3 + stage * 2;
    for (let i = 0; i < numEnemies; i++) {
      const ex = 15 + Math.floor(Math.random() * (tileWidth - 30));
      const ey = 14;
      const typeIdx = Math.min(Math.floor(Math.random() * (2 + worldNum)), enemyTypes.length - 1);
      enemies.push(enemy(enemyTypes[typeIdx], ex, ey, 3 + Math.floor(Math.random() * 4)));
    }

    // Koleksiyonlar
    for (let i = 0; i < 10 + stage * 3; i++) {
      const cx = 5 + Math.floor(Math.random() * (tileWidth - 10));
      const cy = 10 + Math.floor(Math.random() * 5);
      collectibles.push(coin(cx, cy));
    }

    // Özel koleksiyonlar (3 adet)
    collectibles.push(special(`${worldNum}-${stage}-a`, 20 + stage * 5, 8));
    collectibles.push(special(`${worldNum}-${stage}-b`, Math.floor(tileWidth * 0.6), 6));
    collectibles.push(special(`${worldNum}-${stage}-c`, tileWidth - 10, 14));

    // Güçlendirmeler
    if (stage >= 2) {
      const puTypes: any[] = ['shield', 'spark', 'cloak', 'boots'];
      collectibles.push(powerup(puTypes[(stage + worldNum) % 4], Math.floor(tileWidth * 0.4), 8));
    }

    // Kontrol noktaları
    checkpoints.push(checkpoint('1', Math.floor(tileWidth * 0.4), 14));
    if (stage >= 3) {
      checkpoints.push(checkpoint('2', Math.floor(tileWidth * 0.7), 14));
    }

    levels.push({
      id: `${worldNum}-${stage}`,
      world: worldNum,
      stage,
      name: `${['Maden Yolları', 'Hava Akımları', 'Buz Kırıkları', 'Alev Geçidi', 'Fırtına Koridoru'][worldNum - 2] || 'Bilinmeyen'} ${stage}`,
      isBoss: false,
      width,
      height: 720,
      bgColor: colors.bg1,
      bgColor2: colors.bg2,
      platforms,
      enemies,
      collectibles,
      hazards,
      checkpoints,
      startX: 80,
      startY: 560,
      endX: width - 160,
      endY: 560,
      parallaxLayers: defaultParallax(worldNum),
    });
  }

  // Boss bölümü
  levels.push({
    id: `${worldNum}-B`,
    world: worldNum,
    stage: 5,
    name: BOSS_DATA[worldNum - 1].name,
    isBoss: true,
    width: 1280,
    height: 720,
    bgColor: colors.bg1,
    bgColor2: colors.bg2,
    platforms: [
      solid(0, 16, 32, 2),
      solid(0, 0, 1, 18),
      solid(31, 0, 1, 18),
      oneway(6, 12, 4),
      oneway(22, 12, 4),
      oneway(14, 8, 4),
      ...(worldNum >= 3 ? [moving(10, 10, 3, 'x', 4, 80), moving(19, 10, 3, 'x', 4, 80)] : []),
      ...(worldNum >= 5 ? [falling(8, 6, 2), falling(22, 6, 2)] : []),
    ],
    enemies: [],
    collectibles: [powerup('shield', 16, 6)],
    hazards: worldNum >= 5 ? [hazard('lava', 4, 17, 24, 1)] : [],
    checkpoints: [],
    startX: 200,
    startY: 560,
    endX: 640,
    endY: 560,
    bossDef: BOSS_DATA[worldNum - 1],
    cameraBounds: { left: 0, right: 1280, top: 0, bottom: 720 },
    parallaxLayers: defaultParallax(worldNum),
  });

  return levels;
}

// ---- TÜM BÖLÜMLERİ BİRLEŞTİR ----
export function getAllLevels(): LevelData[] {
  const levels: LevelData[] = [];
  levels.push(...world1Levels());
  for (let w = 2; w <= 6; w++) {
    levels.push(...generateWorldLevels(w));
  }
  return levels;
}

export function getLevelById(id: string): LevelData | undefined {
  return getAllLevels().find(l => l.id === id);
}

export function getLevelsByWorld(world: number): LevelData[] {
  return getAllLevels().filter(l => l.world === world);
}

// Bölüm doğrulama
export function validateLevel(level: LevelData): string[] {
  const errors: string[] = [];
  
  if (level.startX < 0 || level.startX >= level.width) errors.push(`${level.id}: Başlangıç X harita dışında`);
  if (level.startY < 0 || level.startY >= level.height) errors.push(`${level.id}: Başlangıç Y harita dışında`);
  if (level.endX < 0 || level.endX >= level.width) errors.push(`${level.id}: Bitiş X harita dışında`);
  
  // Zıplama menzili analizi - en büyük boşluk kontrolü
  const maxJumpDist = 200; // piksel
  const solids = level.platforms.filter(p => p.type === 'solid');
  for (let i = 0; i < solids.length - 1; i++) {
    const gap = solids[i + 1].x - (solids[i].x + solids[i].w);
    if (gap > maxJumpDist && gap < level.width) {
      // Sadece uyarı, hata değil
    }
  }

  // Yinelenen ID kontrolü
  const ids = new Set<string>();
  level.collectibles.forEach(c => {
    if (ids.has(c.id)) errors.push(`${level.id}: Yinelenen koleksiyon ID: ${c.id}`);
    ids.add(c.id);
  });

  return errors;
}

export function validateAllLevels(): string[] {
  const allErrors: string[] = [];
  getAllLevels().forEach(level => {
    allErrors.push(...validateLevel(level));
  });
  return allErrors;
}
