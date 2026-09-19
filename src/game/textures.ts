// ============================================
// Prosedürel Doku ve Animasyon Oluşturma
// ============================================

import Phaser from 'phaser';
import { TILE, WORLDS } from './core';

export function generateTextures(scene: Phaser.Scene): void {

  // ---- OYUNCU (Turkuaz atkılı, kehribar gökyüzü tamircisi) ----
  createPlayerTexture(scene, 'player_idle', 0);
  createPlayerTexture(scene, 'player_walk1', 1);
  createPlayerTexture(scene, 'player_walk2', 2);
  createPlayerTexture(scene, 'player_run1', 3);
  createPlayerTexture(scene, 'player_run2', 4);
  createPlayerTexture(scene, 'player_jump', 5);
  createPlayerTexture(scene, 'player_fall', 6);
  createPlayerTexture(scene, 'player_hurt', 7);
  createPlayerTexture(scene, 'player_brake', 8);

  // ---- DÜŞMANLAR ----
  createEnemyTexture(scene, 'enemy_patrol', '#e74c3c', 'walker');
  createEnemyTexture(scene, 'enemy_edge', '#e67e22', 'edge');
  createEnemyTexture(scene, 'enemy_jumper', '#9b59b6', 'jumper');
  createEnemyTexture(scene, 'enemy_flyer', '#3498db', 'flyer');
  createEnemyTexture(scene, 'enemy_shooter', '#e74c3c', 'shooter');
  createEnemyTexture(scene, 'enemy_shielded', '#7f8c8d', 'shield');
  createEnemyTexture(scene, 'enemy_charger', '#c0392b', 'charger');
  createEnemyTexture(scene, 'enemy_burrower', '#8e44ad', 'burrow');

  // ---- BLOKLAR VE PLATFORMLAR ----
  createTileTexture(scene, 'tile_solid', '#5d4e37', '#3d3225');
  createTileTexture(scene, 'tile_grass', '#4ade80', '#22c55e');
  createTileTexture(scene, 'tile_stone', '#6b7280', '#4b5563');
  createTileTexture(scene, 'tile_ice', '#a5f3fc', '#67e8f9');
  createTileTexture(scene, 'tile_lava_rock', '#7f1d1d', '#450a0a');
  createTileTexture(scene, 'tile_storm', '#6b21a8', '#4c1d95');
  createTileTexture(scene, 'tile_oneway', '#a3a3a3', '#737373', true);
  createTileTexture(scene, 'tile_breakable', '#92400e', '#78350f');
  createTileTexture(scene, 'tile_reward', '#fbbf24', '#f59e0b');
  createTileTexture(scene, 'tile_bounce', '#34d399', '#10b981');
  createTileTexture(scene, 'tile_moving', '#818cf8', '#6366f1');

  // ---- TEHLİKELER ----
  createSpikeTexture(scene, 'hazard_spikes');
  createLavaTexture(scene, 'hazard_lava');

  // ---- KOLEKSİYONLAR ----
  createCoinTexture(scene, 'coin');
  createSpecialTexture(scene, 'special_collect', '#f472b6');
  createPowerUpTexture(scene, 'powerup_shield', '#60a5fa', 'S');
  createPowerUpTexture(scene, 'powerup_spark', '#fbbf24', '✦');
  createPowerUpTexture(scene, 'powerup_cloak', '#a78bfa', 'C');
  createPowerUpTexture(scene, 'powerup_boots', '#34d399', 'B');

  // ---- PROJECTILES ----
  createProjectileTexture(scene, 'spark_projectile', '#fbbf24');
  createProjectileTexture(scene, 'enemy_projectile', '#ef4444');

  // ---- CHECKPOINT ----
  createCheckpointTexture(scene, 'checkpoint');
  createCheckpointTexture(scene, 'checkpoint_active');

  // ---- PARÇACIKLAR ----
  createParticleTexture(scene, 'particle_dust', '#d4d4d4');
  createParticleTexture(scene, 'particle_spark', '#fbbf24');
  createParticleTexture(scene, 'particle_star', '#f472b6');
  createParticleTexture(scene, 'particle_smoke', '#6b7280');

  // ---- BOSS ----
  createBossTextures(scene);

  // ---- ARKA PLAN ----
  createBackgroundElements(scene);
}

