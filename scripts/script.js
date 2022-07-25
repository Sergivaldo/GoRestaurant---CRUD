const btt_novo = document.getElementById("btt_novo");
const modal = document.getElementById("modal");
const btt_fechar = document.getElementById("close_btt");
const main = document.querySelector("main");
const btt_add = document.getElementById("btt_add");

function fechar_modal() {
  limpar_campos();
  modal.classList.remove("active");
}

function abrir_modal() {
  modal.classList.add("active");
}

function clearLocalStorage() {
  localStorage.clear();
  atualizar_tela();
}

function getLocalStorage() {
  return JSON.parse(localStorage.getItem("pratos")) ?? [];
}

function setLocalStorage(db_pratos) {
  localStorage.setItem("pratos", JSON.stringify(db_pratos));
}

function remover_prato(index) {
  const db_pratos = ler_pratos();
  db_pratos.splice(index, 1);
  setLocalStorage(db_pratos);
}

function atualizar_prato(prato, indice) {
  const db_pratos = ler_pratos();
  db_pratos[indice] = prato;
  setLocalStorage(db_pratos);
}

function ler_pratos() {
  return getLocalStorage();
}

function criar_prato(prato) {
  const db_pratos = getLocalStorage();
  db_pratos.push(prato);
  setLocalStorage(db_pratos);
}

function adicionar_prato() {
  if (sao_campos_validos()) {
    const prato = {
      link:
        document.getElementById("link_imagem").value == ""
          ? "./assets/prato_generico.png"
          : document.getElementById("link_imagem").value,
      nome: document.getElementById("nome").value,
      descricao: document.getElementById("descricao").value,
      preco: document.getElementById("preco").value,
    };
    const index = document.getElementById("nome").dataset.index;
    if (index == "novo") {
      criar_prato(prato);
      fechar_modal();
      atualizar_tela();
    } else {
      atualizar_prato(prato, index);
      fechar_modal();
      atualizar_tela();
    }
  }
}

function limpar_campos() {
  const inputs = document.getElementsByClassName("modal-input");

  for (let index = 0; index < inputs.length; index++) {
    const input = inputs[index];
    input.value = "";
  }
}

function sao_campos_validos() {
  return document.getElementById("modal-form").reportValidity();
}

function criar_card(prato, index) {
  let card = document.createElement("div");
  card.classList.add("card-food");
  card.innerHTML = `
      <div class="card-food__img">
      </div>
      <div class="card-food__info">
        <strong>${prato.nome}</strong>
        <p>${prato.descricao}</p>
        <span>R$ ${prato.preco}</span>
        </div>
      <div class="card-food__edit">
          <div>
              <button type="button" data-type='button' id='editar-${index}' class="fa-solid fa-pen"></button>
              <button type="button" data-type='button' id='remover-${index}' class="fa-solid fa-trash"></button>
          </div>
      </div>
  `;
  card.querySelector(
    ".card-food__img"
  ).style.backgroundImage = `url(${prato.link})`;

  main.appendChild(card);
}

function limpar_tela() {
  lista_cards = main.querySelectorAll(".card-food");
  lista_cards.forEach((card) => {
    card.remove();
  });
}
function atualizar_tela() {
  const db_pratos = ler_pratos();
  limpar_tela();
  db_pratos.forEach(criar_card);
}

function editar_prato(index) {
  const prato = ler_pratos()[index];
  prato.index = index;
  preencher_campos(prato);
  abrir_modal();
}

function preencher_campos(prato) {
  document.getElementById("link_imagem").value = prato.link;
  document.getElementById("nome").value = prato.nome;
  document.getElementById("descricao").value = prato.descricao;
  document.getElementById("preco").value = prato.preco;
  document.getElementById("nome").dataset.index = prato.index;
}

function editar_deletar(e) {
  if (e.target.dataset.type == "button") {
    const [action, index] = e.target.id.split("-");
    if (action == "editar") {
      editar_prato(index);
    } else if (action == "remover") {
      remover_prato();
      atualizar_tela();
    }
  }
}

//Eventos

btt_novo.addEventListener("click", () => {
  abrir_modal();
});

modal.addEventListener("click", (e) => {
  if (e.target.id == "modal") {
    fechar_modal();
  }
});

btt_fechar.addEventListener("click", (e) => {
  fechar_modal();
});

main.addEventListener("click", editar_deletar);

window.addEventListener("load", atualizar_tela());
