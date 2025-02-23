# Test-task

**Badges** 
node version 18.17.1

## Installation

```
$ npm install
```
## public directory
create public folder in root directory

## For JWT tokens
1. openssl genrsa -out private.pem 2048
2. openssl rsa -in private.pem -outform PEM -pubout -out public.pem
3. openssl genpkey -algorithm RSA -out refresh_private.pem -pkeyopt rsa_keygen_bits:2048
4. openssl rsa -pubout -in refresh_private.pem -out refresh_public.pem

## Project configs
create .env file and add keys like in .env.example

## Migrations
npm run migration:run

## How start project
1. npm run dev

