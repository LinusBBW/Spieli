# Node.js-Image
FROM node:18-alpine
# Arbeitsverzeichnis im Container
WORKDIR /app
# Zuerst die package-Dateien, um  die Abhängigkeiten zu installieren
COPY package*.json ./
RUN npm install
# Rest kopieren
COPY . .
# Vite verwendet standardmässig Port 5173, diesen freigeben
EXPOSE 5173
# Starte Vite-Server. Das "--host" sorgt dafür dass der Server auf allen interfaces zuhört
CMD ["npx", "vite", "--host"]
