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

  const eliminarRegistro = async (id) => {
    setError('')
    try {
      await api.delete(`/vacantes/${id}`)
      setVacantes((currentVacantes) =>
        currentVacantes.filter((vacante) => vacante.id !== id),
      )
    } catch {
      setError('No se pudo eliminar la vacante.')
    }
  }

  if (loading) {
    return <p className="text-gray-600">Cargando vacantes...</p>
  }

  if (error) {
    return <p className="text-red-700" role="alert">{error}</p>
  }

  if (vacantes.length === 0) {
    return <p className="text-gray-600">No hay vacantes disponibles.</p>
  }

  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">
        Vacantes disponibles
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {vacantes.map((vacante) => (
          <article
            key={vacante.id}
            className="flex flex-col rounded bg-white p-4 shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900">
              {vacante.titulo}
            </h3>
            <p className="mt-2 text-gray-600">
              {vacante.descripcion || 'Sin descripcion'}
            </p>
            <p className="mt-4 text-sm font-medium text-blue-700">
              Estado: {vacante.estado}
            </p>
            <button
              type="button"
              onClick={() => eliminarRegistro(vacante.id)}
              className="mt-4 self-end rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
            >
              Eliminar
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default VacantesList
