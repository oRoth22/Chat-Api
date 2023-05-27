const db = require("./db");

let criarSala = async(nome, tipo, chave) => {
    let sala = {
      nome: nome,
      tipo: tipo
    };

    if (tipo === "privada" && chave) {
      sala.chave = chave;
    }

    return await db.insertOne("salas", sala);
  }

let listarSalas = async() => {
    let salas = await db.findAll("salas");
    return salas;
}

let buscarSala = async (idsala) => {
    return db.findOne("salas", idsala);
}

let atualizarMensagens = async (sala) => {
    return await db.updateOne("salas", sala,{ _id: sala._id });
}

let buscarMensagens = async (idsala, timestamp) => {
    let sala = await buscarSala(idsala);
    if (sala.msgs) {
        let msgs = [];
        sala.msgs.forEach((msg) => {
            if(msg.timestamp >= timestamp){
                msg.push(msg);
            }
        });
        return msgs;
    }
    return [];
}

async function entrarNaSala(idUser, idSala) {
    const sala = await db.findOne("salas", idSala);
    if (!sala) {
      return false;
    }
    const usuario = await db.findOne("usuarios", idUser);
    if (!usuario) {
      return false;
    }
    usuario.sala = { _id: sala._id, nome: sala.nome, tipo: sala.tipo };
    const result = await db.updateOne("usuarios", usuario, { _id: usuario._id });
    return result.modifiedCount > 0;
  }
  async function sairDaSala(idUser) {
    const usuario = await db.findOne("usuarios", idUser);
    if (!usuario) {
      return false; 
    }
    usuario.sala = null; 
    const result = await db.updateOne("usuarios", usuario, { _id: usuario._id });
    return result.modifiedCount > 0;
  }


module.exports = { listarSalas, buscarSala, atualizarMensagens, buscarMensagens, criarSala, entrarNaSala, sairDaSala};
