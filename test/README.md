# CS253-CSR Integration Testing
This repo contains the testing code for server side end points conducted using jest

## How to run the tests

- Clone this repository to your local machine
- Open a terminal window and navigate to the server directory
- Install all the node modules using`npm i`
- Configure the .env file as follows

`PG_HOST = 'host of your database'`

`PG_USER = 'user of your database'`

`PG_PASSWORD = 'password of your database'`

`PG_PORT = 'port of your database'`

`SESSION_SECRET = 'some random string'`

`PG_DATABASE = 'name of your postgres database'`

`IP = 'your ip address'`

`PORT = 'port in which front-end of your application is running'`

`EMAIL_ID = 'siriussnape880@gmail.com'`

`EMAIL_PASSWORD = 'snij qpys ijhw boeo'`

`IS_AUTHENTICATED = 'false'`

- Start running the tests using the command `npm test`
