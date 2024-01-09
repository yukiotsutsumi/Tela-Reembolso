import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GridComponent, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-grids';
import './ListagemReembolsos.css';

interface Reembolso {
  idReembolso: number;
  data: string;
  localOuCliente: string;
  valorIdaEVolta: number;
  quilometragem: number;
  descricao: string;
  alimentacao: string;
  valorAlimentacao: number;
  idColaborador: number;
  nomeColaborador: string | null;
  valorTotal: number;
}

const ListagemReembolsos: React.FC = () => {
  const [reembolsos, setReembolsos] = useState<Reembolso[]>([]);
  const [valorTotal, setValorTotal] = useState<number>(0);
  const [nomesUsuarios, setNomesUsuarios] = useState<string[]>([]);
  const [nomeUsuarioSelecionado, setNomeUsuarioSelecionado] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<Reembolso[]>([]);

  const urlAPI = 'http://localhost:5043';
  
  useEffect(() => {
    const carregarReembolsos = async () => {
      try {
        const response = await axios.get<{ dados: { listaReembolsos: Reembolso[]; valorTotal: number } }>(urlAPI + '/listarReembolsos');
        const listaReembolsos = response.data.dados.listaReembolsos;

        const dataFormatada = listaReembolsos.map(apontamento => ({
          ...apontamento,
          data: formatarDataExibicao(apontamento.data)
        }));

        setReembolsos(dataFormatada);
        setValorTotal(response.data.dados.valorTotal);

        const nomesUnicos = Array.from(new Set(dataFormatada.map(reembolso => reembolso.nomeColaborador || 'N/A')));
        setNomesUsuarios(nomesUnicos);
      } catch (error) {
        console.error('Erro ao carregar reembolsos:', error);
      }
    };

    carregarReembolsos();
  }, []);

  useEffect(() => {
    const reembolsosFiltrados = nomeUsuarioSelecionado
      ? reembolsos.filter((reembolso) => reembolso.nomeColaborador === nomeUsuarioSelecionado || (nomeUsuarioSelecionado === 'N/A' && !reembolso.nomeColaborador))
      : reembolsos;

    setDataSource(reembolsosFiltrados);
  }, [reembolsos, nomeUsuarioSelecionado]);

  const handleUsuarioChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUserName = event.target.value;
    setNomeUsuarioSelecionado(selectedUserName !== '0' ? selectedUserName : null);
  };

  const atualizarValorTotal = () => {
    const total = dataSource.reduce((acc, reembolso) => acc + reembolso.valorTotal, 0);
    setValorTotal(total);
  };

  useEffect(() => {
    atualizarValorTotal();
  }, [dataSource]);

  function formatarDataExibicao(dateString: string) {
    const data = new Date(dateString);
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  return (
    <div className="listagem-reembolsos">
      <h1>Listagem de Reembolsos</h1>
      <label htmlFor="usuarios">Selecione um usuário:</label>
      <select id="usuarios" onChange={handleUsuarioChange} value={nomeUsuarioSelecionado || '0'}>
        <option value="0">Todos os usuários</option>
        {nomesUsuarios.map((nomeUsuario, index) => (
          <option key={index} value={nomeUsuario}>
            {nomeUsuario}
          </option>
        ))}
      </select>
      <GridComponent dataSource={dataSource}>
        <ColumnsDirective>
          <ColumnDirective field='idReembolso' headerText='ID Reembolso'></ColumnDirective>
          <ColumnDirective field='data' headerText='Data'></ColumnDirective>
          <ColumnDirective field='localOuCliente' headerText='Local ou Cliente'></ColumnDirective>
          <ColumnDirective field='valorIdaEVolta' headerText='Ida e Volta'></ColumnDirective>
          <ColumnDirective field='quilometragem' headerText='Quilometragem'></ColumnDirective>
          <ColumnDirective field='descricao' headerText='Descrição'></ColumnDirective>
          <ColumnDirective field='alimentacao' headerText='Alimentação'></ColumnDirective>
          <ColumnDirective field='valorAlimentacao' headerText='Valor Alimentação'></ColumnDirective>
          <ColumnDirective field='idColaborador' headerText='ID Colaborador'></ColumnDirective>
          <ColumnDirective field='nomeColaborador' headerText='Nome Colaborador'></ColumnDirective>
          <ColumnDirective field='valorTotal' headerText='Valor Total'></ColumnDirective>
        </ColumnsDirective>
      </GridComponent>
      <p>Valor Total: {valorTotal}</p>
    </div>
  );
};

export default ListagemReembolsos;
