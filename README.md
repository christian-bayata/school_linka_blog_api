> A secure blog that that enables uers to create, retrieve, edit and delete posts

| PROJECT FEATURE                                  |       STATUS       |
| :----------------------------------------------- | :----------------: |
| Sign Up                                          | :white_check_mark: |
| Login                                            | :white_check_mark: |
| Password Reset                                   | :white_check_mark: |
| Role Based Authorization                         | :white_check_mark: |
| End User(s) Create Posts                         | :white_check_mark: |
| End User(s) Retrieve Single and All Posts        | :white_check_mark: |
| End User(s) Edit and Delete Posts                | :white_check_mark: |
| End User(s) View, Like, Comment on Post(s)       | :white_check_mark: |
| End User(s) Delete Likes and Comments on Post(s) | :white_check_mark: |
| Test Driven Development                          | :white_check_mark: |
| Test Coverage Reporting                          | :white_check_mark: |
| Monolithic Architecture                          | :white_check_mark: |

- :cop: Authentication via [JWT](https://jwt.io/)
- Routes mapping via [express-router](https://expressjs.com/en/guide/routing.html)
- Documented using [Swagger](https://swagger.io). Find link to docs [here](https://enterscale-survey.onrender.com/api-docs/)
- Background operations are run on [school-linka-blog-api](https://github.com/christian-bayata/school_linka_blog_api.git). This is a public repo and is easily accessible.
- Uses [Postgresql](https://www.postgresql.org/) as database. The reason for this is: speed and relational structure
- [Sequelize](https://sequelize.org) as object relational model
- Environments for `development`, `test`, and `staging`
- Unit and Integration tests running with [Jest](https://github.com/facebook/jest)
- Built with [npm scripts](#npm-scripts)

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Test coverage reports
<img width="1680" alt="Screenshot 2023-09-08 at 15 51 52" src="https://github.com/christian-bayata/school_linka_blog_api/assets/80787295/c9078bcb-2974-4c1e-ba09-2e5ac1d76f9c">

<img width="680" alt="Screenshot 2023-09-08 at 15 40 48" src="https://github.com/christian-bayata/school_linka_blog_api/assets/80787295/087df8eb-9573-4c6c-a32d-6ad0cca47ae1">

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
