import { useState } from 'react'
import api from '../api'

function CrearCandidato({ onCreated }) {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    canal_origen: '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    if (Object.values(form).some((value) => !value.trim())) {
      setError('Todos los campos son obligatorios.')
      return
    }

    setSubmitting(true)

    try {
      await api.post('/candidatos/', {
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        telefono: form.telefono.trim(),
        canal_origen: form.canal_origen.trim(),
      })
      setForm({ nombre: '', email: '', telefono: '', canal_origen: '' })
      setMessage('Candidato creado correctamente.')
      onCreated()
    } catch {
      setError('No se pudo crear el candidato.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section>
      <h2>Crear candidato</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={form.nombre}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="telefono">Telefono</label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            value={form.telefono}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="canal_origen">Canal de origen</label>
          <input
            id="canal_origen"
            name="canal_origen"
            type="text"
            value={form.canal_origen}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Guardando...' : 'Crear candidato'}
        </button>
      </form>
      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}
    </section>
  )
}

export default CrearCandidato
