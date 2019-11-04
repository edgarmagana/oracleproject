//
// Functions for the Create / Edit page.
//

// Function to return to the home page
function returnTo() {
    window.location.href = "index.html"
}

// Will parse the page parameters from the query string 
// into a easy to use key-value object
function parseQueryString() {
    var queryString = document.location.search;
    var params = queryString.replace('?', '');
    params = params.split('&');
    var obj = {};
    params.forEach(function(p) {
        p = p.split('=');
        obj[p[0]] = p[1];
    });
    return obj;
}

// Parse the query string in order to check if a specific animal
// is being requested for edit.
var params = parseQueryString();
var data;

document.addEventListener("DOMContentLoaded", async function() {
    // If params.id is set, we will be editing an existing animal
    if (params.id) {
        document.getElementById('title').innerHTML = 'Edit a pet';
        // Call the GET REST endpoint to retrieve the animal
        data = await (await fetch('/ngo/animals/' + params.id)).json();
        document.getElementById('animal-name').value = data.name;
        document.getElementById("animal-age").value = data.age;
        document.getElementById("animal-race").value = data.race;
        if (data.status == 'available') {
            document.getElementById("animal-status").checked = true;
        } else {
            document.getElementById("animal-status-unavailable").checked = true;
        }

        var div = document.createElement('div');
        var img = document.createElement('img');
        img.src = "/images/" + data.id + "-" + data.imageName;
        document.getElementById("container-edit").appendChild(div.appendChild(img));
    } else {
        document.getElementById("animal-unavailable").style.display = 'none';
    }
});

// Will do the work of invoking the REST endpoints when the user clicks save
async function postData() {

    var data = new FormData();
    var name = document.getElementById("animal-name").value;
    var age = document.getElementById("animal-age").value;
    var race = document.getElementById("animal-race").value;
    var status;
    if (document.getElementById("animal-status").checked) {
        status = 'available';
    } else {
        status = 'unavailable';
    }
    var fileField = document.getElementById("animal-image").files;

    if (params.id) {
        // Only add the fields that changed their value
        if (name !== data.name) {
            data.append('name', name);
        }
        if (age !== data.age) {
            data.append('age', age);
        }
        if (race !== data.race) {
            data.append('race', race);
        }
        if (status != data.status) {
            data.append('status', status);
        }

        if (fileField.length > 0) {
            data.append('image', fileField[0]);
        }
    } else {

        data.append('name', name);
        data.append('age', age);
        data.append('race', race);
        data.append('status', status);

        if (fileField.length <= 0) {
            window.alert('Please add an image file.');
            return; // A missing field. Exit
        }
        data.append('image', fileField[0]);
    }

    // Check if all required fields are changed.
    if (name == "" || age == "" || race == "" || status == "") {
        window.alert('Please fill all the fields');
        return;
    }

    var url = params.id ? '/ngo/animals/' + params.id : '/ngo/animals';
    var method = params.id ? 'PUT' : 'POST';
    const response = await fetch(url, {
        method: method,
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {},
        redirect: 'follow',
        referrer: 'no-referrer',
        body: data
    });
    // After invoking the endpoint, return to the index.html page
    window.location.href = "index.html";
}