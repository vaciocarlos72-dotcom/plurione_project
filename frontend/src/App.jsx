import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CrearVacante from './components/CrearVacante'
import VacantesList from './components/VacantesList'

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <h1>PluriOne - Portal de Reclutamiento</h1>
              <CrearVacante
                onCreated={() => setRefreshTrigger((value) => value + 1)}
              />
              <VacantesList refreshTrigger={refreshTrigger} />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
