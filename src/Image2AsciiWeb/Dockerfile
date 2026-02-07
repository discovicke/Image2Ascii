FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/image2ascii-web /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
