import { useEffect, useState } from 'react'
import api from '../api'

function Dashboard() {
  const [totalVacantes, setTotalVacantes] = useState(0)
  const [totalCandidatos, setTotalCandidatos] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const fetchSummary = async () => {
      try {
        const [vacantesResponse, candidatosResponse] = await Promise.all([
          api.get('/vacantes/'),
          api.get('/candidatos/'),
        ])

        if (isMounted) {
          setTotalVacantes(vacantesResponse.data.length)
          setTotalCandidatos(candidatosResponse.data.length)
        }
      } catch {
        if (isMounted) {
          setError('No se pudieron cargar los datos del resumen.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchSummary()

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return <p className="text-gray-600">Cargando resumen...</p>
  }

  if (error) {
    return <p className="text-red-700" role="alert">{error}</p>
  }

  return (
    <section>
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        Resumen de Reclutamiento
      </h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-gray-100 bg-blue-600 p-8 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <p className="text-lg font-medium text-blue-100">Total de Vacantes</p>
          <p className="mt-2 text-5xl font-bold">{totalVacantes}</p>
        </article>
        <article className="rounded-xl border border-gray-100 bg-slate-800 p-8 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <p className="text-lg font-medium text-slate-300">
            Candidatos Registrados
          </p>
          <p className="mt-2 text-5xl font-bold">{totalCandidatos}</p>
        </article>
      </div>
    </section>
  )
}

export default Dashboard
