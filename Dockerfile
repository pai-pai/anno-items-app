FROM node:alpine as build-stage

LABEL Name="Anno 1800 Items Vue App" Version=1.0.0
LABEL org.opencontainers.image.source = "https://github.com/pai-pai/anno-items-app"

ENV VUE_API_URL=http://localhost:1337

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

#COPY ./init.sh /init.sh
#RUN chmod +x /init.sh
#ENTRYPOINT ["/init.sh"]

CMD ["nginx", "-g", "daemon off;"]