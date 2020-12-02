var params = new URLSearchParams(window.location.search);

var usuario = params.get('nombre');
var sala = params.get('sala');

// Referencias
var divUsuarios = $('#divUsuarios');
var formData = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatBox = $('#divChatbox');

// Scroll Function
function scrollBottom() {

    // selectors
    var newMessage = divChatBox.children('li:last-child');

    // heights
    var clientHeight = divChatBox.prop('clientHeight');
    var scrollTop = divChatBox.prop('scrollTop');
    var scrollHeight = divChatBox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatBox.scrollTop(scrollHeight);
    }
}

// Usuarios
function renderizarUsuarios(personas) {
    var html = '';
    html += '<li>';
    html += '    <a href="javascript:void(0)" class="active"> Chat de <span> ' + sala + '</span></a>';
    html += '</li>';

    for (var i = 0; i < personas.length; i++) {
        html += '<li>';
        html += '    <a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    divUsuarios.html(html);
}

// Chats
function RenderizarMensaje(mensaje, itsMe) {

    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ":" + fecha.getMinutes();

    var adminClass = 'info';
    if (mensaje.nombre === "Sistema") {
        adminClass = 'danger';
    }

    var html = '';
    if (itsMe) {
        html += '<li class="reverse animated fadeIn"">';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" />';
        html += '    </div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }
    else {
        html += '<li class="animated fadeIn">';
        
        if (mensaje.nombre !== "Sistema") {
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" />';
        }
        
        html += '    </div>';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }

    divChatBox.append(html);
    scrollBottom();
}

// Events
divUsuarios.on('click', 'a', function () {
    var id = $(this).data('id');

    if (!id) return;
});

formData.on('submit', function (e) {
    e.preventDefault();

    if (txtMensaje.val().trim().length === 0) return;

    socket.emit('crearMensaje', {
        usuario: usuario,
        mensaje: txtMensaje.val()
    }, function (mensaje) {
        txtMensaje.val('').focus();
        RenderizarMensaje(mensaje, true);
    });
});