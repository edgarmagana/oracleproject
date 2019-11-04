# Cerberus

Cerberus is the name I gave to this sample project. It serves as a take home assignment for my application to a job position at Oracle.

## Assignment

The assinment is the following:

>
>Project Assignment
>
>We have an NGO that helps rescued animals to find a home, we need an application in which we can display, store and manage the data for this animals.
>
>- You can use your preferred frontend framework (can even use vanilla JS)
>
>- You must create a backend application with the CRUD functions to manage the data (bonus points if you use ExpressJS).
>
>- The source must be available on a collaboration site (github or bitbucket), and we must be able to download and build it on our machines.
>
>Bonus points if:
>
>- Your application is hosted and live on the cloud (Heroku, Digital Ocean, Google Cloud, Oracle Cloud)
>
>- Have a develop and production build.
>
>- Use docker containers for your app
>
>Deadline: November 6th.
>

## Development Stack

I chose to go raw and use vanilla JavaScript. While not the fanciest solution, I thought it would be the simplest and not risk to rely too much in what another library gave me for free. After all, this is a project to showcase my skills.

Front end: 
- JavaScript: Used old fashion JavaScript. I didn't use arrow functions or other more modern JavaScript features. The one exception is I did use async/await for the REST calls, which used the fetch API.

Backend: 
- I used Node.js with Express (shooting for those bonus points 😉). In this case, for the backend I did use arrow functions, string interpolation, etc.

- Database: Given my limited time and since I felt the assignment was more directed towards Front End and REST API development, I decided to not worry about using an actual database and just fell back to use a file system based approach. A single file stores my entire database.

App Hosting:
- The Cloud provider chosen was Heroku, mainly for the low friction account creation (no credit card, no sales pitch).

## Live Site

The deployed application can be found at https://oracleproject.herokuapp.com/

## Building the project

In order to build and run the project, you need to have node and npm installed in your system.

Clone this repository and `cd` into the project's directory then execute:

sh
npm install

npm will install all required dependencies in your system.

When npm finishes doing its thing, you can start the web server:

sh
npm start

or 
sh
node index.js


Wait until you see the following output:

sh
Web app started listening on port 3000


After that, you will be able to access you local development server at http://localhost:3000/

## Running for development

Alternatively, you can run the project in development mode, which allows for hot code reloading. This mode uses [nodemon](<https://www.npmjs.com/package/nodemon>) to launch the dev server and restart it automatically whenever a change is done to the applications code.

sh
nodemon index.js


## REST API

The REST API implemented is quite simple and straightforward.

- `GET /ngo/animals/`  
  Will retrieve the full list of animals.
- `GET /ngo/animals/:id`  
  Will retrieve the details of a the animal specified by the `id` path param 
- `POST /ngo/animals`  
  Will create an animal record with the provided body params. A random id will be generated for it.
- `PUT /ngo/animals/:id`  
  Will update the record of an existing animal with the provided `id`.
- `DELETE /ngo/animals/:id`   
  Will delete the record of an existing animal with the provided `id`.

## Limitations

Given my limited personal time due to my work commitments, I will not be able to cover as many implementation aspects as I would have liked. This is a list of limitations

- No Authentication or Authorization  
The site is open to anyone. This is of course not ideal.
- No real Database  
As mentioned before in the Development Stack section, I opted to compromise in this area and just settle for a simpler file system based approach.
- Poor Design and UX  
As much as I would like to say otherwise, coming up with beautiful, colorful things is not my best quality, so I do it best with feedback from peers