import express from "express";
import fs from "fs";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DB_FILE = "./backend/db.json";

function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// LOGIN
app.post("/login", (req, res) => {
  const { email, senha } = req.body;
  const db = readDB();
  const user = db.usuarios.find(u => u.email === email && u.senha === senha);
  if (user) res.json({ success: true, nome: user.nome, email: user.email });
  else res.status(401).json({ success: false, message: "Credenciais inválidas" });
});

// REGISTRO
app.post("/register", (req, res) => {
  const { nome, email, senha } = req.body;
  const db = readDB();
  if (db.usuarios.find(u => u.email === email))
    return res.status(400).json({ success: false, message: "Email já cadastrado" });
  db.usuarios.push({ nome, email, senha });
  writeDB(db);
  res.json({ success: true });
});

// PRODUTOS
app.get("/produtos", (req, res) => {
  const db = readDB();
  res.json(db.produtos);
});

// SERVIÇOS
app.get("/servicos", (req, res) => {
  const db = readDB();
  res.json(db.servicos);
});

// AGENDAMENTO
app.post("/agendar", (req, res) => {
  const { nome, email, servico, data, hora } = req.body;
  const db = readDB();
  db.agendamentos.push({ nome, email, servico, data, hora });
  writeDB(db);
  res.json({ success: true });
});

// Porta automática (Vercel usa process.env.PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor rodando na porta ${PORT}`));
