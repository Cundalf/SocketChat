const { io } = require('../server');

const { Usuario } = require('../classes/usuarios');
const { CrearMensaje } = require('../utils/utils');

const usuarios = new Usuario();

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {

        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre y la sala son necesarios'
            });
        }

        client.join(data.sala);
        
        let personas = usuarios.AgregarPersona(client.id, data.nombre, data.sala);

        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.GetPersonasPorSala(data.sala));

        callback(personas);
    });

    client.on('disconnect', () => {
        let personaBorrada = usuarios.BorrarPersona(client.id);

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', CrearMensaje("Sistema", `${personaBorrada.nombre} salio`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.GetPersonasPorSala(personaBorrada.sala));
    });
    
    client.on('crearMensaje', (data) => {
        let persona = usuarios.GetPersona(client.id);
        let mensaje = CrearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    });
    
    // Mensajes privados
    client.on('mensajePrivado', (data) => {
        let persona = usuarios.GetPersona(client.id);
        client.broadcast.to(data.destino).emit('mensajePrivado', CrearMensaje( persona.nombre, data.mensaje));
    });
});