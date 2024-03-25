# CS253 Project

## Utilizing React for Client Side Rendering and Node.js for API Integration

To begin, clone the Git repository. Ensure Git is installed before proceeding.
 `git clone https://github.com/Python-Pi/CS253-CSR.git`


## Setting Up React Front-end server 

Navigate to the client directory.
`cd /client `

Install required Node.js modules.
`npm i`

Initiate the server.
`npm start`

 Upon successful installation of all necessary modules, create a `.env` file within the client directory. Add the following line:
 `REACT_APP_IP = '{IP ADDRESS OF YOUR MACHINE}'`.

## Setting Up PostgreSQL Database

Install PostgreSQL and setup username and password

Create a database named `cs253`.

Execute all the query commands in `query.sql` 

## Running Node Back-end server

Navigate to the server directory.
 `cd /server `

Install required Node.js modules.
 `npm i`

Initiate the server.
 `npm start`

Upon successful installation of all necessary modules, create a `.env` file within the client directory. Add the following lines:

`PG_HOST = 'localhost'`

`PG_USER = '{PostgreSQL Username}'`

`PG_PASSWORD = '{PostgreSQL Password}'`

`PG_PORT = '5432'`

`SESSION_SECRET = '{Any sufficiently random string}'`

`PG_DATABASE = 'cs253'`

`IP = '{YOUR IP ADDRESS}'`

`PORT = '3000'`

`EMAIL_ID = 'siriussnape880@gmail.com'`

`EMAIL_PASSWORD = 'snij qpys ijhw boeo'`

## Hosting

The above application is hosted in the following url:
`https://cs-253-csr.vercel.app/`

## Note

- The default command for running Node server is set to `nodemon server.js` in `package.json`. If you don't have nodemon installed, change it to `node server.js`.
