FROM node:18-alpine

WORKDIR /app

COPY package.json /app
RUN npm install

COPY .env /app
COPY prisma /app/prisma
RUN npx prisma generate

COPY . /app
RUN npm run build

EXPOSE 3000
EXPOSE 3001

CMD [ "npm", "run", "prod" ]