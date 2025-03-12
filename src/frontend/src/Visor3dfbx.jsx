import React, { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Stats,
  OrthographicCamera,
  PerspectiveCamera
} from "@react-three/drei";
import { Box3, Vector3 } from "three";
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { SketchPicker } from "react-color";
import { ArrowLeft, RefreshCw } from "@geist-ui/icons";
import { ModelFBX } from "./ModelFBX";
import "./Visor3D.css";

export default function Visor3Dfbx() {
  const navigate = useNavigate();
  const { modelId } = useParams();
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const lightRef = useRef(null);
  const modelRef = useRef(null);

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .MuiTooltip-tooltip`]: {
      backgroundColor: theme.palette.common.black,
      color: 'white',
      maxWidth: 200,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }));

  const [backgroundColor, setBackgroundColor] = useState("#949494"); // Color inicial del fondo
  const [showColorPicker, setShowColorPicker] = useState(false); // Mostrar/Ocultar selector

  const handleColorChange = (color) => {
    setBackgroundColor(color.hex);
  };

  // Usamos este estado para alternar entre ortográfica y perspectiva
  const [useOrthographic, setUseOrthographic] = useState(false);

  // Control de escala del modelo
  const [modelScale, setModelScale] = useState(1);

  const adjustModelScale = (modelo) => {
    if (!modelo) return;

    const boundingBox = new Box3().setFromObject(modelo);
    const size = new Vector3();
    boundingBox.getSize(size);

    const maxDimension = Math.max(size.x, size.y, size.z);
    const desiredSize = 5;
    const scaleFactor = desiredSize / maxDimension;

    console.log("🔄 Ajustando escala del modelo. Factor:", scaleFactor);
    setModelScale(scaleFactor);
  };

  // Reiniciar vista: posición de cámara y modelo
  const resetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(4, 3.5, 4);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
    if (modelRef.current) {
      modelRef.current.position.set(0, 0, 0);
    }
  };

  // Botones para alternar cámara
  const activatePerspective = () => {
    setUseOrthographic(false);
    resetView();
  };

  const activateOrthographic = () => {
    setUseOrthographic(true);
    resetView();
  };

  return (
    <div className="container">
      <div className="contentWrapper">
        <img src="/assets/ctmarmol.png" />
        <div className="visor3d-container">
          <div className="top-bar">
            <HtmlTooltip title={<Typography color="inherit">Retroceder</Typography>}>
              <button onClick={() => navigate(-1)} className="icon">
                <ArrowLeft />
              </button>
            </HtmlTooltip>

            <HtmlTooltip title={<Typography color="inherit">Reiniciar vista</Typography>}>
              <button onClick={resetView} className="icon">
                <RefreshCw />
              </button>
            </HtmlTooltip>

            <HtmlTooltip title={<Typography color="inherit">Cámara Perspectiva</Typography>}>
              <button onClick={activatePerspective} className="icon perspective">
                <img src="/assets/perspectiva.png" alt="Perspectiva" />
              </button>
            </HtmlTooltip>

            <HtmlTooltip title={<Typography color="inherit">Cámara Ortográfica</Typography>}>
              <button onClick={activateOrthographic} className="icon orthographic">
                <img src="/assets/ortografica.png" alt="Ortográfica" />
              </button>
            </HtmlTooltip>

            <div className="color-picker-wrapper">
              <button
                className="icon color-picker-btn"
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                <img src="/assets/paint.png" />
              </button>

              {showColorPicker && (
                <div className="color-picker-container">
                  <SketchPicker color={backgroundColor} onChange={handleColorChange} />
                </div>
              )}
            </div>


            {/* El resto de iconos que ya tenías (opcional) 
            {[...Array(3)].map((_, index) => (
              <div key={index + 3} className={`icon icon-${index + 3}`} />
            ))}
            */}
          </div>

          <div className="main-content">
            <div className="canvas-wrapper">
              <Canvas
                shadows
                style={{ width: "100%", height: "100%" }}
                onCreated={({ gl }) => {
                  gl.setSize(window.innerWidth, window.innerHeight);
                  gl.setPixelRatio(window.devicePixelRatio);
                  gl.shadowMap.enabled = true;
                }}
              >
                <color attach="background" args={[backgroundColor]} />
                {useOrthographic ? (
                  <OrthographicCamera
                    ref={cameraRef}
                    makeDefault
                    // Ajusta `zoom` según el tamaño del modelo y la escena
                    // A mayor zoom, más cerca parecerá la vista
                    zoom={50}
                    near={0.1}
                    far={3000}
                    position={[4, 3.5, 4]}
                  />
                ) : (
                  <PerspectiveCamera
                    ref={cameraRef}
                    makeDefault
                    fov={75}
                    near={0.1}
                    far={3000}
                    position={[4, 3.5, 4]}
                  />
                )}

                {/* Luces */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
                <pointLight ref={lightRef} color={0xffffff} intensity={5} castShadow />

                {/* Para mover la luz junto con la cámara */}
                <LightFollower lightRef={lightRef} />

                {/* Tu modelo FBX */}
                <ModelFBX
                  ref={modelRef}
                  modelId={modelId}
                  position={[0, 0, 0]}
                  scale={modelScale}
                  onModelLoaded={adjustModelScale}
                />

                {/* Controles de órbita y stats */}
                <OrbitControls ref={controlsRef} enableDamping={true} />
                <Stats />
              </Canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente que hace que la luz "persiga" a la cámara activa
function LightFollower({ lightRef }) {
  useFrame(({ camera }) => {
    if (lightRef.current) {
      lightRef.current.position.copy(camera.position);
    }
  });
  return null;
}
