const salaModel = require('../models/salaModel');
const usuarioModel = require('../models/usuarioModel');

exports.listarSalas = async () => {
  return await salaModel.listarSalas();
}

exports.getStatus = async (req, res) => {
  return { "status": "OK", "controller": "Sala" };
}

exports.getSalas = () => {
  const salaModel = require('../models/salaModel');
  return salaModel.listarSalas();
}

exports.entrar = async (iduser, idsala) => {
  const sala = await salaModel.buscarSala(idsala);
  if (!sala) {
    throw new Error('Sala não encontrada');
  }
  const user = await usuarioModel.buscarUsuario(iduser);
  if (!user) {
    throw new Error('Usuário não encontrado');
  }
  user.sala = { _id: sala._id, nome: sala.nome, tipo: sala.tipo };
  if (await usuarioModel.alterarUsuario(user)) {
    return { msg: "OK", timestamp: Date.now() };
  }
  return false;
};


exports.criarSala=async(nome, tipo, chave) => {
  let sala = {
    nome: nome,
    tipo: tipo
  };

  if (tipo === "privada" && chave) {
    sala.chave = chave;
  }

  return await salaModel.criarSala(sala);
}

exports.enviarMensagem = async (nick, msg, idsala) => {
  const sala = await salaModel.buscarSala(idsala);
  if (!sala.msgs) {
    sala.msgs = [];
  }
  const timestamp = Date.now();
  sala.msgs.push({
    timestamp: timestamp,
    msg: msg,
    nick: nick
  });
  let resp = await salaModel.atualizarMensagens(sala);
  return { "msg": "OK", "timestamp": timestamp };
}

exports.buscarMensagens = async (idsala, timestamp) => {
  let mensagens = await salaModel.buscarMensagens(idsala, timestamp);
  return {
    "timestamp": mensagens[mensagens.length - 1].timestamp,
    "msgs": mensagens
  };
} 