import HomeButton from "@/components/HomeButton";

export default function Clients() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-4xl font-bold text-blue-500">Clientes</h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Aca vemos los clientes de la empresa, con su informacion y todo lo que se necesite para gestionarlos.
        </p>
        <HomeButton />
      </main>
    </div>
  );
}   