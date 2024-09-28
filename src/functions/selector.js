const selector = (lista, botao, tempo) => {
  setTimeout(() => {
    if (botao !== undefined) {
      var botoes = document
        .getElementById(lista)
        .getElementsByClassName("button strong blinkbordas");
      for (var i = 0; i < botoes.length; i++) {
        botoes.item(i).className = "button weak";
      }
      document.getElementById(botao).className = "button strong blinkbordas";
    }
  }, tempo);
}

export default selector;
