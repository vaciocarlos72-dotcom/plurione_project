import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 text-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight">
          PluriOne
        </Link>
        <div className="flex gap-6">
          <Link to="/" className="transition hover:text-slate-300">
            Inicio
          </Link>
          <Link to="/vacantes" className="transition hover:text-slate-300">
            Vacantes
          </Link>
          <Link to="/candidatos" className="transition hover:text-slate-300">
            Candidatos
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
