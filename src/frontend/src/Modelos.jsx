import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './App.css';

export default function Modelos() {
  const { idEscenario } = useParams(); // Obtiene la ID del escenario desde la URL
  const [modelos, setModelos] = useState([]);

  useEffect(() => {
    const fetchModelos = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/modelos/${idEscenario}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("🔹 Modelos recibidos del backend:", data);
        setModelos(data);
      } catch (error) {
        console.error('❌ Error obteniendo los modelos:', error);
      }
    };

    fetchModelos();
  }, [idEscenario]);

  return (
    <div className="container">
      <div className="contentWrapper">
        <img src='/assets/ctmarmol.png'></img>
        <h1 className="title">Modelos en el Escenario</h1>
        <p className="subtitle">Selecciona un modelo para visualizarlo:</p>

        <div className="scenariosContainer">
          {modelos.length > 0 ? (
            modelos.map(modelo => (
              <div key={modelo.id} className="scenarioCard">
                <Link to={`/visor3dfbx/${modelo.id}`} className="scenarioLink">
                  <h2 className="scenarioTitle">{modelo.nombre}</h2>
                  <div className="scenarioCardImg">
                    {modelo.miniatura ? (
                      <img src={modelo.miniatura} alt={modelo.nombre} className="scenarioImage" />
                    ) : (
                      <p>Imagen no disponible</p>
                    )}
                  </div>
                  <p className="scenarioText">{modelo.descripcion}</p>
                </Link>
              </div>
            ))
          ) : (
            <p className="loadingText">Cargando modelos...</p>
          )}
        </div>
      </div>
    </div>
  );
}
