import { Scene } from 'phaser';

//  La escena Boot sirve para cargar lo mínimo indispensable (logo, barra de carga).
//  En este demo no hay archivos externos: los gráficos se generan por código en
//  Preloader, así que Boot sólo decide a dónde ir.
export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
