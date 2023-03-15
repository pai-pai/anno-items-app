FROM node:alpine as build-stage

LABEL Name="Anno 1800 Items Vue App" Version=1.0.0
LABEL org.opencontainers.image.source = "https://github.com/pai-pai/anno-items-app"

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]