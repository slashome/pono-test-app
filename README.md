# Pono technical test

## Installation

- Clone project
- Rename `.env.model` to `.env`
- Run `docker run -d --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=pass -e POSTGRES_USER=user postgres` to start a postgres database in docker
- Run `npm install`
- Run `npm run serve`

## Endpoint tests

- Install [Bruno](https://www.usebruno.com/)
- Import Bruno folder located in `/resources/bruno`
- Select `Dev` environment
- Test

