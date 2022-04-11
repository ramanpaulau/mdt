The application was developed and tested on the following versions:
- postgresql: 14
- maven: 3.8.4
- npm: 6.14.8

Login:
- in the system login details are set for the Admin user
- Registration number: 0000, password: admin

Database settings:
- api\src\main\resources\application.properties - contains database connection settings for api

The application can be launched using Docker:
- installation instructions: https://docs.docker.com/compose/install/

The application can be run in the development environment:
- You must be running the postgres database server first
- command: pg_ctl for windows, psql for linux
- then in the api folder, use the mvn spring-boot: run command to start the server part
- the client part is started in the client folder, with the npm start command
