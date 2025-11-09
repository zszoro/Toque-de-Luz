// ====== VARIÁVEIS GERAIS ======
const cartIcon = document.getElementById("cartIcon");
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || null;

// ====== FUNÇÃO: SALVAR CARRINHO ======
function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

// ====== FUNÇÃO: MOSTRAR ALERTA BONITO ======
function toast(msg, cor = "#2e7d6b") {
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.position = "fixed";
  t.style.bottom = "20px";
  t.style.right = "20px";
  t.style.background = cor;
  t.style.color = "white";
  t.style.padding = "10px 20px";
  t.style.borderRadius = "8px";
  t.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
  t.style.zIndex = "9999";
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}

// ====== LOGIN / CADASTRO ======
const formLogin = document.getElementById("formLogin");
const formCadastro = document.getElementById("formCadastro");

if (formLogin) {
  formLogin.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const senha = document.getElementById("loginSenha").value;

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const user = usuarios.find(u => u.email === email && u.senha === senha);

    if (user) {
      localStorage.setItem("usuarioLogado", JSON.stringify(user));
      toast("Login realizado com sucesso!");
      setTimeout(() => window.location.href = "index.html", 1000);
    } else {
      toast("E-mail ou senha incorretos!", "#d9534f");
    }
  });
}

if (formCadastro) {
  formCadastro.addEventListener("submit", e => {
    e.preventDefault();
    const nome = document.getElementById("cadNome").value;
    const email = document.getElementById("cadEmail").value;
    const senha = document.getElementById("cadSenha").value;

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    if (usuarios.find(u => u.email === email)) {
      toast("E-mail já cadastrado!", "#d9534f");
      return;
    }

    usuarios.push({ nome, email, senha });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    toast("Cadastro realizado com sucesso!");
    setTimeout(() => window.location.href = "login.html", 1000);
  });
}

// ====== PRODUTOS DINÂMICOS ======
const productList = document.getElementById("productList");
if (productList) {
  const produtos = [
    { id: 1, nome: "Óleo Essencial de Lavanda", preco: 59.90, img: "https://images.unsplash.com/photo-1600181952597-cdf02a1eb0b2" },
    { id: 2, nome: "Creme Hidratante Natural", preco: 39.90, img: "https://images.unsplash.com/photo-1627495668859-765f773d9248" },
    { id: 3, nome: "Vela Aromática", preco: 49.90, img: "https://images.unsplash.com/photo-1601933470095-2e8b61df0b3b" },
  ];

  productList.innerHTML = produtos.map(p => `
    <div class="card">
      <img src="${p.img}" alt="${p.nome}">
      <h3>${p.nome}</h3>
      <p>R$ ${p.preco.toFixed(2)}</p>
      <button onclick="adicionarCarrinho(${p.id})">Adicionar ao Carrinho</button>
    </div>
  `).join("");
}

// ====== ADICIONAR AO CARRINHO ======
function adicionarCarrinho(id) {
  if (!usuarioLogado) {
    toast("Você precisa fazer login para comprar!", "#d9534f");
    setTimeout(() => window.location.href = "login.html", 1200);
    return;
  }

  const produtos = [
    { id: 1, nome: "Óleo Essencial de Lavanda", preco: 59.90 },
    { id: 2, nome: "Creme Hidratante Natural", preco: 39.90 },
    { id: 3, nome: "Vela Aromática", preco: 49.90 },
  ];

  const produto = produtos.find(p => p.id === id);
  const item = carrinho.find(p => p.id === id);

  if (item) item.qtd++;
  else carrinho.push({ ...produto, qtd: 1 });

  salvarCarrinho();
  toast(`${produto.nome} adicionado ao carrinho!`);
}

// ====== AGENDAMENTO ======
const formAgendamento = document.getElementById("formAgendamento");
if (formAgendamento) {
  formAgendamento.addEventListener("submit", e => {
    e.preventDefault();

    if (!usuarioLogado) {
      toast("Você precisa estar logado para agendar!", "#d9534f");
      setTimeout(() => window.location.href = "login.html", 1000);
      return;
    }

    const agendamento = {
      nome: document.getElementById("nome").value,
      email: document.getElementById("email").value,
      servico: document.getElementById("servico").value,
      data: document.getElementById("data").value
    };

    let agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
    agendamentos.push(agendamento);
    localStorage.setItem("agendamentos", JSON.stringify(agendamentos));

    toast("Agendamento realizado com sucesso!");
    formAgendamento.reset();
  });
}

// ====== CARRINHO VISUAL ======
if (cartIcon) {
  cartIcon.addEventListener("click", () => {
    const overlay = document.createElement("div");
    overlay.classList.add("overlayCarrinho");
    overlay.innerHTML = `
      <div class="carrinhoBox">
        <h3>🛒 Seu Carrinho</h3>
        <ul>
          ${carrinho.map(p => `
            <li>${p.nome} x${p.qtd} - R$ ${(p.preco * p.qtd).toFixed(2)}</li>
          `).join("")}
        </ul>
        <p><b>Total:</b> R$ ${carrinho.reduce((a,b)=>a+b.preco*b.qtd,0).toFixed(2)}</p>
        <button id="fecharCarrinho">Fechar</button>
      </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById("fecharCarrinho").addEventListener("click", () => {
      overlay.remove();
    });
  });
}

// ====== ESTILO POPUP CARRINHO ======
const style = document.createElement("style");
style.innerHTML = `
.overlayCarrinho {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center;
  z-index: 9999;
}
.carrinhoBox {
  background: #fff;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  text-align: left;
  width: 90%;
  max-width: 400px;
}
.carrinhoBox ul {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}
.carrinhoBox button {
  width: 100%;
  background: #2e7d6b;
  color: #fff;
  padding: 0.8rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}
.carrinhoBox button:hover {
  background: #256656;
}
`;
document.head.appendChild(style);
