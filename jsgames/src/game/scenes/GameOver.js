import { Scene } from 'phaser';

const FUENTE = 'Arial Black, Arial, sans-serif';
const CLAVE_RECORD = 'jsgames-mejor-puntaje';

//  Pantalla final: muestra el puntaje, guarda el récord en localStorage
//  y permite volver a jugar o ir al menú.
export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    init (datos)
    {
        this.puntajeFinal = (datos && datos.puntaje) || 0;
    }

    create ()
    {
        const { width, height } = this.scale;

        this.add.image(width / 2, height / 2, 'fondo');

        //  Récord local (localStorage puede fallar en modo incógnito: lo protegemos)
        let mejor = 0;

        try
        {
            mejor = parseInt(window.localStorage.getItem(CLAVE_RECORD) || '0', 10) || 0;
        }
        catch (e)
        {
            mejor = 0;
        }

        const esRecord = this.puntajeFinal > mejor;

        if (esRecord)
        {
            try
            {
                window.localStorage.setItem(CLAVE_RECORD, String(this.puntajeFinal));
            }
            catch (e)
            {
                //  sin persistencia: sólo se muestra en pantalla
            }

            mejor = this.puntajeFinal;
        }

        this.add.text(width / 2, 210, 'Fin de la partida', {
            fontFamily: FUENTE, fontSize: 54, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8
        }).setOrigin(0.5);

        this.add.text(width / 2, 320, 'Puntaje: ' + this.puntajeFinal, {
            fontFamily: FUENTE, fontSize: 44, color: '#ffe066',
            stroke: '#000000', strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(width / 2, 390, 'Mejor puntaje: ' + mejor, {
            fontFamily: FUENTE, fontSize: 28, color: '#9fd8ff'
        }).setOrigin(0.5);

        if (esRecord)
        {
            const record = this.add.text(width / 2, 450, '¡Nuevo récord!', {
                fontFamily: FUENTE, fontSize: 30, color: '#7dffa8'
            }).setOrigin(0.5);

            this.tweens.add({
                targets: record,
                scale: 1.15,
                duration: 500,
                yoyo: true,
                repeat: -1
            });
        }

        this.add.text(width / 2, 570, 'Clic o ESPACIO para volver a jugar\nM para ir al menú', {
            fontFamily: FUENTE, fontSize: 26, color: '#ffffff',
            align: 'center', lineSpacing: 10
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown-SPACE', () => this.scene.start('Game'));
        this.input.keyboard.once('keydown-M', () => this.scene.start('MainMenu'));
        this.input.once('pointerdown', () => this.scene.start('Game'));
    }
}
