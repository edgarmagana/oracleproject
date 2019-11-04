const express = require('express');
const app = express();
const fs = require('fs');
const basicAuth = require('express-basic-auth');

app.use(basicAuth({
    users: { 'admin': 'supersecret' },
    challenge: true

}));

// File upload support
const multer = require('multer');
const upload = multer({ dest: "./tmp" });

// Post, body params and JSON related express middleware
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// App constants
const DATABASE_FILE = './data/data.json';
const IMAGES_DIRECTORY = "./public/images";

// Load the initial database
let data = fs.readFileSync('./data/data.json');
data = JSON.parse(data);

// Utility function to help debugging REST endpoints
const logEndpointEntry = (req) => {
    console.log(`- - - - - - - - - - - - - - - - `)
    console.log(`${req.method} ${req.url}`);
    console.log(`Body: ${JSON.stringify(req.body, null, 4)}`);
    console.log(`Params: ${JSON.stringify(req.params, null, 4)}`)
    if (req.file) {
        console.log(`File: ${req.file.originalname}`);
    }
};

// GET /ngo/animals/
//
// Will return a list of all animals.
app.get('/ngo/animals', (req, res) => {
    logEndpointEntry(req);
    res.send(data)
});

// GET /ngo/animals/:id
// 
// Will return the details of the animal with the provided id
app.get('/ngo/animals/:id', (req, res) => {
    logEndpointEntry(req);

    var animal = data.find(animal => animal.id == req.params.id);

    if (animal) {
        res.send(animal);
    } else {
        // Not found. Send a 404
        res.status(404).send();
    }
});

// POST /ngo/animals
//
// Will create an animal with the provided details. Since it's a 
// POST endpoint, the parameters are expected to be found in the
// request body.
// An image is also expected, which will be stored under the 
// public directory configured in the IMAGES_DIRECTORY variable.
app.post('/ngo/animals', upload.single('image'), (req, res) => {
    logEndpointEntry(req);

    var animal = req.body;

    // assign a random id
    animal.id = Math.random();

    // Store the uploaded image into the publicly accessible directory
    // The image will be named with a combination of {id}-{filename} in order to avoid name collisions 
    fs.copyFileSync(req.file.path, `${IMAGES_DIRECTORY}/${animal.id}-${req.file.originalname}`);
    // Store also the image name, in order to recreate the file name used for storage
    animal.imageName = req.file.originalname;

    // Add the new register to the database
    data.push(animal);
    // Write back the data
    fs.writeFileSync(DATABASE_FILE, JSON.stringify(data, null, 4));

    // send response
    res.send(JSON.stringify(data, null, 4));
});

// PUT /ngo/animals/:id 
//
// Will update the animal with the given id. The request can ommit
// as many fields as wanted since only those provided will be
// updated.
app.put('/ngo/animals/:id', upload.single('image'), (req, res) => {
    logEndpointEntry(req);

    // Get the animal to be updated
    var animal = data.find(animal => animal.id == req.params.id);
    if (animal) {
        // Assign only the attributes provided as part of the request body
        Object.keys(req.body).forEach(key => {
            animal[key] = req.body[key];
        });

        // Only update the image if one is provided
        if (req.file) {
            animal.imageName = req.file.originalname;

            fs.copyFileSync(req.file.path, `${IMAGES_DIRECTORY}/${animal.id}-${req.file.originalname}`);
        }
        fs.writeFileSync(DATABASE_FILE, JSON.stringify(data, null, 4));

        // Return back the updated animal
        res.send(JSON.stringify(data, null, 4));
    } else {
        // Not found. Send a 404
        res.status(404).send();
    }
});

// DELETE /ngo/animals/:id 
// 
// Will delete the animal with the provided id
app.delete('/ngo/animals/:id', (req, res) => {
    logEndpointEntry(req);

    let howMany = data.length;
    // Remove any matching records with the given id
    data = data.filter(animal => animal.id != req.params.id);

    if (data.length === howMany) {
        // No changes. Nothing deleted... Not found!
        res.status(404).send();
    } else {
        // Something was deleted. Persist the changes.
        fs.writeFileSync(DATABASE_FILE, JSON.stringify(data, null, 4));

        res.status(200).send();
    }
});

// Serve static files. Needed for the actual website
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/css'));
app.use(express.static(__dirname + '/public/images'));
app.use(express.static(__dirname + '/public/js'));

// The port the web server will listen to
const port = process.env.PORT || 3000;
// Start the web server
app.listen(port, () => {
    console.log(`Web app started listening on port ${port}`);
});