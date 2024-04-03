# Pono technical test

## Description

This project is documented in Notion, you can access it [here](https://slashome.notion.site/Test-Pono-d3592d71e69c4ce9b9800999e91cb3e2).

## Installation

- Clone project
- Rename `.env.model` to `.env`
- Run `docker run -d --name pono-test-db -p 5432:5432 -e POSTGRES_PASSWORD=pass -e POSTGRES_USER=user postgres` to start a postgres database in docker
- Run `npm install`
- Run `npx prisma migrate dev --name init`
- Run `npm run serve`

## Endpoint tests

- Install [Bruno](https://www.usebruno.com/)
- Import Bruno folder located in `/resources/bruno`
- Select `Dev` environment
- Test

