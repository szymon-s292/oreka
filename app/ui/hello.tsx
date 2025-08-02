import Link from "next/link";

export default function Hello() {
  return (
    <section className="h-screen relative flex items-center justify-center text-gray-800 parallax-bg" >
      <div className=" max-w-3xl lg:rounded-lg text-center p-6" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
        <h1 className="text-4xl md:text-6xl font-bold  mb-6 animate-fade-in-up">
          Zrealizuj swoje marzenie o domu
          <br />
          <span className="text-gray-800">Wybierz najlepszy projekt dla siebie</span>
        </h1>

        <p className="text-lg md:text-xl mb-8 gray-800 animate-fade-in-up">
          Oferujemy wyjątkowe projektów domów – dopasuj je do swoich potrzeb, stylu życia i budżetu.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-4 animate-fade-in-up">
          <Link
            href={'#projects'}
            className="bg-gray-800 hover:text-gray-800 hover:bg-white text-white py-3 px-6 rounded-lg transition-all shadow-lg"
          >
            Przeglądaj projekty
          </Link>
          <Link
            href={'#contact'}
            className="bg-white text-gray-600 hover:text-gray-800 py-3 px-6 rounded-lg transition-all shadow-lg"
          >
            Skontaktuj się
          </Link>
        </div>
      </div>
    </section>
  );
}
