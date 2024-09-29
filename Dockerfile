FROM node:20 AS frontend

WORKDIR /app

COPY ./client/package.json ./package.json

RUN npm i

COPY ./client .

RUN npm run build

FROM node:20

WORKDIR /code

RUN apt-get update && apt-get install -y g++

COPY ./package.json ./package.json

RUN npm i

COPY --from=frontend /app/build ./client/build

COPY . .

EXPOSE 80

CMD ["node", "index"]
