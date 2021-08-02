<a href="https://softserve.academy/"><img src="https://github.com/ita-social-projects/horondi_client_fe/blob/master/public/photo_2020-09-08_17-16-47.jpg" title="SoftServe IT Academy" alt="SoftServe IT Academy"></a>

# Horondi project

HORONDI project is an e-commerce online shop that provides hand-made backpacks, bags, purses and other accessories.

[![GitHub issues](https://img.shields.io/github/issues/ita-social-projects/horondi_client_be)](https://github.com/ita-social-projects/horondi_client_be/issues)
[![Pending Pull-Requests](https://img.shields.io/github/issues-pr/ita-social-projects/horondi_client_be?style=flat-square)](https://github.com/ita-social-projects/Horondi_client_be/pulls)
[![GitHub stars](https://img.shields.io/github/stars/ita-social-projects/horondi_client_be)](https://github.com/ita-social-projects/horondi_client_be/stargazers)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ita-social-projects-horondi-client-be&metric=alert_status)](https://sonarcloud.io/dashboard?id=ita-social-projects-horondi-client-be)
[![Build Status](https://dev.azure.com/ProjectApproach/HorondiProject/_apis/build/status/ita-social-projects.horondi_client_be?branchName=development&jobName=BuildandDeploy)](https://dev.azure.com/ProjectApproach/HorondiProject/_build/latest?definitionId=25&branchName=development)
[![GitHub license](https://img.shields.io/github/license/ita-social-projects/horondi_client_be)](https://github.com/ita-social-projects/horondi_client_be/blob/master/LICENSE)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ita-social-projects-horondi-client-be&metric=coverage)](https://sonarcloud.io/dashboard?id=ita-social-projects-horondi-client-be)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/horondi/horondi_client_be)
[![Build Status](https://dev.azure.com/ProjectApproach/HorondiProject/_apis/build/status/Backend%20CI%20production?branchName=master)](https://dev.azure.com/ProjectApproach/HorondiProject/_build/latest?definitionId=10&branchName=master)

---

- [Installation](#installation)
  - [Required to install](#Required-to-install)
  - [Environment](https://github.com/ita-social-projects/horondi_client_be/blob/master/environment.variables.md)
  - [Clone](#Clone)
  - [Setup](#Setup)
  - [How to run local](#How-to-run-local)
  - [How to run Docker](#How-to-run-Docker)
- [Usage](#Usage)
  - [How to run tests](#How-to-run-tests)
- [Documentation](#Documentation)
  - [Rules and guidelines](#Rules-and-guidelines)
  - [Testing](#Testing)
  - [Generator](#Generator)
- [Project deploy](#project-deploy)
- [Contributing](#contributing)
  - [git flow](#git-flow)
  - [issue flow](#git-flow)
- [FAQ](#faq)
- [Support](#support)
- [License](#license)

---

## Installation

### Required to install

- NodeJS (14.15.4)

### Clone

- Clone this repo to your local machine using `https://github.com/ita-social-projects/horondi_client_be.git`

### Setup

> install npm packages

```shell
$ npm install
```

### How to run local

1. Open terminal.
2. Run `npm run start` to start application.<sup>[\*](#footnote)</sup>
3. Open http://localhost:5000/graphql to view it in the browser.

###### <a name="footnote">\*</a> - to run the project you need an `.env` file in root folder

### How to run Docker

download and install [Docker Desktop](https://www.docker.com/products/docker-desktop)

open terminal and run `npm run docker-db-start`

next launch `Docker Desktop` and ensure your container is there and it is running

now you can use docker

command `npm run test-server` - will connect to test server

command `npm run test-docker` - will run docker and tests

## Usage

### How to run tests

To run unit test run Docker Desktop
then open terminal and run `npm run test` in it.

---

## Documentation

### Rules and guidelines

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
    1.  All fields in data from the response from the backend should be checked for the appropriate value.
    2.  If you cannot test some field for some particular value you should at least check its existence and its type.
    3.  We should test the validation of the provided data to ensure that the backend performs validation by sending different combinations of valid and invalid data.
    4.  Group tests for each operation (query, mutation, or subscription) to describe the statement.
        Content (base scenario, for some operations we can have additional scenarios):
        - describe(‘Validation’) with tests that validate a particular operation with combinations of valid and invalid data.
        - describe(‘Success business logic’) with tests that perform operations with valid data and ensures that valid flows work
    5.  Tests should be executed before any commit and don’t allow to push code if tests are failing.
    6.  We need to develop utility functions that we can reuse in many tests files for creating user and base authentication (obtaining JWT token) for future performing operations that require authorization
  - Libraries
    - jest - testing framework
    - apollo-boost - client for performing Graphql operations

- Runtime work
  - Locally application is running in docker container. We have two docker
    containers: `api` container and `database` container.

### Testing

### Generator

Command `npm run generate` is used to run [graphql code generator](https://graphql-code-generator.com)

1. before using codegen you must run backend server [horondi backend](https://github.com/ita-social-projects/horondi_client_be)

2. open terminal

3. run `npm run generate`

4. you should run `npm run generate` every time new unions or interfaces are created

---

## Project Deploy

#### Deploy Сlient part: https://horondi-front.azurewebsites.net/

#### Deploy Admin Part: https://horondi-admin.azurewebsites.net/

---

## Contributing

You're encouraged to contribute to our project if you've found any issues or missing functionality that you would want to see. Here you can see [the list of issues](https://github.com/ita-social-projects/horondi_client_be/issues) and here you can create [a new issue](https://github.com/ita-social-projects/horondi_client_be/issues/new/choose).

Before sending any pull request, please discuss requirements/changes to be implemented using an existing issue or by creating a new one. All pull requests should be done into `development` branch.

There are three GitHub projects: [horondi_client_fe](https://github.com/ita-social-projects/horondi_client_fe) for frontend part, [horondi_client_be](https://github.com/ita-social-projects/horondi_client_be) for backend part and [horondi_admin](https://github.com/ita-social-projects/horondi_admin). Every project has it's own issues.

Every pull request should be linked to an issue. So if you make changes on frontend, backend or admin parts you should create an issue with a link to corresponding requirement (story, task or epic).

All Pull Requests should start from prefix _#xxx-yyy_ where _xxx_ - task number and and _yyy_ - short description
e.g. #020-createAdminPanel

---

### Git flow

We have **master** , **development** and **feature** branches.  
All **feature** branches must be merged into [development](https://github.com/ita-social-projects/horondi_client_be/tree/development) branch!!!
Only the release should merge into the main branch!!!

![Github flow](<https://wac-cdn.atlassian.com/dam/jcr:b5259cce-6245-49f2-b89b-9871f9ee3fa4/03%20(2).svg?cdnVersion=1312>)

#### Step 1

- **Option 1**

  - 👯 Clone this repo to your local machine using `https://github.com/ita-social-projects/horondi_client_be.git`

- **Option 2**

  - create new branch from development branch

#### Step 2

- add some commits to your new branch

#### Step 3

- 🔃 Create a new pull request using <a href="https://github.com/ita-social-projects/horondi_client_be/compare/" target="_blank">github.com/ita-social-projects/horondi_client_be</a>.

---

### Issue flow

#### Step 1

-go to [issues](https://github.com/ita-social-projects/horondi_client_be/issues) and click `New issue` button

#### Step 2

when creating [issue](https://github.com/ita-social-projects/horondi_client_be/issues/new/choose) you should add name of the issue, description, choose assignee, label, project. If issue is a `User Story` you should link it with corresponding tasks, and corresponding tasks should be linked to issue.

#### Step 3

if issue is in work it should be placed in proper column on dashboard according to its status.

---

## Teams

### Development team

[![@VolodymyrTrach](https://avatars2.githubusercontent.com/u/50409925?s=200&u=cc5eae94f38151d613308da12c0d8f1f84fb1777&v=4)](https://github.com/VolodymyrTrach)
[![@bandvov](https://avatars0.githubusercontent.com/u/48312647?s=200&u=0a8915fc55a44ac1e3ad34968dbe53291d1e4b24&v=4)](https://github.com/bandvov)
[![@YarkoSumyk](https://avatars3.githubusercontent.com/u/40059484?s=200&u=c1252af7060ce2e61f1836d8a7904d098c9519d3&v=4)](https://github.com/YarkoSumyk)
[![@INR4GE](https://avatars3.githubusercontent.com/u/29551153?s=200&u=64b5922801512d6a92a6005239996bc6a6f49400&v=4)](https://github.com/INR4GE)
[![@Crash1212](https://avatars0.githubusercontent.com/u/39312657?s=200&u=6f9768ca1cf96e2f1452913b769820120991ce02&v=4)](https://github.com/Crash1212)
[![@DmytroDidukh](https://avatars3.githubusercontent.com/u/58104677?s=200&u=b696b5884540fc5f5982d349c05479c6111a005e&v=4)](https://github.com/DmytroDidukh)
[![@yaroslavbilokin](https://avatars0.githubusercontent.com/u/48564795?s=200&u=79107facd1421eea6f679c156150d94ac68b5bc6&v=4)](https://github.com/yaroslavbilokin)
[![@ecl1pseo](https://avatars2.githubusercontent.com/u/61461298?s=200&u=653248954a1a15753a532577534bc015e0f52e54&v=4)](https://github.com/ecl1pseo)
[![@TarasKun](https://avatars2.githubusercontent.com/u/54079677?s=200&u=cbf23d4eb12d477cb10af74fe4515dbfa6aef5c8&v=4)](https://github.com/TarasKun)
[![@TorskyM](https://avatars1.githubusercontent.com/u/43883447?s=200&u=f24cc667e57cee7ff345051e6ae45b0052aa85b9&v=4)](https://github.com/TorskyM)
[![@maksym-strus](https://avatars1.githubusercontent.com/u/57955386?s=200&u=163523fa63d33371d3b79e9e51f7e03cf20f149b&v=4)](https://github.com/maksym-strus)
[![@nadiyafomenko](https://avatars2.githubusercontent.com/u/47325620?s=200&u=374a6f8f91c3e8557d1807b4677ef04bce51cee6&v=4)](https://github.com/nadiyafomenko)
[![@vasylshpak](https://avatars1.githubusercontent.com/u/31392756?s=200&u=91a1fa03ab4def211eede6f469e26e9801812c29&v=4)](https://github.com/vasylshpak)
[![@Iryna-Bzdyr](https://avatars1.githubusercontent.com/u/57641315?s=200&u=7d55e9b3cc8a73bd2ab4d1630a9860e409bbe73d&v=4)](https://github.com/Iryna-Bzdyr)
[![@moran711](https://avatars1.githubusercontent.com/u/59802190?s=200&u=c937032a63ae775da998e0fe3ce066c3cda24d6e&v=4)](https://github.com/moran711)
[![@VitalikVoicix](https://avatars0.githubusercontent.com/u/64539069?s=200&u=90288a9c4ce3bc30e1e7d2b4b8c7266b1d5a86b9&v=4)](https://github.com/VitalikVoicix)
[![@koropalov](https://avatars3.githubusercontent.com/u/38702341?s=200&u=0e0aeb60e06240c840dd0852eb1f035f7ff8c88f&v=4)](https://github.com/koropalov)
[![@dieie32](https://avatars0.githubusercontent.com/u/46137635?s=200&u=78cae47953349c5ca60e0add5dea36bd1b033efa&v=4)](https://github.com/dieie32)
[![@kapoliub](https://avatars1.githubusercontent.com/u/56438696?s=200&u=be8c7bba587c6df08accc16d42868293f3c3705b&v=4)](https://github.com/kapoliub)
[![@NikitaDenysenko](https://avatars0.githubusercontent.com/u/53399334?s=200&u=66fced143733258460a0058d26ccc83a1b3fa174&v=4)](https://github.com/NikitaDenysenko)
[![@ivan-bonk](https://avatars3.githubusercontent.com/u/44017234?s=200&u=4540d5aba6e388992ca06b9224ed0e0a35f94b1c&v=4)](https://github.com/ivan-bonk)
[![@Kiyooooko](https://avatars.githubusercontent.com/u/68334137?s=200&u=1733556a0317cf4326376e429f278c29b1a27602&v=4)](https://github.com/Kiyooooko)
[![@M1ndForce](https://avatars.githubusercontent.com/u/66359796?s=200&u=323af6a850ed6821968978d2cfd637c23f8e9bf9&v=4)](https://github.com/M1ndForce)
[![@AndriyLymych](https://avatars.githubusercontent.com/u/48614659?s=200&u=2570ac9922e671d796fd4163b0d3340119df528e&v=4)](https://github.com/AndriyLymych)
[![@jul4ajka](https://avatars.githubusercontent.com/u/19712929?s=200&u=a77ab7d0d6213212ae25560ecb9d19bb8af9a003&v=4)](https://github.com/jul4ajka)
[![@MMashivskij](https://avatars.githubusercontent.com/u/54583764?s=200&u=dc606bf0c27c3f9f5133a12db5534c9d948b470e&v=4)](https://github.com/MMashivskij)
[![@Haytham1337](https://avatars.githubusercontent.com/u/36926670?s=200&u=230bf6465c39383069786fdfb1ac1fe27185aecb&v=4)](https://github.com/Haytham1337)
[![@RevylaV](https://avatars.githubusercontent.com/u/51852361?s=200&u=99815076ec15cb804b541d5c1b336ae28d53061d&v=4)](https://github.com/RevylaV)
[![@dmytro07](https://avatars.githubusercontent.com/u/62848596?s=200)](https://github.com/dmytro07)
[![@yuliiakucher](https://avatars.githubusercontent.com/u/61886864?s=200)](https://github.com/yuliiakucher)
[![@fulljsdev](https://avatars.githubusercontent.com/u/77093538?s=200)](https://github.com/fulljsdev)
[![@IlyaBelik](https://avatars.githubusercontent.com/u/37375602?s=200)](https://github.com/IlyaBelik)
[![@grebiniuk](https://avatars.githubusercontent.com/u/32039216?s=200)](https://github.com/grebiniuk)
[![@AnastasiiaKolodiazhna](https://avatars.githubusercontent.com/u/47612654?s=200)](https://github.com/AnastasiiaKolodiazhna)
[![@twihell](https://avatars.githubusercontent.com/u/14165251?s=200)](https://github.com/twihell)
[![@100vbaSasha](https://avatars.githubusercontent.com/u/55619101?s=200)](https://github.com/100vbaSasha)
[![@Walleriy](https://avatars.githubusercontent.com/u/39501370?s=200)](https://github.com/Walleriy)
[![@AndronShermeta](https://avatars.githubusercontent.com/u/73708298?s=200)](https://github.com/AndronShermeta)
[![@khrystynaDm1307](https://avatars.githubusercontent.com/u/53223985?s=200)](https://github.com/khrystynaDm1307)
[![@YuriiDubnytskyi](https://avatars.githubusercontent.com/u/41127730?s=200)](https://github.com/YuriiDubnytskyi)
[![@Renfort](https://avatars.githubusercontent.com/u/60984686?s=200)](https://github.com/Renfort)
[![@sergklukvin](https://avatars.githubusercontent.com/u/76059218?s=200)](https://github.com/sergklukvin)
[![@mvmoshchovskyi](https://avatars.githubusercontent.com/u/48692693?s=200)](https://github.com/mvmoshchovskyi)
[![@Vlodkojr](https://avatars.githubusercontent.com/u/45718327?s=200&u=4540d5aba6e388992ca06b9224ed0e0a35f94b1c&v=4)](https://github.com/Vlodkojr)
[![@Elugormo](https://avatars.githubusercontent.com/u/53963530?s=200&u=4540d5aba6e388992ca06b9224ed0e0a35f94b1c&v=4)](https://github.com/Elugormo)
[![@Mabonik](https://avatars.githubusercontent.com/u/61788391?s=200&u=4540d5aba6e388992ca06b9224ed0e0a35f94b1c&v=4)](https://github.com/Mabonik)
[![@NetkachovaAnastasiya](https://avatars.githubusercontent.com/u/60103758?s=200&u=181e62bf4f25b07122f06ce677e73ddd34021391&v=4)](https://github.com/NetkachovaAnastasiya)
[![@Serhii-Ahafonov](https://avatars.githubusercontent.com/u/61708033?s=200&u=4540d5aba6e388992ca06b9224ed0e0a35f94b1c&v=4)](https://github.com/Serhii-Ahafonov)
[![@Palidovych](https://avatars.githubusercontent.com/u/54260733?s=200&u=4540d5aba6e388992ca06b9224ed0e0a35f94b1c&v=4)](https://github.com/Palidovych)

### Quality control team
[![@HrytsykOlya](https://avatars1.githubusercontent.com/u/65678737?s=200&u=181e62bf4f25b07122f06ce677e73ddd34021391&v=4)](https://github.com/HrytsykOlya)
[![@LiliiK](https://avatars.githubusercontent.com/u/65678768?s=200&u=2c968beb250d7b155441ab05d28e0a7be616606b&v=4)](https://github.com/LiliiK)
[![@IrynaVakhula](https://avatars.githubusercontent.com/u/65680712?s=200&u=d0785408325af9d2c9d8dcb9a18e71c11fa005a8&v=4)](https://github.com/IrynaVakhula)
[![@MartaZyhmund](https://avatars.githubusercontent.com/u/65674403?s=200&u=ff0b2c38b52b422ac58138ad9f38f2b81b7d8957&v=4)](https://github.com/MartaZyhmund)
[![@asIgnat](https://avatars.githubusercontent.com/u/62054774?s=200&u=285aa0df8435a6ec16edb6ba26b4718d82693bf9&v=4)](https://github.com/asIgnat)
[![@rrarock](https://avatars.githubusercontent.com/u/84689435?s=200&u=285aa0df8435a6ec16edb6ba26b4718d82693bf9&v=4)](https://github.com/rrarock)
[![@olesmack](https://avatars.githubusercontent.com/u/84582793?s=200&u=285aa0df8435a6ec16edb6ba26b4718d82693bf9&v=4)](https://github.com/olesmack)
[![@NataliaAndriiets](https://avatars.githubusercontent.com/u/84592689?s=200&u=285aa0df8435a6ec16edb6ba26b4718d82693bf9&v=4)](https://github.com/NataliaAndriiets)
[![@xfightr](https://avatars.githubusercontent.com/u/85612818?s=200&u=285aa0df8435a6ec16edb6ba26b4718d82693bf9&v=4)](https://github.com/xfightr)

### ISTQB team

[![@olya011](https://avatars3.githubusercontent.com/u/49495443?s=200&u=285aa0df8435a6ec16edb6ba26b4718d82693bf9&v=4)](https://github.com/olya011)
[![@Vika-Bodnar](https://avatars2.githubusercontent.com/u/71330682?s=200&u=6c3b98868d6197bd41e3182c24c477343d355e04&v=4)](https://github.com/Vika-Bodnar)
[![@chelochev](https://avatars0.githubusercontent.com/u/66883720?s=200&u=7eec35db41587211874a2bfe962cbb6ca4e8e99a&v=4)](https://github.com/chelochev)
[![@Mary-Red](https://avatars0.githubusercontent.com/u/55394709?s=200&u=bcb5ad20d943f981a5a0d8ed09fb33bb9e878fc3&v=4)](https://github.com/Mary-Red)
[![@GalyaGirnyak](https://avatars.githubusercontent.com/u/75363667?s=200&u=5602aefda507989d28b8bfba247dd05a8a81431b&v=4)](https://github.com/GalyaGirnyak)
[![@kirkchernyshkov](https://avatars.githubusercontent.com/u/75264827?s=200&u=ba90664860143e53146be7f6956483d9b883618f&v=4)](https://github.com/kirkchernyshkov)
[![@runner-on-waves](https://avatars.githubusercontent.com/u/75261055?s=200&u=d2b87ed36b47dcc16b934cf0ad2aab1327155fb8&v=4)](https://github.com/runner-on-waves)
[Serhii Datsiuk](https://github.com/SerhiiDatsiuk)
[![@MariyaRashkevych](https://avatars.githubusercontent.com/u/6838192?s=200)](https://github.com/MariyaRashkevych)
[![@MarianaZemba](https://avatars.githubusercontent.com/u/79637539?s=200)](https://github.com/MarianaZemba)
[![@anastas184](https://avatars.githubusercontent.com/u/61836366?s=200)](https://github.com/anastas184)
[![@OleksiySverdlov](https://avatars.githubusercontent.com/u/77245713?s=200)](https://github.com/OleksiySverdlov)
[![@MariiaHnatiuk](https://avatars.githubusercontent.com/u/80684837?s=200)](https://github.com/MariiaHnatiuk)
[![@Nikcoll-in](https://avatars.githubusercontent.com/u/80674462?s=200)](https://github.com/Nikcoll-in)
[![@Evgeniya-Volkova](https://avatars.githubusercontent.com/u/76967400?s=200)](https://github.com/Evgeniya-Volkova)
[![@nadiya17](https://avatars.githubusercontent.com/u/47214428?s=200)](https://github.com/nadiya17)
[YevgeniiSt](https://github.com/YevgeniiSt)


### Database team

[![@YukiAmeka](https://avatars2.githubusercontent.com/u/42378468?s=200&u=c749e6713546c371b801786ecdd678dd1d152f42&v=4)](https://github.com/YukiAmeka)
[![@yaremich](https://avatars.githubusercontent.com/u/58247822?s=200&u=db2f3b6459c080079c5c5e4b52da61cd18b4e223&v=4)](https://github.com/yaremich)
[![@Meamzy](https://avatars.githubusercontent.com/u/48360177?s=200&u=db2f3b6459c080079c5c5e4b52da61cd18b4e223&v=4)](https://github.com/Meamzy)

### DevOps team

[![@SofiaDemyanovska](https://avatars1.githubusercontent.com/u/48492789?s=200&u=cb0520a8498667594ded0db8e29cdd3ec5529578&v=4)](https://github.com/SofiaDemyanovska)
[![@ikoblyk](https://avatars3.githubusercontent.com/u/45568834?s=200&u=5d8790e8e58a7966e2d6d6bc6a4f0d15c8cb2e9c&v=4)](https://github.com/IKoblyk)
[![@vitaliy-pavlyshyn](https://avatars0.githubusercontent.com/u/24523962?s=200&u=db2f3b6459c080079c5c5e4b52da61cd18b4e223&v=4)](https://github.com/vitaliy-pavlyshyn)
[![@rholovchak](https://avatars.githubusercontent.com/u/68376355?s=200)](https://github.com/rholovchak)

### Designer team
[![@Nikadsgn](https://avatars.githubusercontent.com/u/87034205?s=200&u=4540d5aba6e388992ca06b9224ed0e0a35f94b1c&v=4)](https://github.com/Nikadsgn)
---

## FAQ

- **How do I do _specifically_ so and so?**
  - No problem! Just do this.

---

## Support

---

#### License

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
- Copyright 2020 © <a href="https://softserve.academy/" target="_blank"> SoftServe IT Academy</a>.

[MIT](https://choosealicense.com/licenses/mit/)

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)
