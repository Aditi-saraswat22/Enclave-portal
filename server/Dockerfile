FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

# Support conditional installation of devDependencies
ARG NODE_ENV=production
RUN if [ "$NODE_ENV" = "development" ]; then npm install; else npm install --only=production; fi

COPY . .

EXPOSE 8888

CMD ["node", "src/server.js"]