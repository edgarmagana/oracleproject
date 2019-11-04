document.addEventListener("DOMContentLoaded", async function() {
    var container = document.getElementById("animals-containers");

    function removeAll() {
        var toremove = document.querySelectorAll(".animal-node");
        toremove.forEach(node => container.removeChild(node));
    }

    window.refresh = async function() {
        var data = await (await fetch('/ngo/animals')).json();
        removeAll();
        addAnimals(data);
    }

    function addAnimals(data) {
        // Create a animal container for each animal in the array
        data.forEach(function(animal) {
            var animalNode = document.createElement("div");
            animalNode.className = "animal-node";

            // Edit Icon
            var div = document.createElement('div');
            div.className = 'edit-icon';
            div.title = 'Edit';
            animalNode.appendChild(div);

            // Edit click handler... Redirect to the create/edit page
            div.onclick = function() {
                window.location.href = "create.html?id=" + animal.id;
            }

            // Delete Icon
            var div = document.createElement('div');
            div.className = 'delete-icon';
            div.title = 'Delete';
            animalNode.appendChild(div);

            // Delete click handler... Invoke the delete endpoint
            div.onclick = async function() {

                // Ask user for confirmation before deleting the record forever
                if (confirm('Are you sure you want to delete this animal?')) {
                    const response = await fetch('/ngo/animals/' + animal.id, {
                        method: 'DELETE',
                        mode: 'cors',
                        cache: 'no-cache',
                        credentials: 'same-origin',
                        headers: {},
                        redirect: 'follow',
                        referrer: 'no-referrer'
                    });
                    // After deleting, refresh the view
                    refresh();
                }
            }

            // Pet Image
            div = document.createElement('div');
            div.className = 'img-pet-div';
            var img = document.createElement('img');
            img.src = "/images/" + animal.id + "-" + animal.imageName;
            img.className = "img-pet";
            div.appendChild(img)
            animalNode.appendChild(div);

            // Name
            div = document.createElement('div');
            label = document.createElement('label');
            label.innerHTML = "Name: ";
            var span = document.createElement('span');
            span.innerHTML = animal.name;
            div.appendChild(label);
            div.appendChild(span);
            animalNode.appendChild(div);

            // Age        
            div = document.createElement('div');
            label = document.createElement('label');
            label.innerHTML = "Age: ";
            var span = document.createElement('span');
            span.innerHTML = animal.age;
            div.appendChild(label);
            div.appendChild(span);
            animalNode.appendChild(div);

            // Race
            div = document.createElement('div');
            label = document.createElement('label');
            label.innerHTML = "Race: ";
            var span = document.createElement('span');
            span.innerHTML = animal.race;
            div.appendChild(label);
            div.appendChild(span);
            animalNode.appendChild(div);

            container.appendChild(animalNode);

        });
    }

    refresh();

});

// 
function senMessage() {
    window.location.href = "create.html";
}