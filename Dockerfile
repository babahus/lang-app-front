FROM node:latest as node

WORKDIR /app

COPY . .
RUN npm install

RUN npm run build --prod

FROM nginx:alpine as lang-app_nginx

COPY --from=node /app/dist/lang-app-front /usr/share/nginx/html

COPY nginx/nginx.conf  /etc/nginx/conf.d/default.conf
