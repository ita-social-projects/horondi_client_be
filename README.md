# Horondi
Backend API for the `Horondi` online store
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
      (like `{model-name}.service.js` or `{model-name}.resolver.js`)
    - For each model we define class like `{ModelName}Service`
      in `{model-name}.service.js` and have separate methods for handling different types of operations
- Configuration
    - All configuration is implemented via environment variable that is located inside
      `.env` file
- Testing
    - Tests are implemented in the format of contract tests. We test actual Graphql operations like queries, mutations, or subscriptions on the running application.
      For testing, we should use a database that is running as a container locally.
      We should have a folder per entity with tests.
    - Test files:
       - {entityName}.queries.test.js - Testing the queries (if it exists)
       - {entityName}.mutations.test.js - Testing the mutations (if it exists)
       - {entityName}.subscriptions.test.js - Testing the subscriptions (if it exists)

    - Testing guides:
       1) All fields in data from the response from the backend should be checked for the appropriate value.
       2) If you cannot test some field for some particular value you should at least check its existence and its type.
       3) We should test the validation of the provided data to ensure that the backend performs validation by sending different combinations of valid and invalid data.
       4) Group tests for each operation (query, mutation, or subscription) to describe the statement.
          Content (base scenario, for some operations we can have additional scenarios):
            - describe(‘Validation’) with tests that validate a particular operation with combinations of valid and invalid data.
            - describe(‘Success business logic’) with tests that perform operations with valid data and ensures that valid flows work
       5) Tests should be executed before any commit and don’t allow to push code if tests are failing.
       6) We need to develop utility functions that we can reuse in many tests files for creating user and base authentication (obtaining JWT token) for future performing operations that require authorization
    - Libraries
       - jest - testing framework
       - apollo-boost - client for performing Graphql operations

- Runtime work
    - Locally application is running in docker container. We have two docker
      containers: `api` container and `database` container.

## Running application
In the project directory, you should run
- Copy content of `.env.example` file to the newly created `.env`
- Run `docker-compose up --build` to build all services

   

