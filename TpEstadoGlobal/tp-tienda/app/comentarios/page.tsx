"use client";

import { useEffect, useState } from "react";
import type { Comment } from "@/lib/types";

/*
  Página de comentarios (componente de CLIENTE).
  Usa la API /api/comentarios (route handler que lee/escribe JSON).

  Este archivo es el EJEMPLO COMPLETO del patrón:
  página + API para leer y guardar datos en un archivo JSON.
  Usalo de referencia para completar la página de pedidos.
*/

export default function ComentariosPage() {
  const [comentarios, setComentarios] = useState<Comment[]>([]);
  const [cargando, setCargando] = useState(true);
  const [titulo, setTitulo] = useState("");
  const [detalle, setDetalle] = useState("");

  useEffect(() => {
    fetch("/api/comentarios")
      .then((res) => res.json())
      .then(setComentarios)
      .finally(() => setCargando(false));
  }, []);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/comentarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: titulo, detail: detalle }),
    });
    const nuevo = await res.json();
    setComentarios((prev) => [...prev, nuevo]);
    setTitulo("");
    setDetalle("");
  }

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold">Comentarios</h1>

      <form
        onSubmit={enviar}
        className="mb-8 flex flex-col gap-3 rounded-lg border border-border p-6 dark:border-gray-700"
      >
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título"
          required
          className="rounded-lg border border-border bg-background px-4 py-2 outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800"
        />
        <textarea
          value={detalle}
          onChange={(e) => setDetalle(e.target.value)}
          placeholder="Escribí tu comentario..."
          required
          rows={3}
          className="rounded-lg border border-border bg-background px-4 py-2 outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800"
        />
        <button
          type="submit"
          className="self-start rounded-full bg-primary px-6 py-2 font-semibold text-white hover:bg-primary-hover"
        >
          Publicar
        </button>
      </form>

      {cargando ? (
        <p className="py-8 text-center text-muted">Cargando...</p>
      ) : (
        <ul className="space-y-4">
          {comentarios.map((c) => (
            <li
              key={c.id}
              className="rounded-lg border border-border p-4 dark:border-gray-700"
            >
              <div className="mb-1 flex items-center justify-between">
                <h2 className="font-semibold">{c.title}</h2>
                <time className="text-xs text-muted">
                  {new Date(c.createdAt).toLocaleDateString("es-AR")}
                </time>
              </div>
              <p className="text-sm text-muted">{c.detail}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
