import { useEffect, useState } from 'react'
import api from '../api'

function CandidatosList({ refreshTrigger }) {
  const [candidatos, setCandidatos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editandoId, setEditandoId] = useState(null)
  const [datosEdicion, setDatosEdicion] = useState({})
  const [busqueda, setBusqueda] = useState('')

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

  const iniciarEdicion = (candidato) => {
    setEditandoId(candidato.id)
    setDatosEdicion({
      nombre: candidato.nombre,
      email: candidato.email,
      telefono: candidato.telefono || '',
      canal_origen: candidato.canal_origen,
    })
    setError('')
  }

  const guardarEdicion = async (id) => {
    if (
      !datosEdicion.nombre?.trim() ||
      !datosEdicion.email?.trim() ||
      !datosEdicion.canal_origen?.trim()
    ) {
      setError('El nombre, email y canal de origen son obligatorios.')
      return
    }

    try {
      const response = await api.put(`/candidatos/${id}`, {
        nombre: datosEdicion.nombre.trim(),
        email: datosEdicion.email.trim(),
        telefono: datosEdicion.telefono?.trim() || null,
        canal_origen: datosEdicion.canal_origen.trim(),
      })
      setCandidatos((currentCandidatos) =>
        currentCandidatos.map((candidato) =>
          candidato.id === id ? response.data : candidato,
        ),
      )
      setEditandoId(null)
      setDatosEdicion({})
      setError('')
    } catch {
      setError('No se pudo actualizar el candidato.')
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

  const candidatosFiltrados = candidatos.filter((candidato) =>
    candidato.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  )

  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">
        Candidatos registrados
      </h2>
      <input
        type="text"
        value={busqueda}
        onChange={(event) => setBusqueda(event.target.value)}
        placeholder="Buscar por nombre..."
        className="mb-6 w-full rounded border border-gray-300 px-4 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
        aria-label="Buscar candidatos por nombre"
      />
      {candidatosFiltrados.length === 0 ? (
        <p className="text-gray-600">No hay coincidencias.</p>
      ) : (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {candidatosFiltrados.map((candidato) => (
          <article
            key={candidato.id}
            className="flex flex-col rounded bg-white p-4 shadow"
          >
            {editandoId === candidato.id ? (
              <div className="space-y-3">
                {[
                  ['nombre', 'Nombre'],
                  ['email', 'Email'],
                  ['telefono', 'Telefono'],
                  ['canal_origen', 'Canal de origen'],
                ].map(([field, label]) => (
                  <input
                    key={field}
                    type={field === 'email' ? 'email' : 'text'}
                    value={datosEdicion[field] || ''}
                    onChange={(event) =>
                      setDatosEdicion({
                        ...datosEdicion,
                        [field]: event.target.value,
                      })
                    }
                    className="w-full rounded border border-gray-300 px-3 py-2"
                    aria-label={label}
                  />
                ))}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => guardarEdicion(candidato.id)}
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
                  {candidato.nombre}
                </h3>
                <p className="mt-2 text-gray-600">{candidato.email}</p>
                <p className="mt-1 text-gray-600">
                  {candidato.telefono || 'Sin telefono'}
                </p>
                <p className="mt-4 text-sm font-medium text-blue-700">
                  Canal: {candidato.canal_origen}
                </p>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => iniciarEdicion(candidato)}
                    className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => eliminarRegistro(candidato.id)}
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
      )}
    </section>
  )
}

export default CandidatosList
