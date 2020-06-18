# Hondri
Backend API for the `Hondri` online store
## Rules and guidelines
- File naming
    - Files should be name in format `some-component.type.js`
- Architecture
    - Logic is separated in layers
        - resolver layer (handles graphql actions)
        - service layer (handles business logic, interactions with database)
        - model layer (mapping collections to mongoose models)
    - All business logic (any database operations or validation related to the business rules) and interaction with models is located inside service
    - Each model should live in its own folder
    - In each folder files should be named in format `{model-name}.{type}.js`
    - For each model we define class like `{ModelName}Service`
      in `{model-name}.service.js` and have separate methods for handling different types of operations
- Configuration
    - All configuration is implemented via environment variable that is located inside
      `.env` file
- Testing
    - Tests are implemented in `contract` format. We make request and test
      data and format of response from the running server.
    - Test should be run before any commit and should not allow to push code
      with failing tests
    - Tests should run via `npm run test` command
    - Testing for each set of endpoints is implemented in separate folder
- Runtime work
    - Locally application is running in docker container. We have two docker
      containers: `api` container and `database` container.

## Running application
In the project directory, you should run
- Copy content of `.env.example` file to the newly created `.env`
- Run `docker-compose up --build` to build all services

