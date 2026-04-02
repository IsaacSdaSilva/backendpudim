function pedir(produto, idQuantidade) {
 let numero = "555199086509";
 let nome = document.getElementById('nomeCliente').value;
 let quantidade = document.getElementById(idQuantidade).value;
 if (nome === "") {
     alert("Por favor,Coloca teu nome 😄.");
     return;
 }
 let mensagem = `Olá, Me chamo ${nome} e gostaria de pedir ${quantidade} x ${produto} 🍮 
 Sei que o prazo de entrega é de até 2 dias.`;
 window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`, '_blank');
}