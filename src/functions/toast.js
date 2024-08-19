const toast = (settoast, mensagem, cor, duracao) => {
  settoast({ display: 'flex', visibility: 'visible', mensagem: mensagem, cor: cor });
  setTimeout(() => {
    settoast({ display: 'none', visibility: 'hidden', mensagem: '', cor: 'transparent' });
  }, duracao);
}

export default toast;
