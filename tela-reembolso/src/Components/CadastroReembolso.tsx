import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { DatePickerComponent, ChangedEventArgs } from '@syncfusion/ej2-react-calendars';
import { NumericTextBoxComponent } from '@syncfusion/ej2-react-inputs';
import './CadastroReembolso.css';

const CadastroReembolso: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Date | null | undefined>(null);
  const [localOuCliente, setLocalOuCliente] = useState<string>('');
  const [idaEVolta, setIdaEVolta] = useState<number>();
  const [quilometragem, setQuilometragem] = useState<number>();
  const [descricao, setDescricao] = useState<string>('');
  const [alimentacao, setAlimentacao] = useState<string>('');
  const [valorAlimentacao, setValorAlimentacao] = useState<number>();
  const [idColaborador, setIdColaborador] = useState<number>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!data || !localOuCliente || !idColaborador) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const urlAPI = 'http://localhost:5043';
    const objetoReembolso = {
      alimentacao: alimentacao,
      data: data?.toJSON(),
      descricao: descricao,
      idColaborador: idColaborador,
      idReembolso: 0,
      localOuCliente: localOuCliente,
      valorAlimentacao: valorAlimentacao,
      valorIdaEVolta: idaEVolta,
      quilometragem: quilometragem,
    };

    try {
      const response = await axios.post(urlAPI + '/cadastroReembolso', objetoReembolso);
      console.log(response.data);
      navigate('/lista');
    } catch (error) {
      console.error('Erro ao cadastrar reembolso:', error);
    }
  };

  return (
    <div className="cadastro-reembolso">
      <h1>Cadastro de Reembolso</h1>
      <form onSubmit={handleSubmit}>
        <label>Data:</label>
        <DatePickerComponent placeholder="Selecione a data" format="dd/MM/yyyy" value={data === null ? undefined : data}
          onChange={(e: ChangedEventArgs) => setData(e.value)}/>

        <label>Local ou Cliente:</label>
        <TextBoxComponent value={localOuCliente} onChange={(e: { value: string; }) => setLocalOuCliente(e.value as string)} />

        <label>Ida e Volta:</label>
        <NumericTextBoxComponent value={idaEVolta} onChange={(e: { value: number; }) => setIdaEVolta(e.value as number)} />

        <label>Quilometragem:</label>
        <NumericTextBoxComponent value={quilometragem} onChange={(e: { value: number; }) => setQuilometragem(e.value as number)} />

        <label>Descrição:</label>
        <TextBoxComponent value={descricao} onChange={(e: { value: string; }) => setDescricao(e.value as string)} />

        <label>Alimentação:</label>
        <TextBoxComponent value={alimentacao} onChange={(e: { value: string; }) => setAlimentacao(e.value as string)} />

        <label>Valor Alimentação:</label>
        <NumericTextBoxComponent value={valorAlimentacao} onChange={(e: { value: number; }) => setValorAlimentacao(e.value as number)} />

        <label>Id Colaborador:</label>
        <NumericTextBoxComponent value={idColaborador} onChange={(e: { value: number; }) => setIdColaborador(e.value as number)} format="n0"/>

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default CadastroReembolso;
