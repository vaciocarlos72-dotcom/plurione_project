import { useEffect, useState } from 'react'
import api from '../api'

function VacantesList({ refreshTrigger }) {
  const [vacantes, setVacantes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editandoId, setEditandoId] = useState(null)
  const [datosEdicion, setDatosEdicion] = useState({})

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

  const iniciarEdicion = (vacante) => {
    setEditandoId(vacante.id)
    setDatosEdicion({
      titulo: vacante.titulo,
      descripcion: vacante.descripcion || '',
      estado: vacante.estado,
    })
    setError('')
  }

  const guardarEdicion = async (id) => {
    if (!datosEdicion.titulo?.trim() || !datosEdicion.estado?.trim()) {
      setError('El titulo y el estado son obligatorios.')
      return
    }

    try {
      const response = await api.put(`/vacantes/${id}`, {
        titulo: datosEdicion.titulo.trim(),
        descripcion: datosEdicion.descripcion?.trim() || null,
        estado: datosEdicion.estado.trim(),
      })
      setVacantes((currentVacantes) =>
        currentVacantes.map((vacante) =>
          vacante.id === id ? response.data : vacante,
        ),
      )
      setEditandoId(null)
      setDatosEdicion({})
      setError('')
    } catch {
      setError('No se pudo actualizar la vacante.')
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
            {editandoId === vacante.id ? (
              <div className="space-y-3">
                <input
                  value={datosEdicion.titulo || ''}
                  onChange={(event) =>
                    setDatosEdicion({
                      ...datosEdicion,
                      titulo: event.target.value,
                    })
                  }
                  className="w-full rounded border border-gray-300 px-3 py-2"
                  aria-label="Titulo de la vacante"
                />
                <textarea
                  value={datosEdicion.descripcion || ''}
                  onChange={(event) =>
                    setDatosEdicion({
                      ...datosEdicion,
                      descripcion: event.target.value,
                    })
                  }
                  className="min-h-24 w-full rounded border border-gray-300 px-3 py-2"
                  aria-label="Descripcion de la vacante"
                />
                <input
                  value={datosEdicion.estado || ''}
                  onChange={(event) =>
                    setDatosEdicion({
                      ...datosEdicion,
                      estado: event.target.value,
                    })
                  }
                  className="w-full rounded border border-gray-300 px-3 py-2"
                  aria-label="Estado de la vacante"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => guardarEdicion(vacante.id)}
                    className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditandoId(null)}
                    className="rounded bg-gray-500 px-3 py-1 text-white hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-gray-900">
                  {vacante.titulo}
                </h3>
                <p className="mt-2 text-gray-600">
                  {vacante.descripcion || 'Sin descripcion'}
                </p>
                <p className="mt-4 text-sm font-medium text-blue-700">
                  Estado: {vacante.estado}
                </p>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => iniciarEdicion(vacante)}
                    className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => eliminarRegistro(vacante.id)}
                    className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

export default VacantesList
