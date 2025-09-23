import { useEffect, useState } from "react";
import Headerp from "../src/components/headerp";
import Formulario from "./components/formulario";
import ListaContas from "./components/listar_contas";
import TabelaContasMui from "../src/components/tabela"

function App() {
  const [contas, setContas] = useState([]);

  useEffect(() => {
    fetch("https://finance-bflm.onrender.com/contas")
      .then(res => res.json())
      .then(data => setContas(data));
  }, []);

  return (
    
    <div>
      <Headerp/>

      <span>
        <Formulario/>
      </span>

      <div>
        <ListaContas/>
      </div>

      <TabelaContasMui contas={contas} />

    




    </div>

    
    
  );
}

export default App;