FROM node:14

WORKDIR /app/frontend/

COPY ["package.json", "package-lock.json", "/app/frontend/"]

ENV REACT_APP_REST=http://localhost:5001/api/

RUN npm install
 
COPY [".", "/app/frontend/"]

EXPOSE 3000

#RUN CI= npm run build

CMD ["npm", "start"]

#CMD ["npm", "run", "build"]

