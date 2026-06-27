const formulario = document.getElementById("formulario");
const nombre = document.getElementById("nombre");
const email = document.getElementById("email");
const password = document.getElementById("password");
const repetirPassword = document.getElementById("repetirPassword");
const edad = document.getElementById("edad");
const telefono = document.getElementById("telefono");
const direccion = document.getElementById("direccion");
const ciudad = document.getElementById("ciudad");
const cp = document.getElementById("cp");
const dni = document.getElementById("dni");
const titulo = document.getElementById("titulo");

const modal = document.getElementById("modal");
const tituloModal = document.getElementById("tituloModal");
const mensajeModal = document.getElementById("mensajeModal");
const datosModal = document.getElementById("datosModal");
const cerrarModal = document.getElementById("cerrarModal");

function mostrarError(input, mensaje) {
    input.nextElementSibling.textContent = mensaje;
}

function limpiarError(input) {
    input.nextElementSibling.textContent = "";
}

function validarNombre() {
    let valor = nombre.value.trim();

    if (valor.length <= 6 || !valor.includes(" ")) {
        mostrarError(nombre, "Debe tener más de 6 letras y un espacio.");
        return false;
    }

    return true;
}

function validarEmail() {
    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(email.value)) {
        mostrarError(email, "Email inválido.");
        return false;
    }

    return true;
}

function validarPassword() {
    let regex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    if (!regex.test(password.value)) {
        mostrarError(password, "Mínimo 8 caracteres con letras y números.");
        return false;
    }

    return true;
}

function validarRepetirPassword() {

    if (password.value !== repetirPassword.value) {
        mostrarError(repetirPassword, "Las contraseñas no coinciden.");
        return false;
    }

    return true;
}

function validarEdad() {

    if (parseInt(edad.value) < 18) {
        mostrarError(edad, "Debe ser mayor o igual a 18.");
        return false;
    }

    return true;
}

function validarTelefono() {

    let regex = /^\d{7,}$/;

    if (!regex.test(telefono.value)) {
        mostrarError(telefono, "Debe tener al menos 7 dígitos.");
        return false;
    }

    return true;
}

function validarDireccion() {

    let regex = /^(?=.*[A-Za-z])(?=.*\d).+/;

    if (direccion.value.length < 5 ||
        !direccion.value.includes(" ") ||
        !regex.test(direccion.value)) {

        mostrarError(direccion,
            "Debe contener letras, números y un espacio.");

        return false;
    }

    return true;
}

function validarCiudad() {

    if (ciudad.value.trim().length < 3) {
        mostrarError(ciudad,
            "Debe tener al menos 3 caracteres.");
        return false;
    }

    return true;
}

function validarCP() {

    if (cp.value.trim().length < 3) {
        mostrarError(cp,
            "Debe tener al menos 3 caracteres.");
        return false;
    }

    return true;
}

function validarDni() {

    let regex = /^\d{7,8}$/;

    if (!regex.test(dni.value)) {
        mostrarError(dni,
            "Debe tener 7 u 8 dígitos.");
        return false;
    }

    return true;
}

function mostrarModal(tituloTexto, mensaje, datos = "") {

    tituloModal.textContent = tituloTexto;
    mensajeModal.textContent = mensaje;

    if (datos != "") {
        datosModal.textContent = JSON.stringify(datos, null, 4);
    } else {
        datosModal.textContent = "";
    }

    modal.classList.remove("oculto");
}

function ocultarModal() {
    modal.classList.add("oculto");
}

function mostrarExito(respuesta, datosEnviados) {

    mostrarModal(
        "Suscripción exitosa",
        "Los datos fueron enviados correctamente.",
        respuesta
    );

    localStorage.setItem(
        "suscripcion",
        JSON.stringify(datosEnviados)
    );

    formulario.reset();
    titulo.textContent = "HOLA";

    document.querySelectorAll(".error").forEach(error => {
        error.textContent = "";
    });
}

function mostrarErrorServidor(error) {

    mostrarModal(
        "Error",
        error.message
    );
}

cerrarModal.addEventListener("click", ocultarModal);

nombre.addEventListener("keyup", function () {

    if (nombre.value.trim() === "") {
        titulo.textContent = "HOLA";
    } else {
        titulo.textContent =
            "HOLA " + nombre.value.toUpperCase();
    }

});

nombre.addEventListener("blur", validarNombre);
email.addEventListener("blur", validarEmail);
password.addEventListener("blur", validarPassword);
repetirPassword.addEventListener("blur", validarRepetirPassword);
edad.addEventListener("blur", validarEdad);
telefono.addEventListener("blur", validarTelefono);
direccion.addEventListener("blur", validarDireccion);
ciudad.addEventListener("blur", validarCiudad);
cp.addEventListener("blur", validarCP);
dni.addEventListener("blur", validarDni);

document.querySelectorAll("input").forEach(input => {

    input.addEventListener("focus", function () {
        limpiarError(input);
    });

});

formulario.addEventListener("submit", function (e) {

    e.preventDefault();

    document.querySelectorAll(".error").forEach(error => {
        error.textContent = "";
    });

    let valido = true;

    valido = validarNombre() && valido;
    valido = validarEmail() && valido;
    valido = validarPassword() && valido;
    valido = validarRepetirPassword() && valido;
    valido = validarEdad() && valido;
    valido = validarTelefono() && valido;
    valido = validarDireccion() && valido;
    valido = validarCiudad() && valido;
    valido = validarCP() && valido;
    valido = validarDni() && valido;

    if (valido) {

        const datos = {
            nombre: nombre.value,
            email: email.value,
            password: password.value,
            edad: edad.value,
            telefono: telefono.value,
            direccion: direccion.value,
            ciudad: ciudad.value,
            cp: cp.value,
            dni: dni.value
        };

        const url = "https://jsonplaceholder.typicode.com/posts?" + new URLSearchParams(datos);

        fetch(url, { method: "POST"})
            .then(function (res) {

                if (!res.ok) {
                    throw new Error("Error " + res.status);
                }
                return res.json();

            })
            .then(function (json) {

                mostrarExito(json, datos);

            })
            .catch(function (error) {

                mostrarErrorServidor(error);

            });

    }

});

window.onload = function () {

    let datosGuardados =
        localStorage.getItem("suscripcion");

    if (datosGuardados) {

        let datos = JSON.parse(datosGuardados);

        nombre.value = datos.nombre;
        email.value = datos.email;
        password.value = datos.password;
        repetirPassword.value = datos.password;
        edad.value = datos.edad;
        telefono.value = datos.telefono;
        direccion.value = datos.direccion;
        ciudad.value = datos.ciudad;
        cp.value = datos.cp;
        dni.value = datos.dni;

        if (nombre.value != "") {
            titulo.textContent = "HOLA " + nombre.value.toUpperCase();
        }

    }

};
