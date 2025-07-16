FROM node:21.7.2-slim AS build

WORKDIR /opt/application

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:1.25.4

COPY --from=build /opt/application/dist /usr/share/nginx/html

EXPOSE 80