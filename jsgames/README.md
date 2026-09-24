# jsgames — demo con Phaser 4

Mini juego de ejemplo ("Atrapa las estrellas") armado con **Phaser 4 + Vite**.
Todos los gráficos se generan por código en `Preloader.js`, así que no hay
archivos de imagen: es un proyecto autocontenido para clase.

## Requisitos

- Node.js 20 o superior
- pnpm (`npm i -g pnpm`)

## Puesta en marcha

```bash
pnpm install     # instala phaser, vite y terser
pnpm dev         # servidor de desarrollo en http://localhost:8080
pnpm build       # build de producción en ./dist
pnpm preview     # sirve el build de ./dist para probarlo
```

## Cómo se juega

- Moverse: **← →** o **A / D**. La partida se juega solo con el teclado (no usa
  el mouse ni el touch).
- Estrella: **+10** puntos.
- Bomba: **−1** vida.
- Corazón: **+1** vida (máximo 3).
- 45 segundos por partida. Al terminar se guarda el récord en `localStorage`.
- Los menús (inicio y fin de partida) también responden al clic, pero la partida
  en sí se maneja únicamente con el teclado.
- **Pausa**: en plena partida, `P` o `ESC` pausan (se congelan el tiempo, los
  objetos que caen y las animaciones). Dentro de la pausa:
  - `P` o `ESC`: seguir jugando.
  - `R`: reiniciar la partida.
  - `T`: terminar la partida y ver el puntaje (va a la pantalla final).
  - `M`: volver al menú sin terminar.
- `M` en la pantalla final vuelve al menú.

## Pantalla y escalado

El juego se dibuja siempre en un lienzo interno de **1024x768** y se adapta a
cualquier pantalla sin scroll:

- `src/game/main.js` usa `scale: { mode: Scale.FIT, autoCenter: Scale.CENTER_BOTH }`
  → Phaser calcula el canvas más grande que entre respetando la relación 4:3.
- `public/style.css` hace que `#app` y `#game-container` midan exactamente el
  viewport (`position: fixed; inset: 0; height: 100dvh`) y corta el scroll
  (`overflow: hidden` en `html, body`).
- Al cambiar el tamaño de la ventana, Phaser vuelve a ajustar solo (evento
  `resize`): no hace falta recargar.

Verificado sin scroll en 1280x800, 1366x768, 1920x1080, 1440x900, 2560x1080,
1024x600, 800x400, 768x1024, 414x896 y 896x414.

Si preferís otro comportamiento:
- ocupar toda la pantalla: `Scale.ENVELOP` (recorta los bordes) o
  `Scale.RESIZE` (cambia el tamaño del mundo en vez de escalarlo);
- pantalla completa real: `this.scale.startFullscreen()` desde una tecla.

## Estructura

```
jsgames/
├── index.html               # HTML mínimo: sólo el contenedor del juego
├── public/
│   └── style.css            # estilos de la página (no del juego)
├── src/
│   ├── main.js              # espera el DOM y arranca el juego (window.game)
│   └── game/
│       ├── main.js          # configuración de Phaser (tamaño, física, escala)
│       └── scenes/
│           ├── Boot.js      # arranque
│           ├── Preloader.js # genera las texturas por código
│           ├── MainMenu.js  # título, instrucciones y leyenda
│           ├── Game.js      # el juego: física, overlap, HUD y temporizadores
│           └── GameOver.js  # puntaje final + récord
└── vite/
    ├── config.dev.mjs       # config de desarrollo (puerto 8080)
    └── config.prod.mjs      # config de producción (terser + chunks)
```

## Conceptos que muestra

| Concepto | Dónde |
|---|---|
| Escenas y ciclo de vida (`init/create/update`) | `src/game/scenes/*` |
| Texturas generadas con `Graphics` + `generateTexture` | `Preloader.js` |
| Arcade Physics, `setVelocity`, `setCollideWorldBounds` | `Game.js` |
| Colisiones por superposición (`physics.add.overlap`) | `Game.js` |
| Grupos de sprites y limpieza de objetos | `Game.js` |
| Teclado (cursores y `addKeys`) | `Game.js` |
| Temporizadores (`this.time.addEvent`) | `Game.js` |
| Pausa (`time.paused`, `physics.pause()`, `tweens.pauseAll()`) | `Game.js` |
| Tweens y efectos de cámara | `Game.js`, `MainMenu.js` |
| Estado entre escenas (`scene.start('GameOver', { puntaje })`) | `Game.js`, `GameOver.js` |

## Para seguir

- Cambiar la dificultad: `delay` del `spawner` y la `velocidad` en `soltarObjeto()`.
- Poner tus imágenes: guardalas en `public/assets/`, cargalas con
  `this.load.image('clave', 'assets/archivo.png')` en `Preloader.preload()` y usá `'clave'`.
- Ver las hitboxes: `physics.arcade.debug: true` en `src/game/main.js`.
- Consola del navegador: `window.game` expone la instancia
  (`game.scene.start('Game')`, `game.scene.getScenes(true)`).

## Notas de Phaser 4

- Phaser 4 prioriza WebGL y usa `type: AUTO` para caer a Canvas si hace falta.
- Los assets se importan como módulos ES (`import { Scene } from 'phaser'`).
- Documentación: <https://docs.phaser.io/>
