import { useEffect, useState } from 'react'
import api from '../api'

function CandidatosList({ refreshTrigger }) {
  const [candidatos, setCandidatos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const fetchCandidatos = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await api.get('/candidatos/')
        if (isMounted) {
          setCandidatos(response.data)
        }
      } catch {
        if (isMounted) {
          setError('No se pudieron cargar los candidatos.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchCandidatos()

    return () => {
      isMounted = false
    }
  }, [refreshTrigger])

  if (loading) {
    return <p>Cargando candidatos...</p>
  }

  if (error) {
    return <p role="alert">{error}</p>
  }

  if (candidatos.length === 0) {
    return <p>No hay candidatos registrados.</p>
  }

  return (
    <section>
      <h2>Candidatos registrados</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Telefono</th>
            <th>Canal de origen</th>
          </tr>
        </thead>
        <tbody>
          {candidatos.map((candidato) => (
            <tr key={candidato.id}>
              <td>{candidato.nombre}</td>
              <td>{candidato.email}</td>
              <td>{candidato.telefono || 'Sin telefono'}</td>
              <td>{candidato.canal_origen}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default CandidatosList
