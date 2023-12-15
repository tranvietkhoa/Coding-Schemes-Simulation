FROM node:16

WORKDIR /code

COPY ./package.json /code/package.json

RUN npm i

RUN apt-get update && apt-get install -y g++

COPY . /code

EXPOSE 80

CMD ["node", "index"]
