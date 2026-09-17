import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav>
      <Link to="/vacantes">Vacantes</Link>
      <Link to="/candidatos">Candidatos</Link>
    </nav>
  )
}

export default Navbar
