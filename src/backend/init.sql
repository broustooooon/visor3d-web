-- Crear tabla de escenarios
CREATE TABLE IF NOT EXISTS Escenario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    miniatura BYTEA -- Imagen en miniatura almacenada como binario
);

-- Crear tabla de modelos 3D
CREATE TABLE IF NOT EXISTS Modelo3d (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    miniatura BYTEA, -- Imagen en miniatura
    modelo BYTEA,    -- Archivo .fbx del modelo 3D
    id_escenario INT,
    FOREIGN KEY (id_escenario) REFERENCES Escenario(id) ON DELETE CASCADE
);

-- Crear tabla de texturas
CREATE TABLE IF NOT EXISTS Textura (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    textura BYTEA, -- Archivo de textura almacenado en binario
    id_modelo3d INT,
    FOREIGN KEY (id_modelo3d) REFERENCES Modelo3d(id) ON DELETE CASCADE
);

/*
INSERT INTO escenario (nombre, descripcion, miniatura)
VALUES (
    'Escenario Prueba',
    'Este es un escenario de prueba para el visor 3D',
    NULL
)
RETURNING id;

INSERT INTO modelo3d (nombre, descripcion, miniatura, modelo, id_escenario)
VALUES (
    'Modelo Casa',
    'Modelo 3D que representa una casa básica',
    NULL,
    pg_read_binary_file('/docker_shared/casa.fbx'),
    (SELECT id FROM escenario WHERE nombre = 'Escenario Prueba' LIMIT 1)
)
RETURNING id;

INSERT INTO textura (nombre, textura, id_modelo3d)
VALUES (
    'Textura Casa',
    pg_read_binary_file('/docker_shared/casa.png'),
    (SELECT id FROM modelo3d WHERE nombre = 'Modelo Casa' LIMIT 1)
);

*/


/*Registros de ejemplo finales*/
/*
INSERT INTO escenario (nombre, descripcion, miniatura)
VALUES
(
    'Campo',
    'Escenario de un campo de futbol.',
    pg_read_binary_file('/docker_shared/campo.jpg')
), 
(
    'Catedral',
    'Escenario con arquitectura e interior.',
    pg_read_binary_file('/docker_shared/catedral.jpg')
),
(
    'Clase',
    'Escenario de una clase.',
    pg_read_binary_file('/docker_shared/clase.jpg')
),
(
    'Cocina',
    'Escenario de una cocina.',
    pg_read_binary_file('/docker_shared/cocina.jpg')
),
(
    'Parque',
    'Escenario con zonas verdes y áreas de descanso.',
    pg_read_binary_file('/docker_shared/parque.jpg')
),
(
    'Catedral',
    'Escenario con arquitectura e interior.',
    pg_read_binary_file('/docker_shared/catedral.jpg')
),
(
    'Clase',
    'Escenario de una clase.',
    pg_read_binary_file('/docker_shared/clase.jpg')
),
(
    'Cocina',
    'Escenario de una cocina.',
    pg_read_binary_file('/docker_shared/cocina.jpg')
),
(
    'Parque',
    'Escenario con zonas verdes y áreas de descanso.',
    pg_read_binary_file('/docker_shared/parque.jpg')
),
(
    'Campo',
    'Escenario de un campo de futbol.',
    pg_read_binary_file('/docker_shared/campo.jpg')
);

INSERT INTO modelo3d (nombre, descripcion, miniatura, modelo, id_escenario)
VALUES (
    'Modelo Casa',
    'Modelo 3D que representa una casa básica',
    pg_read_binary_file('/docker_shared/casa_miniatura.png'),
    pg_read_binary_file('/docker_shared/casa.fbx'),
    (SELECT id FROM escenario WHERE id = x LIMIT 1)
)
RETURNING id;

INSERT INTO textura (nombre, textura, id_modelo3d)
VALUES (
    'Textura Casa',
    pg_read_binary_file('/docker_shared/casa.png'),
    (SELECT id FROM modelo3d WHERE id = x LIMIT 1)
);


INSERT INTO modelo3d (nombre, descripcion, miniatura, modelo, id_escenario)
VALUES (
    'Modelo Torre',
    'Modelo 3D que representa una torre de madera',
    pg_read_binary_file('/docker_shared/torre_miniatura.png'),
    pg_read_binary_file('/docker_shared/torre.fbx'),
    (SELECT id FROM escenario WHERE id = x LIMIT 1)
)
RETURNING id;

INSERT INTO textura (nombre, textura, id_modelo3d)
VALUES (
    'Textura Torre de madera',
    pg_read_binary_file('/docker_shared/torre.jpg'),
    (SELECT id FROM modelo3d WHERE id = x LIMIT 1)
);
*/