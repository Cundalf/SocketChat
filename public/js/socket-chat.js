var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y la sala son necesarios');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

socket.on('connect', function() {
    console.log('Conectado al servidor');
    
    socket.emit('entrarChat', usuario, function(usuarios) {
        renderizarUsuarios(usuarios);
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});

// Escuchar información
socket.on('crearMensaje', function(mensaje) {
    RenderizarMensaje(mensaje, false);
});

// Escuchar cambios de usuarios cuando entra o sale un usuario
socket.on('listaPersonas', function (personas) {
    renderizarUsuarios(personas);
});

// Mensajes privados
socket.on('mensajePrivado', function (mensaje) {
    console.log('Mensaje privado:', mensaje);
});