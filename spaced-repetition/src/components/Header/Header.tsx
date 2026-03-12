import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm">
      <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent no-underline hover:brightness-110 transition-all"
        >
          Lango
        </Link>
      </div>
    </header>
  );
}
