// ============================================
// KIVILCIM — GÖK YÜZÜ ADALARI
// Ana Oyun Başlatma
// ============================================

import Phaser from 'phaser';
import { GAME_CONFIG } from './core';
import { AudioSystem } from './core';
import { BootScene, MenuScene, WorldMapScene, PlayScene, ResultsScene } from './scenes';

export function createGame(container: HTMLElement): Phaser.Game {
  const audioSys = new AudioSystem();

  // Çözünürlük hesaplama
  const parentWidth = container.clientWidth || window.innerWidth;
  const parentHeight = container.clientHeight || window.innerHeight;
  
  let scale = Math.min(parentWidth / GAME_CONFIG.logicalWidth, parentHeight / GAME_CONFIG.logicalHeight);
  
  // 4K desteği
  const dpr = Math.min(window.devicePixelRatio || 1, 2); // Max 2x for performance
  
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: container,
    width: GAME_CONFIG.logicalWidth,
    height: GAME_CONFIG.logicalHeight,
    pixelArt: false,
    roundPixels: true,
    antialias: true,
    fps: {
      target: GAME_CONFIG.maxFPS,
      forceSetTimeOut: false,
      min: 30,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: GAME_CONFIG.gravity },
        debug: false,
        fps: GAME_CONFIG.physicsFPS,
      },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: GAME_CONFIG.logicalWidth,
      height: GAME_CONFIG.logicalHeight,
    },
    scene: [BootScene, MenuScene, WorldMapScene, PlayScene, ResultsScene],
    backgroundColor: '#0a1628',
    input: {
      activePointers: 4, // Çoklu dokunma desteği
    },
    render: {
      antialias: true,
      pixelArt: false,
      roundPixels: true,
    },
  };

  const game = new Phaser.Game(config);
  
  // Ses sistemini oyuna ekle
  (game as any).audioSys = audioSys;
  
  // İlk kullanıcı etkileşiminde sesi aç
  const resumeAudio = () => {
    audioSys.init();
    audioSys.resume();
    window.removeEventListener('pointerdown', resumeAudio);
    window.removeEventListener('keydown', resumeAudio);
  };
  window.addEventListener('pointerdown', resumeAudio, { once: true });
  window.addEventListener('keydown', resumeAudio, { once: true });

  // Sekme değişimi
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      game.events.emit('pause');
    } else {
      game.events.emit('resume');
    }
  });

  // Orientation değişimi
  window.addEventListener('orientationchange', () => {
    setTimeout(() => game.scale.refresh(), 100);
  });

  return game;
}
