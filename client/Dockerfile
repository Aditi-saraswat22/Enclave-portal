# Base stage for shared dependencies
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Development stage (used in docker-compose)
FROM base AS development
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

# Build stage for production
FROM base AS build-stage
RUN npm run build

# Production server stage
FROM nginx:alpine AS production
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]