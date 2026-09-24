import { Scene } from 'phaser';

const FUENTE = 'Arial Black, Arial, sans-serif';
const azar = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

//  Escena principal del demo: "Atrapa las estrellas".
//  Muestra: sprites, Arcade Physics, overlap (colisiones), grupos, teclado,
//  temporizadores, tweens y un HUD de texto.
//  El juego se maneja SOLO con el teclado (← → o A / D), no usa el mouse.
export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        const { width, height } = this.scale;

        //  Estado de la partida
        this.puntaje = 0;
        this.vidas = 3;
        this.restante = 45;
        this.terminado = false;

        this.add.image(width / 2, height / 2, 'fondo');

        //  Jugador: sprite con cuerpo físico
        this.jugador = this.physics.add.sprite(width / 2, height - 70, 'nave');
        this.jugador.setCollideWorldBounds(true);
        this.jugador.setSize(52, 30).setOffset(10, 18);   //  hitbox más chica = más justo

        //  Grupo con todos los objetos que caen (estrellas, bombas, corazones)
        this.objetos = this.physics.add.group();

        //  Cuando el jugador se superpone con un objeto, se llama a alRecoger()
        this.physics.add.overlap(this.jugador, this.objetos, this.alRecoger, null, this);

        //  Controles: SOLO teclado (flechas ← → y A / D).
        this.cursor = this.input.keyboard.createCursorKeys();
        this.teclas = this.input.keyboard.addKeys({ a: 'A', d: 'D' });

        //  Estas teclas no deben scrollear la página (por si el navegador lo
        //  intenta): no son necesarias para jugar, pero evitan movimientos raros.
        this.input.keyboard.addCapture('LEFT,RIGHT,A,D,SPACE');

        //  HUD
        const estilo = { fontFamily: FUENTE, fontSize: 26, color: '#ffffff' };

        this.textoPuntaje = this.add.text(24, 20, 'Puntaje: 0', estilo);
        this.textoTiempo = this.add.text(width - 24, 20, 'Tiempo: 45', estilo).setOrigin(1, 0);
        this.textoVidas = this.add.text(24, 56, 'Vidas: ♥♥♥', { ...estilo, color: '#ff6b9d' });

        //  Un objeto nuevo cada 800 ms (se acelera con el puntaje)
        //  OJO: en Phaser 4 la clave del contexto es callbackScope (con
        //  callbackContext el callback se ejecuta con this = TimerEvent).
        this.spawner = this.time.addEvent({
            delay: 800, loop: true, callback: this.soltarObjeto, callbackScope: this
        });

        //  Cuenta regresiva de 1 segundo
        this.reloj = this.time.addEvent({
            delay: 1000, loop: true, callback: this.tic, callbackScope: this
        });

        //  Pausa: P o ESC. Congela tiempo, física y animaciones, y muestra una
        //  capa con las opciones: seguir (P/ESC), reiniciar (R), terminar la
        //  partida (T) o volver al menú (M).
        this.pausado = false;

        this.crearCapaPausa();

        this.input.keyboard.on('keydown-P', () => this.alternarPausa());
        this.input.keyboard.on('keydown-ESC', () => this.alternarPausa());
        this.input.keyboard.on('keydown-R', () => { if (this.pausado) this.reiniciar(); });
        this.input.keyboard.on('keydown-T', () => { if (this.pausado) this.terminar(); });
        this.input.keyboard.on('keydown-M', () => { if (this.pausado) this.salirAlMenu(); });
    }

    //  Capa semitransparente con las opciones; arranca oculta
    crearCapaPausa ()
    {
        const { width, height } = this.scale;

        this.capaPausa = this.add.container(0, 0).setDepth(100).setVisible(false);

        this.capaPausa.add(this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.65));

        this.capaPausa.add(this.add.text(width / 2, height / 2 - 150, 'PAUSA', {
            fontFamily: FUENTE, fontSize: 60, color: '#7ef9ff',
            stroke: '#000000', strokeThickness: 8
        }).setOrigin(0.5));

        this.capaPausa.add(this.add.text(width / 2, height / 2 + 30,
            'P o ESC: seguir jugando\n' +
            'R: reiniciar la partida\n' +
            'T: terminar (y ver el puntaje)\n' +
            'M: volver al menú', {
                fontFamily: FUENTE, fontSize: 28, color: '#ffffff',
                align: 'center', lineSpacing: 14
            }).setOrigin(0.5));
    }

    alternarPausa ()
    {
        if (this.terminado) return;

        if (this.pausado)
        {
            this.despausar();
        }
        else
        {
            this.pausar();
        }
    }

    pausar ()
    {
        this.pausado = true;

        this.time.paused = true;        //  congela los timers (spawner y reloj)
        this.physics.pause();           //  congela los objetos que caen
        this.tweens.pauseAll();         //  congela las animaciones
        this.jugador.setVelocity(0, 0); //  y la nave se queda quieta

        this.capaPausa.setVisible(true);
    }

    //  Descongela todo. SIEMPRE se llama antes de cambiar de escena, así la
    //  partida siguiente arranca con el mundo andando (no hereda la pausa).
    despausar ()
    {
        this.pausado = false;

        this.time.paused = false;
        this.physics.resume();
        this.tweens.resumeAll();

        this.capaPausa.setVisible(false);
    }

    //  Desde la pausa: partida nueva de cero
    reiniciar ()
    {
        this.despausar();
        this.scene.start('Game');
    }

    salirAlMenu ()
    {
        this.despausar();
        this.scene.start('MainMenu');
    }

    //  Aparece un objeto arriba, en una x al azar, y cae
    soltarObjeto ()
    {
        const { width } = this.scale;

        const suerte = Math.random();

        let clave = 'estrella';
        let tipo = 'estrella';

        if (suerte < 0.22)
        {
            clave = 'bomba';
            tipo = 'bomba';
        }
        else if (suerte > 0.94 && this.vidas < 3)
        {
            clave = 'corazon';
            tipo = 'corazon';
        }

        //  Cuanto más puntaje, más rápido caen
        const velocidad = 180 + Math.min(240, this.puntaje * 0.7);

        const objeto = this.physics.add.sprite(azar(40, width - 40), -40, clave);

        //  OJO con el orden: physics.add.group().add() reinicia el cuerpo del
        //  sprite (deja velocity en 0). Primero se agrega al grupo y recién
        //  después se le asigna la velocidad.
        this.objetos.add(objeto);

        objeto.setData('tipo', tipo);
        objeto.setVelocity(azar(-40, 40), velocidad);

        if (tipo === 'estrella')
        {
            objeto.setAngularVelocity(azar(-120, 120));
        }
    }

    //  Callback del overlap: jugador <-> objeto
    alRecoger (jugador, objeto)
    {
        if (!objeto.active || this.terminado) return;

        const tipo = objeto.getData('tipo');
        const x = objeto.x;
        const y = objeto.y;

        if (tipo === 'bomba')
        {
            this.vidas--;
            this.cameras.main.shake(180, 0.012);
            this.avisar('¡Bomba!  −1 vida', '#ff6b6b', x, y);
        }
        else if (tipo === 'corazon')
        {
            this.vidas = Math.min(3, this.vidas + 1);
            this.avisar('+1 vida', '#ff9ecd', x, y);
        }
        else
        {
            this.puntaje += 10;
            this.avisar('+10', '#ffe066', x, y);
        }

        objeto.destroy();
        this.actualizarHud();

        if (this.vidas <= 0)
        {
            this.terminar();
        }
    }

    //  Textito flotante que sube y se desvanece
    avisar (texto, color, x, y)
    {
        const etiqueta = this.add.text(x, y, texto, {
            fontFamily: FUENTE, fontSize: 24, color, stroke: '#000000', strokeThickness: 5
        }).setOrigin(0.5);

        this.tweens.add({
            targets: etiqueta,
            y: y - 60,
            alpha: 0,
            duration: 700,
            onComplete: () => etiqueta.destroy()
        });
    }

    tic ()
    {
        if (this.terminado) return;

        this.restante--;
        this.actualizarHud();

        //  Dificultad progresiva: aparecen más seguido
        this.spawner.delay = Math.max(340, 800 - this.puntaje * 2);

        if (this.restante <= 0)
        {
            this.terminar();
        }
    }

    actualizarHud ()
    {
        this.textoPuntaje.setText('Puntaje: ' + this.puntaje);
        this.textoTiempo.setText('Tiempo: ' + Math.max(0, this.restante));
        this.textoVidas.setText('Vidas: ' + '♥'.repeat(Math.max(0, this.vidas)));
    }

    update ()
    {
        //  En pausa (o terminada) la escena no procesa nada: los timers, la
        //  física y las animaciones ya están congelados.
        if (this.pausado || this.terminado) return;

        const { height } = this.scale;
        const VELOCIDAD = 620;

        let vx = 0;

        if (this.cursor.left.isDown || this.teclas.a.isDown)
        {
            vx = -VELOCIDAD;
        }
        else if (this.cursor.right.isDown || this.teclas.d.isDown)
        {
            vx = VELOCIDAD;
        }

        //  El movimiento es binario: apretado o no, sin inercia.
        this.jugador.setVelocityX(vx);

        //  Limpieza: lo que se fue por abajo se destruye (si no, se acumula)
        for (const objeto of [...this.objetos.getChildren()])
        {
            if (objeto.y > height + 60)
            {
                objeto.destroy();
            }
        }
    }

    terminar ()
    {
        if (this.terminado) return;

        //  Puede venir del menú de pausa (tecla T): hay que descongelar antes
        //  de salir, si no el mundo queda pausado para la próxima partida.
        this.despausar();

        this.terminado = true;

        this.spawner.remove();
        this.reloj.remove();

        this.cameras.main.flash(250, 255, 255, 255);

        this.scene.start('GameOver', { puntaje: this.puntaje });
    }
}
