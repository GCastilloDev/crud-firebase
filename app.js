firebase.initializeApp({
    apiKey: "AIzaSyCj4wyAWcrUeOEBMiArINCLq-6nd3Jv1X8",
    authDomain: "proyectousuario-cb5fd.firebaseapp.com",
    projectId: "proyectousuario-cb5fd"
});

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();


//Agregar documentos 
function guardar() {
    var nombre = document.getElementById('nombre').value;
    var apellido = document.getElementById('apellido').value;
    var añoNacimiento = document.getElementById('añoNacimiento').value;
    db.collection("users").add({ //.add agrega un ID automatico a nuestro documento
        first: nombre,
        last: apellido,
        born: añoNacimiento
    })
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id); //Mensaje a consola
            nombre = document.getElementById('nombre').value = '';
            apellido = document.getElementById('apellido').value = '';
            añoNacimiento = document.getElementById('añoNacimiento').value = '';
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
}

//Leer documentos
var tabla = document.getElementById('tabla');
db.collection("users").onSnapshot((querySnapshot) => { //Se sustituye get, por onSnapshot() que es un elemento de escucha
    tabla.innerHTML = '';
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        tabla.innerHTML +=
            `
                            <tr>
                            <th scope="row">${doc.id}</th>
                            <td>${doc.data().first}</td>
                            <td>${doc.data().last}</td>
                            <td>${doc.data().born}</td>
                            <td class="center"><button class="btn-small waves-effect red" onclick="eliminar('${doc.id}')">Eliminar</button></td>
                            <td class="center"><button class="btn-small waves-effect yellow" onclick="editar('${doc.id}','${doc.data().first}','${doc.data().last}','${doc.data().born}')">Editar</button></td>
                            </tr>
                            `
    });
})

//Borrar datos
function eliminar(id) {
    db.collection("users").doc(id).delete().then(function () {
        console.log("Document successfully deleted!");
    }).catch(function (error) {
        console.error("Error removing document: ", error);
    });
}

//Editar documentos
function editar(id, nombre, apellido, añoNacimiento) {

    document.getElementById('nombre').value = nombre;
    document.getElementById('apellido').value = apellido;
    document.getElementById('añoNacimiento').value = añoNacimiento;

    var boton = document.getElementById('btnGuardar');
    boton.innerHTML = 'Editar';

    boton.onclick = function () {
        var usersRef = db.collection("users").doc(id);

        //Variables para recuperar los datos del campo a actualizar 
        var nombre = document.getElementById('nombre').value;
        var apellido = document.getElementById('apellido').value;
        var añoNacimiento = document.getElementById('añoNacimiento').value;

        //Se actualizan los campos con el contenido de las variables
        return usersRef.update({
            first: nombre,
            last: apellido,
            born: añoNacimiento
        })
            .then(function () {
                console.log("Document successfully updated!");
                boton.innerHTML = 'Guardar';
                nombre = document.getElementById('nombre').value = '';
                apellido = document.getElementById('apellido').value = '';
                añoNacimiento = document.getElementById('añoNacimiento').value = '';
                boton.onclick = guardar; //Si se pone guardar() ejecuta el método, y sin () solo referencia el método
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    }
}