function createPlayerTexture(scene: Phaser.Scene, key: string, frame: number): void {
  const w = 32, h = 48;
  const canvas = scene.textures.createCanvas(key, w, h);
  if (!canvas) return;
  const ctx = canvas.getContext();

  // Gövde (kehribar)
  ctx.fillStyle = '#d97706';
  ctx.fillRect(8, 16, 16, 20);
  
  // Kafa
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(16, 12, 10, 0, Math.PI * 2);
  ctx.fill();

  // Gözler
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(12, 10, 3, 3);
  ctx.fillRect(18, 10, 3, 3);

  // Turkuaz atkı
  ctx.fillStyle = '#2dd4bf';
  ctx.fillRect(6, 18, 20, 5);
  if (frame === 5 || frame === 6) {
    // Zıplamada atkı uçuşur
    ctx.fillRect(4, 20, 6, 8);
  } else {
    ctx.fillRect(22, 20, 6, 4);
  }

  // Bacaklar
  ctx.fillStyle = '#92400e';
  const legOffset = frame % 2 === 1 ? 2 : frame % 2 === 2 ? -2 : 0;
  ctx.fillRect(10, 36, 5, 12);
  ctx.fillRect(17, 36 + legOffset, 5, 12);

  // Kollar
  ctx.fillStyle = '#d97706';
  if (frame === 3 || frame === 4) {
    // Koşmada kollar hareketli
    ctx.fillRect(4, 20 + legOffset, 5, 10);
    ctx.fillRect(23, 20 - legOffset, 5, 10);
  } else {
    ctx.fillRect(5, 22, 4, 10);
    ctx.fillRect(23, 22, 4, 10);
  }

  // Hasar efekti
  if (frame === 7) {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
    ctx.fillRect(0, 0, w, h);
  }

  canvas.refresh();
}

