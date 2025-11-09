// Salvar agendamento localmente
document.getElementById("formAgendamento").addEventListener("submit", function(e) {
  e.preventDefault();
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const data = document.getElementById("data").value;
  const servico = document.getElementById("servico").value;

  const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
  agendamentos.push({ nome, email, data, servico });
  localStorage.setItem("agendamentos", JSON.stringify(agendamentos));

  document.getElementById("msgSucesso").innerText = "✨ Agendamento salvo com sucesso!";
  this.reset();
});

// Função do carrinho
function adicionarAoCarrinho(produto) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  carrinho.push(produto);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  alert(`🛍️ ${produto} adicionado ao carrinho!`);
}
