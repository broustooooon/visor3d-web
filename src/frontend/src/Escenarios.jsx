import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

export default function Escenarios() {
  const [escenarios, setEscenarios] = useState([]);

  useEffect(() => {
    const fetchEscenarios = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/escenarios'); // Verifica el puerto correcto

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        console.log("🔹 Datos recibidos del backend:", data);

        setEscenarios(data);
      } catch (error) {
        console.error('❌ Error obteniendo los escenarios:', error);
      }
    };

    fetchEscenarios();
  }, []);

  return (
    <div className="container">
      <div className="contentWrapper">
        <img className="img" src='/assets/ctmarmol.png'></img>
        <h1 className="title">Escenarios Interactivos</h1>
        <p className="subtitle">Selecciona un escenario para ver más detalles:</p>
        <div className="scenariosContainer">
          {escenarios.length > 0 ? (
            escenarios.map(escenario => (
              <Link 
                to={`/modelos/${escenario.id}`} // Navega a Modelo.jsx con el id del escenario
                key={escenario.id} 
                className="scenarioCard"
              >
                <h2 className="scenarioTitle">{escenario.nombre}</h2>
                <div className="scenarioCardImg">
                  {escenario.miniatura ? (
                    <img src={escenario.miniatura} alt={escenario.nombre} />
                  ) : (
                    <p>Imagen no disponible</p>
                  )}
                </div>
                <p className="scenarioText">{escenario.descripcion}</p>
              </Link>
            ))
          ) : (
            <p className="loadingText">Cargando escenarios...</p>
          )}
        </div>
      </div>
    </div>
  );
}
