import React, { useState } from "react";
import { NumericFormat } from "react-number-format";
import "../components/style/reset.css";
import "../components/style/formulario.css";

function Formulario() {
  const [form, setForm] = useState({
    data_conta: "",
    nome_conta: "",
    valor_conta: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleValorChange = (values) => {
    const { floatValue } = values; // pega valor numérico
    setForm({ ...form, valor_conta: floatValue || "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:5000/contas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        throw new Error("Erro ao enviar os dados");
      }

      const data = await res.json();
      console.log("Resposta do servidor:", data);

      alert("✅ Dados enviados com sucesso!");
      setForm({ data_conta: "", nome_conta: "", valor_conta: "" });
    } catch (err) {
      console.error("Erro:", err);
      alert("❌ Erro ao conectar com o servidor.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>informações de contas</h2>

      <input
        type="date"
        name="data_conta"
        value={form.data_conta}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="nome_conta"
        placeholder="Nome da conta"
        value={form.nome_conta}
        onChange={handleChange}
        required
      />

      <NumericFormat
        name="valor_conta"
        value={form.valor_conta}
        onValueChange={handleValorChange}
        thousandSeparator="."
        decimalSeparator=","
        prefix="R$ "
        placeholder="Valor"
        required
      />

      <button type="submit">Salvar</button>
    </form>
  );
}

export default Formulario;