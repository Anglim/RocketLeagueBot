# Common build stage
FROM node:16.14.2-alpine3.15 AS common-build-stage

# cd to directory inside container
WORKDIR /usr/src/app

# Copy dependency files
COPY package*.json ./

# Install dependecies
RUN npm ci

# Copy SRC code
COPY ./src ./src 
COPY tsconfig.json ./

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]

# Development build stage
# FROM common-build-stage as development-build-stage

# ENV NODE_ENV development

# CMD ["npm", "run", "dev"]

# Production build stage
# FROM common-build-stage as production-build-stage

# ENV NODE_ENV production

# CMD ["npm", "run", "start"]
