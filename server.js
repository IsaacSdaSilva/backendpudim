const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let vendas = [];

// LISTAR VENDAS
app.get("/vendas", (req, res) => {
  res.json(vendas);
});

// ADICIONAR VENDA
app.post("/vendas", (req, res) => {
  const venda = {
    id: Date.now(),
    nome: req.body.nome,
    produto: req.body.produto,
    quantidade: req.body.quantidade,
    valor: req.body.valor,
    pagamento: req.body.pagamento,
    status: "Pendente",
    data: new Date().toLocaleDateString()
  };

  vendas.push(venda);

  res.json(venda);
});

// ATUALIZAR STATUS
app.put("/vendas/:id", (req, res) => {
  const id = parseInt(req.params.id);

  vendas = vendas.map(v => {
    if (v.id === id) {
      return { ...v, status: req.body.status };
    }
    return v;
  });

  res.json({ message: "Atualizado" });
});

// DELETAR VENDA
app.delete("/vendas/:id", (req, res) => {
  const id = parseInt(req.params.id);

  vendas = vendas.filter(v => v.id !== id);

  res.json({ message: "Removido" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando...");
});
