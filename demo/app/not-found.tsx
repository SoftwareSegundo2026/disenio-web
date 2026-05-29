export default function NotFound() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400">
          Oops! The page you're looking for doesn't exist.
        </p>
        <a
          href="/"
          className="mt-4 inline-block rounded-full bg-blue-500 px-5 py-2 text-white transition-colors hover:bg-blue-600"
        >
          Go Back Home
        </a>
      </main>
    </div>
  );
}