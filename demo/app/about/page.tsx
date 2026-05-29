import AboutIdNavigator from "@/components/AboutIdNavigator";
import HomeButton from "@/components/HomeButton";

export default function About() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-4xl font-bold text-blue-500">Acerca de Nosotros</h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Somos una empresa dedicada a proporcionar soluciones innovadoras en el ámbito de la tecnología. Nuestro equipo está compuesto por expertos apasionados que trabajan arduamente para ofrecer productos y servicios de alta calidad a nuestros clientes.
        </p>
        <AboutIdNavigator />
        <HomeButton />
      </main>
    </div>
  );
}   
