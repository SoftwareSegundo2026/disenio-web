/*
  Página "Acerca de".

  TODO TP: completá esta página con tus datos y tus explicaciones.

  Secciones que tiene que tener:

  1. Tus datos:
     - Apellido y nombre
     - Asignatura
     - Mail

  2. Qué es Zustand y para qué sirve el middleware persist:
     - Escribí con tus palabras qué es un store global con Zustand.
     - Explicá qué hace persist (guardar el estado en localStorage
       para que no se pierda al recargar la página).

  3. Qué es la Context API de React y cuándo conviene usarla:
     - Explicá para qué sirve (compartir estado sin pasar props).
     - Mencioná el ejemplo del tema claro/oscuro de este proyecto.

  4. Zustand vs Context: en qué casos usarías cada uno.

  Mantené el diseño limpio, con HTML semántico (section, h2, p).
*/

export default function AboutPage() {
  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold">Acerca de</h1>

      {/* TODO TP: tus datos */}
      <section className="mb-8 rounded-lg border border-border p-6 dark:border-gray-700">
        <h2 className="mb-2 text-lg font-semibold">Mis datos</h2>
        <ul className="space-y-1 text-muted">
          <li>Apellido y nombre: {/* TODO TP */}</li>
          <li>Asignatura: {/* TODO TP */}</li>
          <li>Mail: {/* TODO TP */}</li>
        </ul>
      </section>

      {/* TODO TP: Zustand */}
      <section className="mb-8 rounded-lg border border-border p-6 dark:border-gray-700">
        <h2 className="mb-2 text-lg font-semibold">Qué es Zustand</h2>
        <p className="text-muted">
          {/* TODO TP: explicá qué es un store global con Zustand y para qué
          sirve el middleware persist */}
        </p>
      </section>

      {/* TODO TP: Context API */}
      <section className="mb-8 rounded-lg border border-border p-6 dark:border-gray-700">
        <h2 className="mb-2 text-lg font-semibold">Qué es la Context API</h2>
        <p className="text-muted">
          {/* TODO TP: explicá para qué sirve y cuándo conviene usarla.
          Mencioná el ejemplo del tema claro/oscuro. */}
        </p>
      </section>

      {/* TODO TP: Zustand vs Context */}
      <section className="rounded-lg border border-border p-6 dark:border-gray-700">
        <h2 className="mb-2 text-lg font-semibold">Zustand vs Context</h2>
        <p className="text-muted">
          {/* TODO TP: en qué casos usarías cada uno */}
        </p>
      </section>
    </section>
  );
}
