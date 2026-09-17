import { useState } from 'react'
import api from '../api'

function CrearVacante({ onCreated }) {
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    if (!titulo.trim() || !descripcion.trim()) {
      setError('El titulo y la descripcion son obligatorios.')
      return
    }

    setSubmitting(true)

    try {
      await api.post('/vacantes/', {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        estado: 'abierta',
      })
      setTitulo('')
      setDescripcion('')
      setMessage('Vacante creada correctamente.')
      onCreated()
    } catch {
      setError('No se pudo crear la vacante.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section>
      <h2>Crear vacante</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="titulo">Titulo</label>
          <input
            id="titulo"
            type="text"
            value={titulo}
            onChange={(event) => setTitulo(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="descripcion">Descripcion</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(event) => setDescripcion(event.target.value)}
          />
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Guardando...' : 'Crear vacante'}
        </button>
      </form>
      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}
    </section>
  )
}

export default CrearVacante
