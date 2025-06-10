# Home Library Service

Task1: https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/rest-service/assignment.md
Task2: https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/containerization-database-orm/assignment.md

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker desktop - [Download & Install Docker](https://www.docker.com/products/docker-desktop). Be sure to restart the computer.

## Downloading

```
git clone git@github.com:ArturKhelshtein/nodejs2025Q2-service.git
cd nodejs2025Q2-service
```

## Installing NPM modules

```
npm ci
```

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Running with docker

```
cp .env.example .env
/*dev-mode*/ docker-compose -f docker-compose.dev.yml up --build
/*prod-mode*/ docker-compose up --build
docker exec -it home-library-app npx prisma migrate deploy
docker exec -id home-library-app npx prisma generate

docker-compose down -v (удалить старые тома и пересоздать БД)
docker logs home-library-app --follow (посмотреть логи)
docker-compose down && docker-compose up --build (перезапуск)
```

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```
