import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { Order } from "@/lib/types";

/*
  API de pedidos.

  TODO TP: completá esta API guiándote por app/api/comentarios/route.ts.

  - GET /api/pedidos → devuelve todos los pedidos de data/pedidos.json.
  - POST /api/pedidos → agrega un pedido nuevo al JSON.

  Pistas:
  - Mismo patrón que comentarios: archivo, leerPedidos(), guardarPedidos().
  - POST recibe { customer, items, total } y debe armar el objeto Order
    con id y createdAt antes de guardarlo. El tipo Order ya está en lib/types.ts.
*/

const archivo = path.join(process.cwd(), "data", "pedidos.json");

async function leerPedidos(): Promise<Order[]> {
  const contenido = await fs.readFile(archivo, "utf-8");
  return JSON.parse(contenido);
}

export async function GET() {
  const pedidos = await leerPedidos();
  return NextResponse.json(pedidos);
}

export async function POST(request: Request) {
  const body = await request.json();

  // TODO TP: implementar el POST
  // 1. Leer los pedidos actuales con leerPedidos().
  // 2. Armar el nuevo pedido: { id, customer, items, total, createdAt }.
  // 3. Guardar el arreglo con el nuevo pedido.
  // 4. Devolver NextResponse.json(pedidoNuevo, { status: 201 }).

  console.log("TODO: guardar pedido", body);
  return NextResponse.json(
    { error: "POST /api/pedidos sin implementar (TODO TP)" },
    { status: 501 },
  );
}
