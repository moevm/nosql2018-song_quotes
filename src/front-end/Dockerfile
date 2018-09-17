FROM node:8.11.4-slim

WORKDIR /opt/front-end

ADD [".", "/opt/front-end"]

RUN npm install 

EXPOSE 80

CMD ["node", "app.js"]
