# Varlık Manifestosu

## Görsel Varlıklar

Tüm görsel varlıklar prosedürel olarak Phaser Canvas API kullanılarak oluşturulmuştur. Harici dosya kullanılmamıştır.

### Karakter
| Varlık | Kaynak | Lisans |
|--------|--------|--------|
| player_idle | Prosedürel canvas | Özgün |
| player_walk1/2 | Prosedürel canvas | Özgün |
| player_run1/2 | Prosedürel canvas | Özgün |
| player_jump | Prosedürel canvas | Özgün |
| player_fall | Prosedürel canvas | Özgün |
| player_hurt | Prosedürel canvas | Özgün |
| player_brake | Prosedürel canvas | Özgün |

### Düşmanlar
| Varlık | Kaynak | Lisans |
|--------|--------|--------|
| enemy_patrol | Prosedürel canvas | Özgün |
| enemy_edge | Prosedürel canvas | Özgün |
| enemy_jumper | Prosedürel canvas | Özgün |
| enemy_flyer | Prosedürel canvas | Özgün |
| enemy_shooter | Prosedürel canvas | Özgün |
| enemy_shielded | Prosedürel canvas | Özgün |
| enemy_charger | Prosedürel canvas | Özgün |
| enemy_burrower | Prosedürel canvas | Özgün |

### Bloklar ve Platformlar
| Varlık | Kaynak | Lisans |
|--------|--------|--------|
| tile_solid | Prosedürel canvas | Özgün |
| tile_grass | Prosedürel canvas | Özgün |
| tile_stone | Prosedürel canvas | Özgün |
| tile_ice | Prosedürel canvas | Özgün |
| tile_lava_rock | Prosedürel canvas | Özgün |
| tile_storm | Prosedürel canvas | Özgün |
| tile_oneway | Prosedürel canvas | Özgün |
| tile_breakable | Prosedürel canvas | Özgün |
| tile_reward | Prosedürel canvas | Özgün |
| tile_bounce | Prosedürel canvas | Özgün |
| tile_moving | Prosedürel canvas | Özgün |

### Tehlikeler
| Varlık | Kaynak | Lisans |
|--------|--------|--------|
| hazard_spikes | Prosedürel canvas | Özgün |
| hazard_lava | Prosedürel canvas | Özgün |

### Koleksiyonlar
| Varlık | Kaynak | Lisans |
|--------|--------|--------|
| coin | Prosedürel canvas | Özgün |
| special_collect | Prosedürel canvas | Özgün |
| powerup_shield | Prosedürel canvas | Özgün |
| powerup_spark | Prosedürel canvas | Özgün |
| powerup_cloak | Prosedürel canvas | Özgün |
| powerup_boots | Prosedürel canvas | Özgün |

### Boss'lar
| Varlık | Kaynak | Lisans |
|--------|--------|--------|
| boss_root | Prosedürel canvas | Özgün |
| boss_press | Prosedürel canvas | Özgün |
| boss_compass | Prosedürel canvas | Özgün |
| boss_prism | Prosedürel canvas | Özgün |
| boss_hearth | Prosedürel canvas | Özgün |
| boss_storm | Prosedürel canvas | Özgün |

### Arka Plan
| Varlık | Kaynak | Lisans |
|--------|--------|--------|
| bg_cloud | Prosedürel canvas | Özgün |
| bg_tree | Prosedürel canvas | Özgün |
| bg_bush | Prosedürel canvas | Özgün |
| bg_mountain | Prosedürel canvas | Özgün |

### Parçacıklar
| Varlık | Kaynak | Lisans |
|--------|--------|--------|
| particle_dust | Prosedürel canvas | Özgün |
| particle_spark | Prosedürel canvas | Özgün |
| particle_star | Prosedürel canvas | Özgün |
| particle_smoke | Prosedürel canvas | Özgün |

## Ses Varlıkları

Tüm sesler Web Audio API kullanılarak prosedürel üretilmiştir. Harici ses dosyası kullanılmamıştır.

| Ses | Yöntem |
|-----|--------|
| Zıplama | OscillatorNode (square, 400-600Hz) |
| İniş | OscillatorNode (triangle, 150Hz) |
| Toplama | OscillatorNode (square, 880-1100Hz) |
| Hasar | OscillatorNode (sawtooth, 200Hz) |
| Ölüm | OscillatorNode (square, 400-200Hz) |
| Güçlendirme | OscillatorNode (square, 500-900Hz) |
| Müzik | Prosedürel melodi (dünya bazlı skala) |

## Üçüncü Taraf Bağımlılıklar

| Paket | Sürüm | Lisans |
|-------|-------|--------|
| phaser | 3.80.1 | MIT |
| react | 18.2.0 | MIT |
| react-dom | 18.2.0 | MIT |
| vite | 6.3.5 | MIT |
| typescript | 5.7.0 | Apache-2.0 |
| tailwindcss | 4.1.7 | MIT |
