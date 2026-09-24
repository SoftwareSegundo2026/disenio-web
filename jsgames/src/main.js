import StartGame from './game/main';

//  El juego se crea cuando el DOM está listo, dentro del contenedor #game-container.
document.addEventListener('DOMContentLoaded', () => {

    //  Guardamos la instancia en window para poder inspeccionarla desde la consola
    //  del navegador (útil en clase): window.game.scene.start('Game'), etc.
    window.game = StartGame('game-container');

});
