FROM node:14

COPY ["package.json", "package-lock.json", "/app/frontend/"]

WORKDIR /app

ENV REACT_APP_REST=/api

RUN npm install

COPY [".", "/app/frontend/"]

RUN npm i -g serve

RUN npm run build

EXPOSE 5000

CMD ["serve", "-s", "build"]