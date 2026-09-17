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

  const eliminarRegistro = async (id) => {
    setError('')
    try {
      await api.delete(`/candidatos/${id}`)
      setCandidatos((currentCandidatos) =>
        currentCandidatos.filter((candidato) => candidato.id !== id),
      )
    } catch {
      setError('No se pudo eliminar el candidato.')
    }
  }

  if (loading) {
    return <p className="text-gray-600">Cargando candidatos...</p>
  }

  if (error) {
    return <p className="text-red-700" role="alert">{error}</p>
  }

  if (candidatos.length === 0) {
    return <p className="text-gray-600">No hay candidatos registrados.</p>
  }

  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">
        Candidatos registrados
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {candidatos.map((candidato) => (
          <article
            key={candidato.id}
            className="flex flex-col rounded bg-white p-4 shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900">
              {candidato.nombre}
            </h3>
            <p className="mt-2 text-gray-600">{candidato.email}</p>
            <p className="mt-1 text-gray-600">
              {candidato.telefono || 'Sin telefono'}
            </p>
            <p className="mt-4 text-sm font-medium text-blue-700">
              Canal: {candidato.canal_origen}
            </p>
            <button
              type="button"
              onClick={() => eliminarRegistro(candidato.id)}
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

export default CandidatosList
