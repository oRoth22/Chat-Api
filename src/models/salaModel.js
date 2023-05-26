const db = require("./db");

async function listarSalas() {
    return await db.findAll("salas");
}

async function buscarSala(idsala) {
    return await db.findOne("salas", idsala);
}

async function atualizarMensagens(sala) {
    return await db.updateOne("salas", sala, { _id: sala._id });
}

async function buscarMensagens(idsala, timestamp) {
    const sala = await buscarSala(idsala);
    if (sala.msgs) {
        const msgs = sala.msgs.filter(msg => msg.timestamp >= timestamp);
        return msgs;
    }
    return [];
}

module.exports = { listarSalas, buscarSala, atualizarMensagens, buscarMensagens };
