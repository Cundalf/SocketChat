class Usuario {
    constructor() {
        this.personas = [];
    }
    
    AgregarPersona(id, nombre, sala) {
        let persona = { id, nombre, sala };
        
        this.personas.push(persona);
        
        return this.personas;
    }
    
    GetPersona( id ) {
        return this.personas.filter( persona => persona.id === id)[0];
    }
    
    GetPersonas() {
        return this.personas;
    }
    
    GetPersonasPorSala(sala) {
        return this.personas.filter(persona => persona.sala === sala);
    }
    
    BorrarPersona(id) {
        let personaBorrada = this.GetPersona(id);
        this.personas = this.personas.filter(persona => persona.id != id);
        
        return personaBorrada;
    }
}

module.exports = {
    Usuario
};