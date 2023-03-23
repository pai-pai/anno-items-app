FROM node:alpine as build-stage

LABEL Name="Anno 1800 Items Vue App" Version=1.0.1
LABEL org.opencontainers.image.source = "https://github.com/pai-pai/anno-items-app"

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine as production-stage

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]