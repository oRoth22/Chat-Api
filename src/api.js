const express = require("express");
const app = express();
const token = require("../src/util/token");
const salaController = require("./controllers/salaController");
const usuarioController = require("./controllers/usuarioController");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const router = express.Router();

app.use('/', router.get('/', (req,res) => {
	res.status(200).send("<h4>API - CHAT</h4>");
}))

app.use("/sobre", router.get('/sobre', (req, res, next) => {
  res.status(200).send({
    nome: "API - CHAT",
    versão: "0.1.0",
    autor: "João Roth",
  });
}));

app.use("/salas",router.get("/salas", async (req, res,next) => {
  if(await token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick)) {
  let resp= await salaController.get();
  res.status(200).send(resp);
}
else{
  res.status(400).send({msg:"Usuário não autorizado"});
}	
}))

app.use("/entrar", router.post("/entrar", async (req, res, next) => {
	let resp = await usuarioController.entrar(req.body.nick);
	res.status(200).send(resp);
}))

app.use("/salas/criar", router.post("/salas/criar", async (req, res) => {
  if (!token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick)) return false;
  let resp = await salaController.criarSala(req.body.nome, req.body.tipo, req.body.chave);
  res.status(200).send(resp);
}));

app.use("/sala/entrar", router.put("/sala/entrar", async (req, res)=>{
	if(!token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick)) return false;
	let resp= await salaController.entrar(req.headers.iduser, req.query.idsala);
	res.status(200).send(resp);
}))

app.use("/sala/mensagem/", router.post("/sala/mensagem", async (req, res) => {
	if(!token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick)) return false;
	let resp= await salaController.enviarMensagem(req.headers.nick, req.body.msg,req.body.idSala);
	res.status(200).send(resp);
}))

app.use("/sala/mensagens/", router.get("/sala/mensagens", async (req, res) => {
	if(!token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick)) return false;
	let resp= await salaController.buscarMensagens(req.query.idSala, req.query.timestamp);
	res.status(200).send(resp);
}))

app.use("/", router);

module.exports = app;