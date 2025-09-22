import React, { useEffect, useState } from "react";
import "./style/lista.css";

function ListaContas() {
  const [contas, setContas] = useState([]);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [filtros, setFiltros] = useState({
    nome: "",
    data: "",
    valor: ""
  });

  const fetchContas = async () => {
    try {
      const query = new URLSearchParams(filtros).toString();
      const res = await fetch(`http://127.0.0.1:5000/contas?${query}`);
      const data = await res.json();
      setContas(data);
    } catch (err) {
      console.error("Erro ao buscar contas:", err);
    }
  };

  useEffect(() => {
    fetchContas();
  }, []);

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleFiltrar = (e) => {
    e.preventDefault();
    fetchContas();
  };

  const pagarConta = async (id) => {
    const confirmar = window.confirm("Deseja pagar esta conta?");
    if (!confirmar) return;

    try {
      const res = await fetch(`http://127.0.0.1:5000/contas/${id}/pagar`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        alert(`✅ Conta paga em ${data.data_pagamento}`);
        fetchContas();
      } else {
        alert("❌ Erro ao pagar conta.");
      }
    } catch (err) {
      console.error("Erro:", err);
    }
  };

  // Totais
  const totalPagar = contas
    .filter((c) => c.status === "pendente")
    .reduce((acc, c) => acc + parseFloat(c.valor_conta), 0);

  const totalPago = contas
    .filter((c) => c.status === "pago")
    .reduce((acc, c) => acc + parseFloat(c.valor_conta), 0);

  const qtdPendentes = contas.filter((c) => c.status === "pendente").length;

  // ✅ Nova função: trata string YYYY-MM-DD direto
  const formatarData = (dataString) => {
    if (!dataString) return "-";
    const [ano, mes, dia] = dataString.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  // ✅ Ordenar contas por prioridade de status e data
  const contasOrdenadas = [...contas].sort((a, b) => {
    const prioridade = { "pendente": 1, "em aberto": 2, "pago": 3 };
    const pa = prioridade[a.status] || 99;
    const pb = prioridade[b.status] || 99;

    if (pa !== pb) return pa - pb;

    // Se o status for igual, ordenar pela data da conta (mais antiga primeiro)
    if (a.data_conta && b.data_conta) {
      return new Date(a.data_conta) - new Date(b.data_conta);
    }
    return 0;
  });

  return (
    <div className="container">
      {/* Botão para abrir/fechar filtros */}
      <button
        className="btn-filtrar"
        onClick={() => setMostrarFiltros(!mostrarFiltros)}
      >
        🔍 Filtrar
      </button>

      {/* Filtros */}
      {mostrarFiltros && (
        <form className="filtros" onSubmit={handleFiltrar}>
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={filtros.nome}
            onChange={handleChange}
          />
          <input
            type="date"
            name="data"
            value={filtros.data}
            onChange={handleChange}
          />
          <input
            type="number"
            name="valor"
            placeholder="Valor"
            value={filtros.valor}
            onChange={handleChange}
          />
          <button type="submit">Aplicar</button>
        </form>
      )}

      {/* Totais */}
      <div className="resumo">
        <p>🔴 Contas pendentes: <strong>{qtdPendentes}</strong></p>
        <p>
          💰 Total a pagar:{" "}
          <strong>
            R$ {totalPagar.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </strong>
        </p>
        <p>
          ✅ Total pago:{" "}
          <strong>
            R$ {totalPago.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </strong>
        </p>
      </div>

      {/* Tabela */}
      <div className="tabela-wrapper">
        <table className="tabela-contas">
          <thead>
            <tr>
              <th>Data</th>
              <th>Nome</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Data Pagamento</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {contasOrdenadas.map((conta) => (
              <tr
                key={conta.id}
                className={conta.status === "pago" ? "linha-paga" : ""}
              >
                <td>{formatarData(conta.data_conta)}</td>
                <td>{conta.nome_conta}</td>
                <td>
                  R$ {parseFloat(conta.valor_conta).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </td>
                <td>{conta.status}</td>
                <td>{formatarData(conta.data_pagamento)}</td>
                <td>
                  <button
                    className="btn-pagar"
                    onClick={() => pagarConta(conta.id)}
                    disabled={conta.status === "pago"}
                  >
                    Pagar conta
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListaContas;