from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client, Client
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Supabase config
SUPABASE_URL = "https://usoxqckciquaqkozuyht.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzb3hxY2tjaXF1YXFrb3p1eWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMjczNjYsImV4cCI6MjA3MzcwMzM2Nn0.kbnykDqaxy5KDTn069F_dG-N_oBkpQTajY-Mx2v2eEY"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ---------------------------
# GET com filtros
# ---------------------------
@app.route("/contas", methods=["GET"])
def contas():
    query = supabase.table("contas").select("*")

    nome = request.args.get("nome")
    data = request.args.get("data")
    valor = request.args.get("valor")
    data_inicio = request.args.get("data_inicio")
    data_fim = request.args.get("data_fim")

    if nome:
        query = query.ilike("nome_conta", f"%{nome}%")
    if data:
        query = query.eq("data_conta", data)
    if valor:
        query = query.eq("valor_conta", valor)
    if data_inicio and data_fim:
        query = query.gte("data_pagamento", data_inicio).lte("data_pagamento", data_fim)

    response = query.execute()
    return jsonify(response.data)

# ---------------------------
# POST - adicionar conta
# ---------------------------
@app.route("/contas", methods=["POST"])
def add_conta():
    data = request.get_json()
    nova_conta = {
        "data_conta": data.get("data_conta"),
        "nome_conta": data.get("nome_conta"),
        "valor_conta": data.get("valor_conta"),
        "status": "pendente",
        "data_pagamento": None
    }
    response = supabase.table("contas").insert(nova_conta).execute()
    return jsonify(response.data), 201

# ---------------------------
# PUT - pagar conta
# ---------------------------
@app.route("/contas/<int:conta_id>/pagar", methods=["PUT"])
def pagar_conta(conta_id):
    hoje = datetime.now().strftime("%Y-%m-%d")
    response = supabase.table("contas").update({
        "status": "pago",
        "data_pagamento": hoje
    }).eq("id", conta_id).execute()

    if response.data:
        return jsonify({"message": "Conta paga com sucesso!", "data_pagamento": hoje})
    return jsonify({"error": "Conta não encontrada"}), 404

if __name__ == "__main__":
    app.run(debug=True)