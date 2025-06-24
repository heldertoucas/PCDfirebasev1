// Ficheiro: src/app/page.tsx

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8">
      <div className="text-center">
        {/* Ícone da Aplicação - opcional mas recomendado para identidade visual */}
        <span className="text-6xl" role="img" aria-label="cursor a clicar">
          🖱️
        </span>

        {/* Título Principal */}
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Passaporte Competências Digitais 
        </h1>

        {/* Subtítulo / Missão */}
        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          A nossa missão é promover o desenvolvimento de competências digitais
          básicas para todos.  Procuramos desmistificar o uso quotidiano da
          tecnologia, para que os cidadãos possam, de uma forma simples e
          prática, ultrapassar receios e encontrar vantagens na sua utilização. 
        </p>
      </div>
    </main>
  );
}