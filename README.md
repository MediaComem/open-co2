![Open Database and API for CO₂ equivalencies](./cover.png)

An open Data Database and API for CO₂ Equivalent Values.

> **This Database for CO₂ Equivalent Values is made available under the Open Database License: <http://opendatacommons.org/licenses/odbl/1.0/>. Any rights in individual contents of the database are licensed under the Database Contents License: <http://opendatacommons.org/licenses/dbcl/1.0/>**

**Open CO2** project enables companies to estimate their CO2 footprint through an open DB and API which can be used with their accounting tool. Although most of the data are independent of the location, the database is targeted to be used by companies operating in **Switzerland**. In particular energy information are based on swiss electricity providers and swiss energy mix, public transports on swiss public transport providers.

[Project reference on Aramis DB](https://www.aramis.admin.ch/Grunddaten/?ProjectID=50417)

Project funded by [Innosuisse](https://www.innosuisse.ch).

---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [First-time setup](#first-time-setup)
- [Test the API](#test-the-api)
  - [GraphQL API (Recommended)](#graphql-api-recommended)
  - [REST API](#rest-api)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Project structure](#project-structure)
- [Contribution guidelines](#contribution-guidelines)
- [Stack](#stack)
- [Seeder](#seeder)
  - [API](#api)
  - [Development](#development)
- [License](#license)
- [Co2 Data](#co2-data)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

---

## First-time setup

- Clone this repository:
  `git clone git@github.com:MediaComem/open-co2.git`

- Configure `config` files in _/server/app/config_, _/server/seeder/config_ (see [Configuration section](#configuration) for more details)

- Move to server directory:
  `cd open-co2/server`

- Run stack using docker-compose:
  `docker-compose up --build -d`

See [Co2 Data](#co2-data) in case you want to update the input data.

## Test the API

The GraphQl documentation is available directly through the GraphQL endpoint and the schema can be browsed using any GraphQL client.
The [Open API documentation for the REST API](./server/app/swagger.json) is available and can be visualised using [Swagger editor](https://editor.swagger.io)

You have 2 main options to consume the API:

### GraphQL API (Recommended)

- Use Apollo Stuido sandbox. Open your browser to <https://studio.apollographql.com/sandbox/explorer>
- Use GraphQL playground. Open your browser to <http://localhost:4200/>

### REST API

- Use Postman by importing the [Open API documentation](./server/app/swagger.json)

## Configuration

Project use [Node-config](https://github.com/node-config/node-config#readme) to loads environment variables.

Default configuration is store in `default.json` JSON file in those different directories:

- /server/app
- /server/seeder

Create similar `local.json` files if you need specific local configuration.

To secure your production configuration, you can follow instructions at [Node-config - Securing Production Config Files](https://github.com/node-config/node-config/wiki/Securing-Production-Config-Files)

## Deployment

An example [docker-compose file](./server/docker-compose.yml) is available to seed the database with input CO2 data and deploy locally the API for development purpose.

---

## Project structure

Source code is mostly located in `server`.
The `client-examples` directory only provides some applications to consume the API as examples.

The `server` directory is splitted in two main parts:

- `app` is where the Express/GraphQL core server is living
- `seeder` is compose of modules to process the data source and populate the database

## Contribution guidelines

- Use [Conventional Commits](https://www.conventionalcommits.org/) guidelines for your commits
- Run `npm run release` to update [software version](https://semver.org/) and generate changelog from commits
- To contribute to adding or updating data, the [tabular source file](/server/seeder/data/input/Open%20CO2.xlsx) must follow some simple rules:
  - Respect a tree structure with a dedicated line for each branch
  - The root entry (Level 1) in each sheets must be unique

---

## Stack

## Seeder

 The seeder script takes care of parsing the different categories and values to:

- generate the data graph (list of parent and children categories).
- compute average values and statistics from children categories.

Most business data logic is contained inside this step and the test coverage of this script should be extended if modified.

[![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

The seeder is a **NodeJS** script that populates a **MongoDB** database with CO2 data from an excel input file.

### API

The API is a simple interface on top of MongoDB documents. Almost no logic is performed by the API.

[![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
[![GraphQL](https://img.shields.io/badge/-GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)](https://graphql.org/)
[![Apollo-GraphQL](https://img.shields.io/badge/-ApolloGraphQL-311C87?style=for-the-badge&logo=apollo-graphql)](https://www.apollographql.com/)
[![Sofa](https://img.shields.io/badge/sofa-api.svg?style=for-the-badge&logo=sofa&color=%23E535AB)](https://www.sofa-api.com)

The Co2 data are stored in a **mongoDB** database. The API run on a **NodeJS** server based on **expressJS**.
The API is primarily defined as a **GraphQL** API.
The GraphQL API is served thanks to **Apollo GraphQL** middleware that creates the routes from the GraphQL schema.
The **Sofa API** library is used to generate automatically the REST Open API documentation and server the API as REST based on the GraphQL schema.

### Development

[![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://docker.io/)

In development you can use docker and the docker-compose provided to try the API. Jest is used as the test framework for unit tests.

## License

Data(base) is licensed under the [Open Database License](http://opendatacommons.org/licenses/odbl/1.0/)
Source code is licensed under the MIT License.

## Co2 Data

See [Method](method/README.md). **Please be aware that due to some assumptions and limitations, the data may not be suitable for decision making depending on your use case.**

In case you update the input data, do not forget to:

1. Update the excel file _seeder/data/input/Open CO2.xlsx_
1. Update the list of first level categories in _seeder/seed.js_ if needed
1. Run the seeder _cd server/seeder_ and _npm run start_
1. Drop the current mongo table _docker compose down -v_
1. Rebuild and repopulate data _docker compose up -d_
