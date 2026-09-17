import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import CandidatosList from './components/CandidatosList'
import CrearCandidato from './components/CrearCandidato'
import CrearVacante from './components/CrearVacante'
import Navbar from './components/Navbar'
import VacantesList from './components/VacantesList'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/vacantes" replace />} />
        <Route path="/vacantes" element={<VacantesRoute />} />
        <Route path="/candidatos" element={<CandidatosRoute />} />
      </Routes>
    </BrowserRouter>
  )
}

function VacantesRoute() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  return (
    <>
      <h1>PluriOne - Portal de Reclutamiento</h1>
      <CrearVacante
        onCreated={() => setRefreshTrigger((value) => value + 1)}
      />
      <VacantesList refreshTrigger={refreshTrigger} />
    </>
  )
}

function CandidatosRoute() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  return (
    <>
      <h1>PluriOne - Portal de Reclutamiento</h1>
      <CrearCandidato
        onCreated={() => setRefreshTrigger((value) => value + 1)}
      />
      <CandidatosList refreshTrigger={refreshTrigger} />
    </>
  )
}

export default App
