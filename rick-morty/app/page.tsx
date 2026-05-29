'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

type Character = {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
  gender: string;
};

type CharacterApiResponse = {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
};

const CHARACTERS_URL = "https://rickandmortyapi.com/api/character";

function obtenerPaginaDesdeUrl(url: string | null) {
  if (!url) {
    return null;
  }

  try {
    return Number(new URL(url).searchParams.get("page") ?? 1);
  } catch {
    return null;
  }
}

export default function Home() {
  const [datos, setDatos] = useState<Character[]>([]);
  const [info, setInfo] = useState<CharacterApiResponse["info"] | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarPersonajes() {
      try {
        setCargando(true);
        setError(null);

        const response = await fetch(`${CHARACTERS_URL}?page=${paginaActual}`);

        if (!response.ok) {
          throw new Error(`La API respondió con estado ${response.status}`);
        }

        const data = (await response.json()) as CharacterApiResponse;

        if (!data.info || !Array.isArray(data.results)) {
          throw new Error("La API devolvió un formato inesperado");
        }

        setDatos(data.results);
        setInfo(data.info);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "No se pudieron cargar los personajes";

        setError(message);
      } finally {
        setCargando(false);
      }
    }

    void cargarPersonajes();
  }, [paginaActual]);

  const irAPagina = (url: string | null) => {
    const pagina = obtenerPaginaDesdeUrl(url);

    if (pagina) {
      setPaginaActual(pagina);
    }
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-10 font-sans dark:bg-black">
      <h1 className="mb-8 text-center text-4xl font-bold text-gray-800 dark:text-gray-200">
        Rick and Morty Characters
      </h1>

      {cargando && (
        <p className="text-gray-600 dark:text-gray-400">Cargando personajes...</p>
      )}

      {error && (
        <p className="rounded-md bg-red-100 px-4 py-3 text-red-700 dark:bg-red-950 dark:text-red-200">
          {error}
        </p>
      )}

      {!cargando && !error && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {datos.map((character, index) => (
            <article
              key={character.id}
              className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-800"
            >
              <Image
                src={character.image}
                alt={character.name}
                width={300}
                height={300}
                loading={index === 0 ? "eager" : "lazy"}
                className="mb-4 rounded-lg"
              />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                {character.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Status: {character.status}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Species: {character.species}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Gender: {character.gender}
              </p>
            </article>
          ))}
        </div>
      )}

      {!cargando && !error && info && info.pages > 1 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => irAPagina(info.prev)}
            disabled={!info.prev}
            className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200"
          >
            Anterior
          </button>

          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Página {paginaActual} de {info.pages} · {info.count} personajes
          </span>

          <button
            type="button"
            onClick={() => irAPagina(info.next)}
            disabled={!info.next}
            className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200"
          >
            Siguiente
          </button>
        </div>
      )}
    </main>
  );
}
