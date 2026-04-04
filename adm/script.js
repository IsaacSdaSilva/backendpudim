// Valor total de todas as vendas exibido na tela
let total = 0;
let vendas = [];

// Função chamada quando o botão "Adicionar" é clicado
function teste() {
            let nome = document.getElementById("cliente").value.trim();
            let produto = document.getElementById("produto").value;
            let quantidade = parseInt(document.getElementById("quantidade").value, 10);
            let pagamento = document.getElementById("pagamento").value;

            // Validação dos campos antes de adicionar a venda
            if (nome === "" || quantidade <= 0 || isNaN(quantidade)) {
                alert("Preencha tudo corretamente!");
                return;
            }

            // Define o preço com base no produto selecionado
            let preco = produto === "Pudim P" ? 10 :
                        produto === "Pudim M" ? 30 :
                        produto === "Pudim G" ? 55 : 0;

            let valor = preco * quantidade;

            // Salva a venda no backend
            fetch("https://backend-pudim.onrender.com/vendas", { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome,
                    produto,
                    quantidade,
                    valor,
                    pagamento
                })
            })
            .then(() => {
                carregarVendas();
            })
            .catch(err => console.error("Erro ao adicionar venda:", err));

            // Limpa os campos após adicionar
            document.getElementById("cliente").value = "";
            document.getElementById("quantidade").value = 1;
        }

        // Função que cria uma linha na tabela para cada venda
      function adicionarNaTabela(id, nome, produto, quantidade, valor, pagamento, status) {
    let tabela = document.getElementById("tabela");
    let linha = tabela.insertRow();

    linha.insertCell(0).innerText = nome;
    linha.insertCell(1).innerText = produto;
    linha.insertCell(2).innerText = quantidade;
    linha.insertCell(3).innerText = "R$ " + valor.toFixed(2);

    // REMOVER (Ação)
    let removerCell = linha.insertCell(4);
    let botaoRemover = document.createElement("button");
    botaoRemover.innerText = "Remover";

    botaoRemover.onclick = function () {
        fetch(`https://backend-pudim.onrender.com/vendas/${id}`, {
            method: "DELETE"
        }).then(() => {
            carregarVendas();
        });
    };

    removerCell.appendChild(botaoRemover);

    // PAGAMENTO
    linha.insertCell(5).innerText = pagamento;

    // STATUS
    let statusCell = linha.insertCell(6);
    let botaoStatus = document.createElement("button");
    botaoStatus.innerText = status || "Pendente";

    botaoStatus.onclick = function () {
        let novoStatus = botaoStatus.innerText === "Pendente" ? "Pago" : "Pendente";
        botaoStatus.innerText = novoStatus;

        fetch(`https://backend-pudim.onrender.com/vendas/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status: novoStatus })
        });
    };

    statusCell.appendChild(botaoStatus);
}    
    
        function atualizarRelatorio() {
            let pudimP = 0;
            let pudimM = 0;
            let pudimG = 0;
            let faturamentoP = 0;
            let faturamentoM = 0;
            let faturamentoG = 0;
        
            vendas.forEach(venda => {
                if (venda.produto === "Pudim P") {
                    pudimP += venda.quantidade;
                    faturamentoP += venda.valor;
                } else if (venda.produto === "Pudim M") {
                    pudimM += venda.quantidade;
                    faturamentoM += venda.valor;
                } else if (venda.produto === "Pudim G") {
                    pudimG += venda.quantidade;
                    faturamentoG += venda.valor;
                }
            });

            document.getElementById("pudim-p").innerText = pudimP;
            document.getElementById("pudim-m").innerText = pudimM;
            document.getElementById("pudim-g").innerText = pudimG;
            document.getElementById("faturamento-p").innerText = faturamentoP.toFixed(2);
            document.getElementById("faturamento-m").innerText = faturamentoM.toFixed(2);
            document.getElementById("faturamento-g").innerText = faturamentoG.toFixed(2);
        }

        function calcularhoje() {
            let hoje = new Date().toLocaleDateString("pt-BR");
            let totalHoje = 0;
            vendas.forEach(venda => {
                if (venda.data === hoje) {
                    totalHoje += venda.valor;
                }
            });
            document.getElementById("total-hoje").innerText = totalHoje.toFixed(2);
        }
        function zerarSistema() {
            let confirmacao = confirm("Tem certeza que deseja zerar tudo? Esta ação não pode ser desfeita.");
            if (!confirmacao) {
                return;
            }
            atualizarTotais();
            // Limpa a tabela
            document.getElementById("tabela").innerHTML = "";
            // zera total
            total = 0;
            document.getElementById("total").innerText = "0.00";
            // zera relatório
            document.getElementById("pudim-p").innerText = "0";
            document.getElementById("pudim-m").innerText = "0";
            document.getElementById("pudim-g").innerText = "0";
            // zera faturamento
            document.getElementById("faturamento-p").innerText = "0.00";
            document.getElementById("faturamento-m").innerText = "0.00";
            document.getElementById("faturamento-g").innerText = "0.00";
            // zera total do dia
            document.getElementById("total-hoje").innerText = "0.00";
        }
           
        function filtrarPendentes() {
            let tabela = document.getElementById("tabela");
            tabela.innerHTML = ""; // Limpa a tabela antes de exibir os pendentes
            
            vendas
            .filter(venda => venda.status === "Pendente")
            .forEach(venda => {
                adicionarNaTabela(venda.id, venda.nome, venda.produto, venda.quantidade, venda.valor, venda.pagamento, venda.status);
            });
        }
        function atualizarTotais() {
            
            let recebido = 0;
            let pendente = 0;

            vendas.forEach(venda => {
                if (venda.status === "Pago") {
                    recebido += venda.valor;
                } else {
                    pendente += venda.valor;
                }
            });

            document.getElementById("recebido").innerText = recebido.toFixed(2);
            document.getElementById("pendente").innerText = pendente.toFixed(2);
        }

        function carregarVendas() {
            fetch("https://backend-pudim.onrender.com/vendas")
            .then(res=> res.json())
            .then(dados => {
                vendas = dados;
                let tabela = document.getElementById("tabela");
                tabela.innerHTML = "";

                total = 0;

                vendas.forEach(venda => {
                    adicionarNaTabela(
                        venda.id,
                        venda.nome,
                        venda.produto,
                        venda.quantidade,
                        venda.valor,
                        venda.pagamento,
                        venda.status
                    );

                    total += venda.valor;
                });
                document.getElementById("total").innerText = total.toFixed(2);
                atualizarRelatorio();
                atualizarTotais();
                calcularhoje();
            })
            .catch(err => console.error("Erro ao carregar vendas:", err));
        }
        // Carrega as vendas salvas quando a página é aberta
        window.addEventListener('load', carregarVendas);