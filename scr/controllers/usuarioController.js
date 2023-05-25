const token = require("../util/token");
const usuarioController = require('../models/usuarioModel');

exports.entrar = async(nick) => {
    let resp = await usuarioModel.registrarUsuario(nick);
    if(resp.insertedId){
        return {"idUsuario":resp.insertedId,
                "token": await token.setTokrn(JSON.stringify(resp.insertedId).replace(/"/g, ''),nick),
                "nick":nick}
    }
}