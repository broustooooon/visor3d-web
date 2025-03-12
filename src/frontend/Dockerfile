# Dockerfile para el frontend
FROM node:20

WORKDIR /app

# Copiar dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm install

# Copiar explícitamente el index.html
COPY ./public/index.html ./index.html

# Copiar el resto de los archivos del proyecto
COPY . .

# Construir el proyecto
RUN npm run build

EXPOSE 5173
CMD ["npm", "run", "dev"]
