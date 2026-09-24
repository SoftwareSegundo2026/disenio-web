import { Scene } from 'phaser';

//  Preloader: acá se preparan los recursos del juego.
//  En vez de cargar imágenes desde /public las DIBUJAMOS con Graphics y las
//  convertimos en texturas con generateTexture(key, ancho, alto). Ventaja: el
//  proyecto queda autocontenido y se ve cómo se compone un sprite.
export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    create ()
    {
        this.crearTexturas();

        this.scene.start('MainMenu');
    }

    crearTexturas ()
    {
        //  Fondo 1024x768: degradado + puntitos (estrellas lejanas)
        let g = this.make.graphics({ x: 0, y: 0, add: false });

        g.fillGradientStyle(0x0b1b3a, 0x0b1b3a, 0x1d3f74, 0x1d3f74, 1);
        g.fillRect(0, 0, 1024, 768);

        for (let i = 0; i < 170; i++)
        {
            const radio = Math.random() < 0.15 ? 2 : 1;
            g.fillStyle(0xffffff, 0.25 + Math.random() * 0.6);
            g.fillCircle(Math.random() * 1024, Math.random() * 768, radio);
        }

        g.generateTexture('fondo', 1024, 768);
        g.destroy();

        //  Nave del jugador (72x54), apuntando hacia arriba
        g = this.make.graphics({ x: 0, y: 0, add: false });

        g.fillStyle(0x39d0ff, 1);
        g.fillTriangle(36, 2, 6, 48, 66, 48);          //  cuerpo
        g.fillStyle(0x0f6f96, 1);
        g.fillTriangle(36, 30, 18, 52, 54, 52);        //  cola
        g.fillStyle(0xffffff, 1);
        g.fillCircle(36, 26, 8);                       //  cabina

        g.generateTexture('nave', 72, 54);
        g.destroy();

        //  Estrella (44x44): polígono de 5 puntas
        g = this.make.graphics({ x: 0, y: 0, add: false });

        const puntos = [];
        const cx = 22, cy = 22, rExt = 20, rInt = 8;

        for (let i = 0; i < 10; i++)
        {
            const radio = (i % 2 === 0) ? rExt : rInt;
            const angulo = -Math.PI / 2 + (i * Math.PI) / 5;

            puntos.push({ x: cx + Math.cos(angulo) * radio, y: cy + Math.sin(angulo) * radio });
        }

        g.fillStyle(0xffe066, 1);
        g.fillPoints(puntos, true);
        g.lineStyle(2, 0xb98b00, 1);
        g.strokePoints(puntos, true);

        g.generateTexture('estrella', 44, 44);
        g.destroy();

        //  Bomba (40x40)
        g = this.make.graphics({ x: 0, y: 0, add: false });

        g.fillStyle(0x2b2f3a, 1);
        g.fillCircle(20, 22, 15);
        g.fillStyle(0x8a5a2b, 1);
        g.fillRect(17, 2, 6, 8);                       //  mecha
        g.fillStyle(0xff5c5c, 1);
        g.fillCircle(20, 2, 3);                        //  chispa
        g.fillStyle(0xffffff, 0.45);
        g.fillCircle(14, 16, 4);                       //  brillo

        g.generateTexture('bomba', 40, 40);
        g.destroy();

        //  Corazón (36x36) = vida extra
        g = this.make.graphics({ x: 0, y: 0, add: false });

        g.fillStyle(0xff6b9d, 1);
        g.fillCircle(12, 12, 10);
        g.fillCircle(24, 12, 10);
        g.fillTriangle(2, 15, 34, 15, 18, 33);

        g.generateTexture('corazon', 36, 36);
        g.destroy();
    }
}
