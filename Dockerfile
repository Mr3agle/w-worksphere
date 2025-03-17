# Usa la imagen oficial de Node.js 20
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la app
COPY . .

# Realiza la construcción del proyecto (si es necesario)
RUN npm run build

# Expone el puerto para la app
EXPOSE 3000

# Comando para iniciar la app
CMD ["npm", "start"]
