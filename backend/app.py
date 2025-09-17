from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client, Client

app = Flask(__name__)
CORS(app)

SUPABASE_URL = "https://usoxqckciquaqkozuyht.supabase.co"
SUPABASE_KEY = "sb_secret_JKnC6rjLKgKFBPRl0FnWSw_WY3EKa1k"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route("/contas", methods=["GET"])
def contas():
    response = supabase.table("contas").select("*").execute()
    return jsonify(response.data)

@app.route("/contas", methods=["POST"])
def add_conta():
    data = request.get_json()
    nova_conta = {
        "data_conta": data.get("data_conta"),
        "nome_conta": data.get("nome_conta"),
        "valor_conta": data.get("valor_conta")
    }
    response = supabase.table("contas").insert(nova_conta).execute()
    return jsonify(response.data), 201

if __name__ == "__main__":
    app.run(debug=True)