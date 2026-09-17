import { useEffect, useState } from 'react'
import api from '../api'

function VacantesList({ refreshTrigger }) {
  const [vacantes, setVacantes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const fetchVacantes = async () => {
      try {
        const response = await api.get('/vacantes/')
        if (isMounted) {
          setVacantes(response.data)
        }
      } catch {
        if (isMounted) {
          setError('No se pudieron cargar las vacantes.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchVacantes()

    return () => {
      isMounted = false
    }
  }, [refreshTrigger])

  if (loading) {
    return <p>Cargando vacantes...</p>
  }

  if (error) {
    return <p role="alert">{error}</p>
  }

  if (vacantes.length === 0) {
    return <p>No hay vacantes disponibles.</p>
  }

  return (
    <section>
      <h2>Vacantes disponibles</h2>
      <table>
        <thead>
          <tr>
            <th>Titulo</th>
            <th>Descripcion</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {vacantes.map((vacante) => (
            <tr key={vacante.id}>
              <td>{vacante.titulo}</td>
              <td>{vacante.descripcion || 'Sin descripcion'}</td>
              <td>{vacante.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default VacantesList
