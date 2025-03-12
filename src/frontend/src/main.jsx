import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
//import './App.css'  // Tu hoja de estilos
import './App.css'  // Tu hoja de estilos
import Escenarios from './Escenarios'
import Visor3Dfbx from './Visor3dfbx'
import Modelos from './Modelos'
import Escenarios from './Escenarios'

function Main() {
  return (
    <div className="container">
      <div className="contentWrapper">
        <h1 className="title">Pantalla Principal</h1>
        <p className="subtitle">
          Esta es la pantalla principal, haz clic en el botón para ir a Home.
        </p>

        {/* Botón (o enlace) para ir a la ruta de Home */}
        <div className="container">
          <Link to="/home" className="buttonLink">
            <h2 className="scenarioTitle">Ir a Home</h2>
          </Link>
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      {/* Ruta por defecto que muestra la pantalla principal */}
      <Route path="/" element={<Main />} />

      {/* Ruta para Home */}
      <Route path="/escenarios" element={<Escenarios />} />

      {/* Ruta para Home */}
      <Route path="/modelos/:idEscenario" element={<Modelos />} />

      {/* Ruta para Visor3dfbx */}
      <Route path="/visor3dfbx" element={<Visor3Dfbx />} />

      {/* Ruta para Visor3dfbx */}
      <Route path="/visor3dfbx/:modelId" element={<Visor3Dfbx />} />
    </Routes>
  </BrowserRouter>
)
