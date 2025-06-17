#!/bin/sh

echo "Waiting for database..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "Database is ready!"

echo "Running migrations..."
npx prisma migrate deploy

echo "Starting application..."
exec npm run start:dev
