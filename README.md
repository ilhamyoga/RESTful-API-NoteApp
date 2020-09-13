# RESTful API Simple Notes App
Build with NodeJS, ExpressJS and Database MySQL

## Steps for using the program
1. Install Node.js
https://nodesource.com/blog/installing-nodejs-tutorial-windows/
2. Create a new folder
```
mkdir name_directory
```
3. Dowload or clone this project and copy in your folder
4. Install nodemon
```
npm install -g nodemon
```
5. Go to your directory folder use terminal
```
cd name_directory
```
6. Next, install module. Modules can be likened to libraries that contain packages for use in applications.
```
npm install
```
7. After that, Run program
```
npm start
```
8. Test this program using tools called POSTMAN. Because by using POSTMAN we can check in realtime in making APIs.

## Route
### GET
```
localhost:3000/notes  // using method get, to show all data note
localhost:3000/notes/id  // using method get, to show data by id. change the id with the number to show single note
localhost:3000/categories  // using method get, to show all data category
localhost:3000/categories/id  // using method get, to show data by id. change the id with the number to show single category
```
### POST
```
localhost:3000/notes  // using method post, to insert new note to database
localhost:3000/categories  // using method post, to insert new category to database
```
### PUT
```
localhost:3000/notes/id  // using method put, to update data by id. change the id with the number to update notes
localhost:3000/notes/id // using method put, to update data by id. change the id with the number to update notes
```
### DELETE
```
localhost:3000/notes/id  // using method delete, to delete data by id. change the id with the number to delete
localhost:3000/notes/id  // using method delete, to delete data by id. change the id with the number to delete
```
