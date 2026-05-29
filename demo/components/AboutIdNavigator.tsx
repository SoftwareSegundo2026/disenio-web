'use client';

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AboutIdNavigator() {
    const router = useRouter();
    const [id, setId] = useState("1");

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const numericId = Number(id);

        if (!Number.isInteger(numericId) || numericId < 1 || numericId > 100) {
            return;
        }

        router.push(`/about/${numericId}`);
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
                type="number"
                min="1"
                max="100"
                value={id}
                onChange={(event) => setId(event.target.value)}
                className="rounded-full border border-zinc-300 px-5 py-2 text-zinc-900 dark:border-zinc-700"
                aria-label="Id de acerca de"
                required
            />
            <button
                type="submit"
                className="rounded-full bg-blue-500 px-5 py-2 text-white transition-colors hover:bg-blue-600"
            >
                Ir al detalle
            </button>
        </form>
    );
}
