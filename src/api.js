const express = require("express");
const app = express();
const token = require("../src/util/token");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const router = express.Router();

router.get("/sobre", (req, res, next) => {
  res.status(200).send({
    nome: "API - CHAT",
    versão: "0.1.0",
    autor: "João Roth",
  });
});

router.get("/salas", async (req, res, next) => {
  if (await token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick)) {
    let resp = await salaController.get();
    res.status(200).send(resp);
  } else {
    res.status(400).send({ msg: "Usuário não autorizado" });
  }
});

router.post("/entrar", async (req, res, next) => {
  const usuarioController = require("./controllers/usuarioController");
  let resp = await usuarioController.entrar(req.body.nick);
  res.status(200).send(resp);
});

router.put("/sala/entrar", async (req, res) => {
  if (!token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick)) return false;
  let resp = await salaController.entrar(req.headers.iduser, req.query.idsala);
  res.status(200).send(resp);
});

router.post("/sala/mensagem", async (req, res) => {
  if (!token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick)) return false;
  let resp = await salaController.enviarMensagem(req.headers.nick, req.body.msg, req.body.idSala);
  res.status(200).send(resp);
});

router.get("/sala/mensagens", async (req, res) => {
  if (!token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick)) return false;
  let resp = await salaController.buscarMensagens(req.query.idSala, req.query.timestamp);
  res.status(200).send(resp);
});

app.use("/", router);

module.exports = app;