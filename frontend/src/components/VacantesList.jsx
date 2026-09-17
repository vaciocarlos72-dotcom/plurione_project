import { useEffect, useState } from 'react'
import api from '../api'

function VacantesList({ refreshTrigger }) {
  const [vacantes, setVacantes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editandoId, setEditandoId] = useState(null)
  const [datosEdicion, setDatosEdicion] = useState({})
  const [candidatosDisponibles, setCandidatosDisponibles] = useState([])
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState({})
  const [notificacion, setNotificacion] = useState('')
  const [vacanteExpandida, setVacanteExpandida] = useState(null)
  const [postulacionesActivas, setPostulacionesActivas] = useState([])

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

  useEffect(() => {
    let isMounted = true

    const fetchCandidatos = async () => {
      try {
        const response = await api.get('/candidatos/')
        if (isMounted) {
          setCandidatosDisponibles(response.data)
        }
      } catch {
        if (isMounted) {
          setError('No se pudieron cargar los candidatos disponibles.')
        }
      }
    }

    fetchCandidatos()

    return () => {
      isMounted = false
    }
  }, [])

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

  const asignarCandidato = async (vacanteId) => {
    const candidatoId = candidatoSeleccionado[vacanteId]
    if (!candidatoId) {
      setNotificacion('Selecciona un candidato antes de asignarlo.')
      return
    }

    try {
      await api.post('/postulaciones/', {
        candidato_id: Number(candidatoId),
        vacante_id: vacanteId,
      })
      setNotificacion('Candidato asignado correctamente.')
      setCandidatoSeleccionado((currentSelection) => ({
        ...currentSelection,
        [vacanteId]: '',
      }))
    } catch {
      setNotificacion('No se pudo asignar el candidato.')
    }
  }

  const mostrarPostulados = async (vacanteId) => {
    if (vacanteExpandida === vacanteId) {
      setVacanteExpandida(null)
      setPostulacionesActivas([])
      return
    }

    try {
      const response = await api.get(`/vacantes/${vacanteId}/postulaciones`)
      setPostulacionesActivas(response.data)
      setVacanteExpandida(vacanteId)
      setError('')
    } catch {
      setError('No se pudieron cargar los postulados.')
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
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <select
                      value={candidatoSeleccionado[vacante.id] || ''}
                      onChange={(event) =>
                        setCandidatoSeleccionado((currentSelection) => ({
                          ...currentSelection,
                          [vacante.id]: event.target.value,
                        }))
                      }
                      className="flex-1 rounded border border-gray-300 px-3 py-2"
                      aria-label={`Candidato para ${vacante.titulo}`}
                    >
                      <option value="">Seleccionar candidato</option>
                      {candidatosDisponibles.map((candidato) => (
                        <option key={candidato.id} value={candidato.id}>
                          {candidato.nombre}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => asignarCandidato(vacante.id)}
                      className="rounded bg-green-600 px-3 py-2 text-white hover:bg-green-700"
                    >
                      Asignar Candidato
                    </button>
                  </div>
                  {notificacion && (
                    <p className="mt-2 text-sm text-green-700" role="status">
                      {notificacion}
                    </p>
                  )}
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => mostrarPostulados(vacante.id)}
                    className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                  >
                    {vacanteExpandida === vacante.id
                      ? 'Ocultar Postulados'
                      : 'Ver Postulados'}
                  </button>
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
                {vacanteExpandida === vacante.id && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <h4 className="font-semibold text-gray-800">Postulados</h4>
                    {postulacionesActivas.length === 0 ? (
                      <p className="mt-2 text-sm text-gray-600">
                        No hay postulados para esta vacante.
                      </p>
                    ) : (
                      <ul className="mt-2 space-y-2">
                        {postulacionesActivas.map((postulacion) => (
                          <li
                            key={postulacion.id}
                            className="flex justify-between rounded bg-gray-50 px-3 py-2 text-sm"
                          >
                            <span className="font-medium text-gray-800">
                              {postulacion.candidato?.nombre || 'Candidato'}
                            </span>
                            <span className="text-gray-600">
                              {postulacion.estado}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

export default VacantesList
