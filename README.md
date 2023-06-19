# Chamador T3 Stack + WebSockets

## Development:
- npm install
- cp .env.example .env
- Set the DB Credentials on .env DATABASE_URL
- Set the WSS Port on .env WSS_PORT
- npx prisma db push
- npx prisma db seed
- npm run dev

## Production with Docker:
- cp .env.example .env
- Set the database address and credentials on .env
- Set NODE_ENV="production" on .env
- cp docker-compose.yml.example docker-compose.yml
- Set the WSS Port on .env.
- Map the desired Application Port and WSS Port on docker-compose.yml
- The WSS env and mapped port's should be the same, since we use it on the client side.
- docker compose up

## Production without Docker:
- npm install
- cp .env.example .env
- Set the DB Credentials on .env DATABASE_URL
- Set the WSS Port on .env WSS_PORT
- Set NODE_ENV="production" on .env
- Set the application's Port at the package.json "prod" script
- npx prisma db push
- npx prisma db seed
- npm run build
- npm run prod
