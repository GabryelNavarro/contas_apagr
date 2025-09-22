import * as React from "react";
import {
  DataGrid,
  GridToolbar,
  useGridApiRef,
  gridFilteredSortedRowIdsSelector,
  gridRowsLookupSelector,
} from "@mui/x-data-grid";
import "../components/style/div-tabela.css";
import "../components/style/reset.css";

export default function TabelaContasMui({ contas }) {
  const apiRef = useGridApiRef();
  const [total, setTotal] = React.useState(0);

  React.useEffect(() => {
    if (!apiRef.current) return;

    const updateTotal = () => {
      const visibleRowIds = gridFilteredSortedRowIdsSelector(apiRef);
      const rowLookup = gridRowsLookupSelector(apiRef);

      const soma = visibleRowIds.reduce((acc, id) => {
        const row = rowLookup[id];
        return acc + (row?.valor_conta || 0);
      }, 0);

      setTotal(soma);
    };

    // Atualiza sempre que algo mudar na grid
    const unsubscribe = apiRef.current.subscribeEvent("stateChange", updateTotal);

    // Atualiza na primeira renderização
    updateTotal();

    return () => unsubscribe();
  }, [apiRef]);

  const columns = [
    { field: "data_conta", headerName: "Data Conta", width: 130 },
    { field: "nome_conta", headerName: "Nome Conta", width: 200 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "data_pagamento", headerName: "Data Pagamento", width: 150 },
  ];

  return (
    <div className="div-tabela">
      <h2> Gastos Financeiros</h2>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          apiRef={apiRef}
          rows={contas}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
          filterMode="client"
          components={{ Toolbar: GridToolbar }}
        />
      </div>

      <div
        className="total"
    
      >
        Total filtrado:{" "}
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(total)}
      </div>
    </div>
  );
}