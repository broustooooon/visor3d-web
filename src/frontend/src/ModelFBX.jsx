import React, { useEffect, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { TextureLoader, MeshBasicMaterial  } from "three";

/*
export function ModelFBX({ modelId, position, rotation, scale }) {
  
  const [model, setModel] = useState(null);
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const fetchModel = async () => {
      try {

        ///// CAMBIAR ESTO POR LO SIGUIENTE

        /*
        const apiUrl = import.meta.env.VITE_BACKEND_URL;

        fetch(`${apiUrl}/api/escenarios`)
          .then(response => response.json())
          .then(data => console.log(data))
          .catch(error => console.error('Error:', error));
        ///
        
        
        const response = await fetch(`http://localhost:4000/api/modelo3d/${modelId}`);
        const data = await response.json();

        if (!data.modelo) {
          console.error('❌ No se encontró el modelo en la base de datos.');
          return;
        }

        // Convertir el modelo FBX en binario
        const fbxBinary = Uint8Array.from(atob(data.modelo), c => c.charCodeAt(0));
        const fbxBlob = new Blob([fbxBinary], { type: 'application/octet-stream' });
        const fbxUrl = URL.createObjectURL(fbxBlob);

        // Cargar modelo FBX
        const loader = new FBXLoader();
        loader.load(fbxUrl, (loadedModel) => {
          setModel(loadedModel);
        });

        // Cargar textura si existe
        
        if (data.textura) {
          const textureBinary = Uint8Array.from(atob(data.textura), c => c.charCodeAt(0));
          const textureBlob = new Blob([textureBinary], { type: 'image/png' });
          const textureUrl = URL.createObjectURL(textureBlob);

          const textureLoader = new TextureLoader();
          textureLoader.load(textureUrl, (loadedTexture) => {
            setTexture(loadedTexture);
          });
        } else {
          console.warn("⚠️ No se encontró una textura en la base de datos. Buscando en el FBX...");

          // Intentar cargar la textura embebida en el FBX
          if (loadedModel?.children.length > 0) {
            let foundTexture = false;

            loadedModel.traverse((child) => {
              if (child.isMesh && child.material && child.material.map) {
                setTexture(child.material.map);
                foundTexture = true;
              }
            });

            if (foundTexture) {
              console.log("✅ Se encontró una textura embebida en el FBX.");
            } else {
              console.warn("❌ El FBX no contiene una textura embebida.");
            }
          } else {
            console.warn("❌ El modelo FBX no tiene información suficiente para una textura embebida.");
          }
        }
        
        /*
        // Cargar textura directamente desde la ruta local
        const textureLoader = new TextureLoader();
        textureLoader.load('/3dmodels/Cat_diffuse.jpg', (loadedTexture) => {
          setTexture(loadedTexture);
        }, undefined, (error) => {
          console.error('❌ Error cargando la textura:', error);
        });
        /////
      } catch (error) {
        console.error('🔴 Error cargando el modelo:', error);
      }
    };

    fetchModel();
  }, [modelId]);

  useEffect(() => {
    if (model && texture) {
      model.traverse((child) => {
        if (child.isMesh) {
          child.material.map = texture;
          child.material.needsUpdate = true;
        }
      });
    }
  }, [model, texture]);

  if (!model) {
    return <mesh><boxGeometry /><meshBasicMaterial color="red" /></mesh>;
  }

  return <primitive object={model} position={position} rotation={rotation} scale={scale} />;
}
*/

export function ModelFBX({ modelId, position, rotation, scale, onModelLoaded }) {
  const [model, setModel] = useState(null);
  const [textures, setTextures] = useState([]);

  useEffect(() => {
    const fetchModel = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/modelo3d/${modelId}`);
        const data = await response.json();

        if (!data.modelo) {
          console.error("❌ No se encontró el modelo en la base de datos.");
          return;
        }

        // Convertir el modelo FBX en binario
        const fbxBinary = Uint8Array.from(atob(data.modelo), (c) => c.charCodeAt(0));
        const fbxBlob = new Blob([fbxBinary], { type: "application/octet-stream" });
        const fbxUrl = URL.createObjectURL(fbxBlob);

        // Cargar modelo FBX
        const loader = new FBXLoader();
        loader.load(
          fbxUrl,
          (loadedModel) => {
            console.log("✅ Modelo FBX cargado correctamente.");
            setModel(loadedModel);

            // Llamamos a la función para ajustar la cámara
            if (onModelLoaded) {
              onModelLoaded(loadedModel);
            }

            // Si hay texturas en la base de datos, las aplicamos
            let texturasArray = Array.isArray(data.texturas) ? data.texturas.filter(tex => tex !== null) : [];
            if (texturasArray.length > 0) {
              cargarTexturas(loadedModel, texturasArray);
            } else {
              aplicarMaterialPorDefecto(loadedModel);
            }
          },
          undefined,
          (error) => {
            console.error("❌ Error cargando el modelo FBX:", error);
          }
        );
      } catch (error) {
        console.error("🔴 Error obteniendo el modelo del backend:", error);
      }
    };

    fetchModel();
  }, [modelId]);

  const cargarTexturas = (loadedModel, texturasArray) => {
    const textureLoader = new TextureLoader();
    const loadedTextures = [];

    texturasArray.forEach((textureBase64, index) => {
      try {
        const textureBinary = Uint8Array.from(atob(textureBase64), (c) => c.charCodeAt(0));
        const textureBlob = new Blob([textureBinary], { type: "image/png" });
        const textureUrl = URL.createObjectURL(textureBlob);

        textureLoader.load(
          textureUrl,
          (loadedTexture) => {
            console.log("⚙️ Cargando las texturas"); 
            loadedTextures.push(loadedTexture);
            if (loadedTextures.length === texturasArray.length) {
              setTextures(loadedTextures);
              aplicarTexturas(loadedModel, loadedTextures);
            }
          },
          undefined,
          (error) => {
            console.error(`❌ Error cargando la textura ${index}:`, error);
          }
        );
      } catch (error) {
        console.error(`❌ Error decodificando la textura ${index}:`, error);
      }
    });
  };

  const aplicarTexturas = (loadedModel, loadedTextures) => {
    console.log("🎨 Aplicando texturas al modelo..."); 
    loadedModel.traverse((child) => {
      if (child.isMesh) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => {
            mat.map = loadedTextures[0]; 
            mat.needsUpdate = true;
          });
        } else {
          child.material.map = loadedTextures[0];
          child.material.needsUpdate = true;
        }
      }
    });
  };

  const aplicarMaterialPorDefecto = (loadedModel) => {
    loadedModel.traverse((child) => {
      if (child.isMesh) {
        child.material = new MeshBasicMaterial({ color: 0xff0000 });
        child.material.needsUpdate = true;
      }
    });
  };

  if (!model) {
    return <mesh><boxGeometry /><meshBasicMaterial color="red" /></mesh>;
  }

  return <primitive object={model} position={position} rotation={rotation} scale={scale} />;
}