# 1️⃣ Usamos una imagen oficial de Node.js
FROM node:18

# 2️⃣ Establecemos el directorio de trabajo
WORKDIR /app

# 3️⃣ Copiamos solo los archivos necesarios para instalar las dependencias
COPY package*.json ./

# 4️⃣ Instalamos las dependencias
RUN npm install --production

# 5️⃣ Copiamos todo el resto del proyecto
COPY . .

# 6️⃣ Exponemos el puerto 4000 para el backend
EXPOSE 4000

# 7️⃣ Establecemos las variables de entorno
ENV NODE_ENV=production

# 8️⃣ Iniciamos la aplicación
CMD ["node", "app.js"]
