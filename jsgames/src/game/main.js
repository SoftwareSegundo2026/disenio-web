import { AUTO, Game, Scale } from 'phaser';
import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { MainMenu } from './scenes/MainMenu';
import { Game as MainGame } from './scenes/Game';
import { GameOver } from './scenes/GameOver';

//  Configuración del juego (Phaser 4).
//  Referencia: https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: AUTO,                 //  usa WebGL y cae a Canvas si no está disponible
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#070d1c',
    physics: {
        default: 'arcade',      //  Arcade Physics: ideal para plataformas, colisiones simples
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false        //  poné true para ver las hitboxes
        }
    },
    scale: {
        mode: Scale.FIT,        //  escala el lienzo para que entre en la ventana
        autoCenter: Scale.CENTER_BOTH
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver
    ]
};

const StartGame = (parent) => {

    return new Game({ ...config, parent });

};

export default StartGame;
