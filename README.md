# RESTful API Simple Notes App
Build with NodeJS, ExpressJS and Database MySQL

## Steps for using the program
1. Install Node.js
https://nodesource.com/blog/installing-nodejs-tutorial-windows/
2. Dowload or clone this project.
3. Open CMD or terminal and enter your directory folder.
4. Next, install module. Modules can be likened to libraries that contain packages for use in applications.
```
npm install
```
5. Make a new file called **.env** in the root directory, set up first [here](#set-up-env-file)
6. Import file [notes_app_db.sql](notes_app_db.sql) to your **SQL database**
7. After that, Run program
```
npm start
```
8. Test this program using tools called POSTMAN. Because by using POSTMAN we can check in realtime in making APIs.

## Set up .env file
Open .env file on your favorite code editor, and copy paste this code below :
```
NODE_ENV=development
PORT= // fill with your port

DB_HOST=localhost
DB_USER=root // default
DB_PASS= // default
DB_NAME=simple_note_app
```

## Route documentation
https://documenter.getpostman.com/view/7847723/TVK8aziE
