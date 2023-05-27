const token = require("../util/token");
const usuarioModel = require('../models/usuarioModel');

exports.entrar = async (nick) => {
  let resp = await usuarioModel.registrarUsuario(nick);
  if (resp && resp.insertedId) {
    return {
      "idUsuario": resp.insertedId,
      "token": await token.setToken(JSON.stringify(resp.insertedId).replace(/"/g, ''), nick),
      "nick": nick
    }
  }
};