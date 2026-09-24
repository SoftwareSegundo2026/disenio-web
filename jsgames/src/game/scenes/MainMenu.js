import { Scene } from 'phaser';

const FUENTE = 'Arial Black, Arial, sans-serif';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        const { width, height } = this.scale;

        this.add.image(width / 2, height / 2, 'fondo');

        //  Estrella girando arriba del título
        const estrella = this.add.image(width / 2, 150, 'estrella').setScale(2.2);

        this.tweens.add({
            targets: estrella,
            angle: 360,
            duration: 4000,
            repeat: -1
        });

        this.add.text(width / 2, 265, 'Atrapa las estrellas', {
            fontFamily: FUENTE, fontSize: 58, color: '#ffe066',
            stroke: '#000000', strokeThickness: 8, align: 'center'
        }).setOrigin(0.5);

        this.add.text(width / 2, 340, 'Demo de Phaser 4 + Vite', {
            fontFamily: FUENTE, fontSize: 22, color: '#9fd8ff', align: 'center'
        }).setOrigin(0.5);

        //  Instrucciones (fuente chica: el bloque no debe pisar el subtítulo
        //  de arriba ni la leyenda de abajo)
        this.textoInstrucciones = this.add.text(width / 2, 448,
            'Movete con ← → o A / D (solo teclado)\n' +
            'Atrapá las estrellas: +10 puntos\n' +
            'Esquivá las bombas: −1 vida\n' +
            'Tenés 45 segundos\n' +
            'P o ESC para pausar y terminar cuando quieras', {
                fontFamily: FUENTE, fontSize: 20, color: '#ffffff',
                align: 'center', lineSpacing: 6
            }).setOrigin(0.5);

        //  Leyenda con los sprites del juego
        const leyenda = [
            { clave: 'estrella', texto: '+10' },
            { clave: 'bomba', texto: '−1 vida' },
            { clave: 'corazon', texto: '+1 vida' }
        ];

        leyenda.forEach((item, i) => {

            const x = width / 2 - 260 + i * 260;

            this.add.image(x - 34, 570, item.clave);
            this.add.text(x - 6, 570, item.texto, {
                fontFamily: FUENTE, fontSize: 22, color: '#ffffff'
            }).setOrigin(0, 0.5);

        });

        const aviso = this.add.text(width / 2, 665, 'Hacé clic o tocá ESPACIO para empezar', {
            fontFamily: FUENTE, fontSize: 26, color: '#7ef9ff'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: aviso,
            alpha: 0.25,
            duration: 700,
            yoyo: true,
            repeat: -1
        });

        //  Una sola vez cada uno: si no, el clic y la tecla disparan dos veces
        this.input.keyboard.once('keydown-SPACE', () => this.empezar());
        this.input.once('pointerdown', () => this.empezar());
    }

    empezar ()
    {
        this.scene.start('Game');
    }
}