function createEnemyTexture(scene: Phaser.Scene, key: string, color: string, type: string): void {
  const w = 36, h = 36;
  const canvas = scene.textures.createCanvas(key, w, h);
  if (!canvas) return;
  const ctx = canvas.getContext();

  ctx.fillStyle = color;
  
  switch (type) {
    case 'walker':
      // Yuvarlak gövde, küçük ayaklar
      ctx.beginPath();
      ctx.arc(18, 16, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(12, 12, 4, 5);
      ctx.fillRect(20, 12, 4, 5);
      ctx.fillStyle = color;
      ctx.fillRect(10, 30, 6, 6);
      ctx.fillRect(20, 30, 6, 6);
      break;
    case 'edge':
      // Kare gövde, dikenler
      ctx.fillRect(4, 4, 28, 28);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(10, 10, 5, 5);
      ctx.fillRect(21, 10, 5, 5);
      // Dikenler
      ctx.fillStyle = color;
      ctx.fillRect(2, 0, 4, 6);
      ctx.fillRect(14, 0, 4, 6);
      ctx.fillRect(26, 0, 4, 6);
      break;
    case 'jumper':
      // Yaylı gövde
      ctx.beginPath();
      ctx.arc(18, 14, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(12, 10, 4, 4);
      ctx.fillRect(20, 10, 4, 4);
      // Yay
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(10, 28);
      ctx.quadraticCurveTo(18, 34, 26, 28);
      ctx.stroke();
      break;
    case 'flyer':
      // Kanatlı
      ctx.beginPath();
      ctx.arc(18, 18, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(14, 14, 3, 3);
      ctx.fillRect(20, 14, 3, 3);
      // Kanatlar
      ctx.fillStyle = '#93c5fd';
      ctx.beginPath();
      ctx.ellipse(6, 14, 8, 5, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(30, 14, 8, 5, 0.3, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'shooter':
      // Top gövde, namlu
      ctx.beginPath();
      ctx.arc(18, 18, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(12, 14, 4, 4);
      ctx.fillRect(20, 14, 4, 4);
      ctx.fillStyle = '#450a0a';
      ctx.fillRect(28, 16, 8, 4);
      break;
    case 'shield':
      // Kalkanlı
      ctx.beginPath();
      ctx.arc(18, 18, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(14, 14, 3, 3);
      ctx.fillRect(20, 14, 3, 3);
      // Kalkan
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(0, 8, 6, 20);
      break;
    case 'charger':
      // Koçboynuzlu
      ctx.fillRect(6, 10, 24, 20);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(22, 16, 4, 4);
      // Boynuz
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(6, 10);
      ctx.lineTo(0, 4);
      ctx.lineTo(8, 10);
      ctx.fill();
      break;
    case 'burrow':
      // Yeraltı solucanı
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(18, 24, 12, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(14, 18, 3, 3);
      ctx.fillRect(20, 18, 3, 3);
      break;
  }

  canvas.refresh();
}

function createTileTexture(scene: Phaser.Scene, key: string, color1: string, color2: string, isOneWay = false): void {
  const canvas = scene.textures.createCanvas(key, TILE, TILE);
  if (!canvas) return;
  const ctx = canvas.getContext();

  if (isOneWay) {
    ctx.fillStyle = color1;
    ctx.fillRect(0, 0, TILE, 8);
    ctx.fillStyle = color2;
    ctx.fillRect(0, 8, TILE, TILE - 8);
    // Çizgi deseni
    ctx.strokeStyle = color1;
    ctx.lineWidth = 1;
    for (let i = 0; i < TILE; i += 10) {
      ctx.beginPath();
      ctx.moveTo(i, 10);
      ctx.lineTo(i + 5, TILE);
      ctx.stroke();
    }
  } else {
    ctx.fillStyle = color1;
    ctx.fillRect(0, 0, TILE, TILE);
    // Kenar efekti
    ctx.fillStyle = color2;
    ctx.fillRect(0, TILE - 4, TILE, 4);
    ctx.fillRect(TILE - 2, 0, 2, TILE);
    // Üst parlaklık
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(0, 0, TILE, 3);
    // Doku deseni
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(4, 8, 8, 8);
    ctx.fillRect(20, 20, 10, 6);
    ctx.fillRect(28, 6, 6, 10);
  }

  canvas.refresh();
}

function createSpikeTexture(scene: Phaser.Scene, key: string): void {
  const canvas = scene.textures.createCanvas(key, TILE, TILE);
  if (!canvas) return;
  const ctx = canvas.getContext();

  ctx.fillStyle = '#6b7280';
  const spikes = 4;
  const spikeW = TILE / spikes;
  for (let i = 0; i < spikes; i++) {
    ctx.beginPath();
    ctx.moveTo(i * spikeW, TILE);
    ctx.lineTo(i * spikeW + spikeW / 2, TILE / 3);
    ctx.lineTo((i + 1) * spikeW, TILE);
    ctx.fill();
  }
  // Parlak uçlar
  ctx.fillStyle = '#d1d5db';
  for (let i = 0; i < spikes; i++) {
    ctx.beginPath();
    ctx.arc(i * spikeW + spikeW / 2, TILE / 3 + 2, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  canvas.refresh();
}

function createLavaTexture(scene: Phaser.Scene, key: string): void {
  const canvas = scene.textures.createCanvas(key, TILE, TILE);
  if (!canvas) return;
  const ctx = canvas.getContext();

  const gradient = ctx.createLinearGradient(0, 0, 0, TILE);
  gradient.addColorStop(0, '#fbbf24');
  gradient.addColorStop(0.3, '#f97316');
  gradient.addColorStop(1, '#dc2626');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, TILE, TILE);

  // Kabarcıklar
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(10, 12, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(28, 20, 3, 0, Math.PI * 2);
  ctx.fill();

  canvas.refresh();
}

function createCoinTexture(scene: Phaser.Scene, key: string): void {
  const canvas = scene.textures.createCanvas(key, 20, 20);
  if (!canvas) return;
  const ctx = canvas.getContext();

  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(10, 10, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(10, 10, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('★', 10, 10);

  canvas.refresh();
}

function createSpecialTexture(scene: Phaser.Scene, key: string, color: string): void {
  const canvas = scene.textures.createCanvas(key, 24, 24);
  if (!canvas) return;
  const ctx = canvas.getContext();

  // Parlayan yıldız
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 72 - 90) * Math.PI / 180;
    const innerAngle = ((i * 72) + 36 - 90) * Math.PI / 180;
    const outerR = 11, innerR = 5;
    ctx.lineTo(12 + Math.cos(angle) * outerR, 12 + Math.sin(angle) * outerR);
    ctx.lineTo(12 + Math.cos(innerAngle) * innerR, 12 + Math.sin(innerAngle) * innerR);
  }
  ctx.closePath();
  ctx.fill();

  // Parıltı
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.beginPath();
  ctx.arc(10, 8, 3, 0, Math.PI * 2);
  ctx.fill();

  canvas.refresh();
}

function createPowerUpTexture(scene: Phaser.Scene, key: string, color: string, symbol: string): void {
  const canvas = scene.textures.createCanvas(key, 28, 28);
  if (!canvas) return;
  const ctx = canvas.getContext();

  // Kutu
  ctx.fillStyle = color;
  ctx.beginPath();
  if (ctx.roundRect) { ctx.roundRect(2, 2, 24, 24, 6); } else { ctx.rect(2, 2, 24, 24); }
  ctx.fill();

  // Kenar
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  if (ctx.roundRect) { ctx.roundRect(2, 2, 24, 24, 6); } else { ctx.rect(2, 2, 24, 24); }
  ctx.stroke();

  // Sembol
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(symbol, 14, 14);

  canvas.refresh();
}

function createProjectileTexture(scene: Phaser.Scene, key: string, color: string): void {
  const canvas = scene.textures.createCanvas(key, 12, 12);
  if (!canvas) return;
  const ctx = canvas.getContext();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(6, 6, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.beginPath();
  ctx.arc(5, 5, 2, 0, Math.PI * 2);
  ctx.fill();

  canvas.refresh();
}

function createCheckpointTexture(scene: Phaser.Scene, key: string): void {
  const canvas = scene.textures.createCanvas(key, 32, 48);
  if (!canvas) return;
  const ctx = canvas.getContext();

  const active = key === 'checkpoint_active';

  // Direk
  ctx.fillStyle = '#6b7280';
  ctx.fillRect(14, 8, 4, 40);

  // Bayrak
  ctx.fillStyle = active ? '#4ade80' : '#94a3b8';
  ctx.beginPath();
  ctx.moveTo(18, 8);
  ctx.lineTo(30, 14);
  ctx.lineTo(18, 20);
  ctx.closePath();
  ctx.fill();

  if (active) {
    // Parıltı
    ctx.fillStyle = 'rgba(74, 222, 128, 0.3)';
    ctx.beginPath();
    ctx.arc(16, 14, 12, 0, Math.PI * 2);
    ctx.fill();
  }

  canvas.refresh();
}

function createParticleTexture(scene: Phaser.Scene, key: string, color: string): void {
  const canvas = scene.textures.createCanvas(key, 8, 8);
  if (!canvas) return;
  const ctx = canvas.getContext();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(4, 4, 3, 0, Math.PI * 2);
  ctx.fill();

  canvas.refresh();
}

function createBossTextures(scene: Phaser.Scene): void {
  const bossColors = ['#22c55e', '#f59e0b', '#60a5fa', '#a5f3fc', '#ef4444', '#a855f7'];
  const bossNames = ['root', 'press', 'compass', 'prism', 'hearth', 'storm'];

  bossColors.forEach((color, i) => {
    const key = `boss_${bossNames[i]}`;
    const canvas = scene.textures.createCanvas(key, 80, 80);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Boss gövdesi
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(40, 40, 35, 0, Math.PI * 2);
    ctx.fill();

    // Gözler
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(28, 32, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(52, 32, 8, 0, Math.PI * 2);
    ctx.fill();

    // Göz bebekleri
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(30, 34, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(54, 34, 4, 0, Math.PI * 2);
    ctx.fill();

    // Ağız
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(40, 52, 10, 0, Math.PI);
    ctx.fill();

    // Dünya temalı detaylar
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(40, 40, 30, 0, Math.PI * 2);
    ctx.stroke();

    canvas.refresh();
  });
}

function createBackgroundElements(scene: Phaser.Scene): void {
  // Bulut
  const cloud = scene.textures.createCanvas('bg_cloud', 120, 60);
  if (cloud) {
    const ctx = cloud.getContext();
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath();
    ctx.arc(30, 35, 20, 0, Math.PI * 2);
    ctx.arc(55, 25, 25, 0, Math.PI * 2);
    ctx.arc(80, 30, 22, 0, Math.PI * 2);
    ctx.arc(100, 38, 16, 0, Math.PI * 2);
    ctx.fill();
    cloud.refresh();
  }

  // Ağaç
  const tree = scene.textures.createCanvas('bg_tree', 60, 100);
  if (tree) {
    const ctx = tree.getContext();
    ctx.fillStyle = '#92400e';
    ctx.fillRect(25, 50, 10, 50);
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(30, 35, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.arc(25, 30, 18, 0, Math.PI * 2);
    ctx.fill();
    tree.refresh();
  }

  // Çalı
  const bush = scene.textures.createCanvas('bg_bush', 50, 30);
  if (bush) {
    const ctx = bush.getContext();
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.arc(15, 18, 12, 0, Math.PI * 2);
    ctx.arc(30, 14, 14, 0, Math.PI * 2);
    ctx.arc(42, 18, 10, 0, Math.PI * 2);
    ctx.fill();
    bush.refresh();
  }

  // Dağ
  const mountain = scene.textures.createCanvas('bg_mountain', 200, 150);
  if (mountain) {
    const ctx = mountain.getContext();
    ctx.fillStyle = 'rgba(100,116,139,0.4)';
    ctx.beginPath();
    ctx.moveTo(0, 150);
    ctx.lineTo(100, 20);
    ctx.lineTo(200, 150);
    ctx.closePath();
    ctx.fill();
    // Kar tepesi
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.moveTo(80, 50);
    ctx.lineTo(100, 20);
    ctx.lineTo(120, 50);
    ctx.closePath();
    ctx.fill();
    mountain.refresh();
  }
}

export function getWorldTileset(world: number): { solid: string; grass: string } {
  const themes = [
    { solid: 'tile_grass', grass: 'tile_grass' },
    { solid: 'tile_stone', grass: 'tile_stone' },
    { solid: 'tile_stone', grass: 'tile_stone' },
    { solid: 'tile_ice', grass: 'tile_ice' },
    { solid: 'tile_lava_rock', grass: 'tile_lava_rock' },
    { solid: 'tile_storm', grass: 'tile_storm' },
  ];
  return themes[(world - 1) % themes.length];
}
