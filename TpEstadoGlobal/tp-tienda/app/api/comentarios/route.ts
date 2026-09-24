import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { Comment } from "@/lib/types";

/*
  API de comentarios.
  Este archivo es el EJEMPLO COMPLETO de una API con Next.js
  (route handler) que lee y escribe un archivo JSON.

  Usalo de referencia para completar app/api/pedidos/route.ts.

  - GET /api/comentarios → devuelve todos los comentarios.
  - POST /api/comentarios → agrega un comentario nuevo.
*/

const archivo = path.join(process.cwd(), "data", "comentarios.json");

async function leerComentarios(): Promise<Comment[]> {
  const contenido = await fs.readFile(archivo, "utf-8");
  return JSON.parse(contenido);
}

async function guardarComentarios(comentarios: Comment[]) {
  await fs.writeFile(archivo, JSON.stringify(comentarios, null, 2), "utf-8");
}

export async function GET() {
  const comentarios = await leerComentarios();
  return NextResponse.json(comentarios);
}

export async function POST(request: Request) {
  const body = await request.json();
  const comentarios = await leerComentarios();

  const nuevo: Comment = {
    id: Date.now(),
    title: body.title || "Sin título",
    detail: body.detail || "",
    createdAt: new Date().toISOString(),
  };

  comentarios.push(nuevo);
  await guardarComentarios(comentarios);

  return NextResponse.json(nuevo, { status: 201 });
}
