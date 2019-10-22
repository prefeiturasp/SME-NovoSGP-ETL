import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Card from '~/componentes/card';
import Grid from '~/componentes/grid';
import Button from '~/componentes/button';
import { Base, Colors } from '~/componentes/colors';
import SelectComponent from '~/componentes/select';
import history from '~/servicos/history';
import { confirmar } from '~/servicos/alertas';
import ListaPaginada from '~/componentes/listaPaginada/listaPaginada';
import api from '~/servicos/api';

const TipoEventosLista = () => {
  const Div = styled.div`
    .select-local {
      max-width: 185px;
    }
  `;

  const Titulo = styled(Div)`
    color: ${Base.CinzaMako};
    font-size: 24px;
  `;

  const Icone = styled.i`
    color: ${Base.CinzaMako};
    cursor: pointer;
  `;

  const Busca = styled(Icone)`
    left: 10px;
    max-height: 25px;
    max-width: 15px;
    padding: 1rem;
    right: 0;
    top: -2px;
  `;

  const CampoTexto = styled.input`
    color: ${Base.CinzaBotao};
    font-size: 14px;
    padding-left: 40px;
    &[type='radio'] {
      background: ${Base.Branco};
      border: 1px solid ${Base.CinzaDesabilitado};
    }
  `;

  const [linhasSelecionadas, setLinhasSelecionadas] = useState([]);

  const clicouBotaoVoltar = () => {
    history.push('/');
  };

  const clicouBotaoExcluir = async () => {
    const confirmado = await confirmar(
      'Atenção',
      'Você tem certeza que deseja excluir estes itens?'
    );
    if (confirmado) {
      console.log(linhasSelecionadas);
      api.delete('v1/evento/tipo', linhasSelecionadas).then(resposta => {
        console.log(resposta);
      });
    }
  };

  const clicouBotaoNovo = () => {
    history.push('/calendario-escolar/tipo-eventos/novo');
  };

  const clicouBotaoEditar = tipoEvento => {
    history.push(
      `/calendario-escolar/tipo-eventos/editar/${tipoEvento.codigo}`
    );
  };

  const listaLetivo = [
    { valor: 1, descricao: 'Sim' },
    { valor: 2, descricao: 'Não' },
    { valor: 3, descricao: 'Opcional' },
  ];

  const listaLocalOcorrencia = [
    { valor: 1, descricao: 'UE' },
    { valor: 2, descricao: 'DRE' },
    { valor: 3, descricao: 'SME' },
    { valor: 4, descricao: 'SME/UE' },
    { valor: 5, descricao: 'Todos' },
  ];

  const colunas = [
    {
      title: 'Tipo de Evento',
      dataIndex: 'descricao',
      key: 'descricao',
      className: 'text-left px-4',
    },
    {
      title: 'Local de ocorrência',
      dataIndex: 'localOcorrencia',
      key: 'localOcorrencia',
      className: 'text-left px-4',
      render: localOcorrencia =>
        listaLocalOcorrencia.filter(l => l.valor === localOcorrencia)[0]
          .descricao,
    },
    {
      title: 'Letivo',
      dataIndex: 'letivo',
      key: 'letivo',
      className: 'text-left px-4',
      render: letivo =>
        listaLetivo.filter(l => l.valor === letivo)[0].descricao,
    },
  ];

  const botaoExcluirRef = useRef();

  const [filtro, setFiltro] = useState({});
  const [
    localOcorrenciaSelecionado,
    setLocalOcorrenciaSelecionado,
  ] = useState();

  // useEffect(() => {
  //   if (linhasSelecionadas.length > 0) botaoExcluirRef.current.disabled = false;
  // }, [linhasSelecionadas]);

  const aoSelecionarLocalOcorrencia = local => {
    setLocalOcorrenciaSelecionado(local);
  };
  const [letivoSelecionado, setLetivoSelecionado] = useState();

  const aoSelecionarLetivo = letivo => {
    setLetivoSelecionado(letivo);
  };

  const aoDigitarNomeTipoEvento = () => {};

  const aoSelecionarLinhas = items => {
    setLinhasSelecionadas(items.map(item => item.codigo));
  };

  return (
    <Div className="col-12">
      <Grid cols={12} className="mb-1 p-0">
        <Titulo className="font-weight-bold">Tipo de Eventos</Titulo>
      </Grid>
      <Card className="rounded" mx="mx-auto">
        <Div className="row w-100 mx-auto mb-5">
          <Div className="col-3" style={{ maxWidth: '20%' }}>
            <SelectComponent
              placeholder="Local de ocorrência"
              valueOption="valor"
              valueText="descricao"
              lista={listaLocalOcorrencia}
              valueSelect={localOcorrenciaSelecionado}
              onChange={aoSelecionarLocalOcorrencia}
              className="select-local"
            />
          </Div>
          <Div className="col-2">
            <SelectComponent
              placeholder="Letivo"
              valueOption="valor"
              valueText="descricao"
              lista={listaLetivo}
              valueSelect={letivoSelecionado}
              onChange={aoSelecionarLetivo}
            />
          </Div>
          <Div className="col-4 position-relative">
            <Busca className="fa fa-search fa-lg bg-transparent position-absolute text-center" />
            <CampoTexto
              className="form-control form-control-lg"
              placeholder="Digite o nome do tipo de evento"
              onChange={aoDigitarNomeTipoEvento}
            />
          </Div>
          <Div
            className="col-3 d-flex justify-content-end"
            style={{ flex: '0 0 30%', maxWidth: '30%', width: '30%' }}
          >
            <Button
              label="Voltar"
              Icone="arrow-left"
              color={Colors.Azul}
              onClick={clicouBotaoVoltar}
              border
              className="mr-3"
            />
            <Button
              label="Excluir"
              color={Colors.Roxo}
              onClick={clicouBotaoExcluir}
              disabled
              border
              bold
              ref={botaoExcluirRef}
              className="mr-3"
            />
            <Button
              label="Novo"
              color={Colors.Roxo}
              onClick={clicouBotaoNovo}
              bold
            />
          </Div>
        </Div>
        <Grid cols={12} className="mb-4">
          <ListaPaginada
            url="v1/evento/tipo/listar"
            colunas={colunas}
            colunaChave="codigo"
            filtro={filtro}
            onClick={clicouBotaoEditar}
            multiSelecao
            selecionarItems={aoSelecionarLinhas}
          />
        </Grid>
      </Card>
    </Div>
  );
};

export default TipoEventosLista;
