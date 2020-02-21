import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Loader } from '~/componentes';
import Cabecalho from '~/componentes-sgp/cabecalho';
import Alert from '~/componentes/alert';
import Button from '~/componentes/button';
import Card from '~/componentes/card';
import { Colors } from '~/componentes/colors';
import ListaPaginada from '~/componentes/listaPaginada/listaPaginada';
import SelectComponent from '~/componentes/select';
import { URL_HOME } from '~/constantes/url';
import modalidade from '~/dtos/modalidade';
import { confirmar, erros, sucesso } from '~/servicos/alertas';
import history from '~/servicos/history';
import ServicoPendenciasFechamento from '~/servicos/Paginas/Fechamento/ServicoPendenciasFechamento';
import ServicoDisciplina from '~/servicos/Paginas/ServicoDisciplina';

const PendenciasFechamentoLista = () => {
  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const [exibirLista, setExibirLista] = useState(false);
  const [carregandoDisciplinas, setCarregandoDisciplinas] = useState(false);
  const [desabilitarDisciplina, setDesabilitarDisciplina] = useState(false);
  const [listaDisciplinas, setListaDisciplinas] = useState([]);
  const [pendenciasSelecionadas, setPendenciasSelecionadas] = useState([]);
  const [bimestreSelecionado, setBimestreSelecionado] = useState('');
  const [filtro, setFiltro] = useState({});
  const [listaBimestres, setListaBimestres] = useState([]);
  const [disciplinaIdSelecionada, setDisciplinaIdSelecionada] = useState(
    undefined
  );

  const montaExibicaoSituacao = pendencia => {
    // TODO Fazer estilo dos marcadores de situação quando retornar dados do backend!
    return pendencia;
  };

  const colunas = [
    {
      title: 'Componente curricular',
      dataIndex: 'componenteCurricular',
      width: '20%',
    },
    {
      title: 'Descrição',
      dataIndex: 'descricao',
      width: '60%',
    },
    {
      title: 'Situação',
      dataIndex: 'situacao',
      width: '20%',
      render: dados => montaExibicaoSituacao(dados),
    },
  ];

  const filtrar = useCallback(() => {
    const paramsFiltrar = {
      turmaId: turmaSelecionada.turma,
      disciplinaId: disciplinaIdSelecionada,
      bimestre: bimestreSelecionado,
    };
    setPendenciasSelecionadas([]);
    setFiltro({ ...paramsFiltrar });
  }, [disciplinaIdSelecionada, bimestreSelecionado, turmaSelecionada.turma]);

  const resetarFiltro = () => {
    setListaDisciplinas([]);
    setDisciplinaIdSelecionada(undefined);
    setDesabilitarDisciplina(false);
    setBimestreSelecionado(undefined);
  };

  useEffect(() => {
    const obterDisciplinas = async () => {
      setCarregandoDisciplinas(true);
      const disciplinas = await ServicoDisciplina.obterDisciplinasPorTurma(
        turmaSelecionada.turma
      ).catch(e => erros(e));

      if (disciplinas && disciplinas.data && disciplinas.data.length) {
        setListaDisciplinas(disciplinas.data);
      } else {
        setListaDisciplinas([]);
      }
      if (disciplinas && disciplinas.data && disciplinas.data.length === 1) {
        const disciplina = disciplinas.data[0];
        setDisciplinaIdSelecionada(
          String(disciplina.codigoComponenteCurricular)
        );
        setDesabilitarDisciplina(true);
      }
      setCarregandoDisciplinas(false);
    };

    if (turmaSelecionada.turma) {
      resetarFiltro();
      obterDisciplinas(turmaSelecionada.turma);
    } else {
      resetarFiltro();
    }

    let listaBi = [];
    if (turmaSelecionada.modalidade == modalidade.EJA) {
      listaBi = [
        { valor: 1, descricao: 'Primeiro bimestre' },
        { valor: 2, descricao: 'Segundo bimestre' },
      ];
    } else {
      listaBi = [
        { valor: 1, descricao: 'Primeiro bimestre' },
        { valor: 2, descricao: 'Segundo bimestre' },
        { valor: 3, descricao: 'Terceiro bimestre' },
        { valor: 4, descricao: 'Quarto bimestre' },
      ];
    }
    setListaBimestres(listaBi);
  }, [turmaSelecionada.turma, turmaSelecionada.modalidade]);

  useEffect(() => {
    if (disciplinaIdSelecionada) {
      setExibirLista(true);
    } else {
      setExibirLista(false);
    }
    filtrar();
  }, [disciplinaIdSelecionada, filtrar]);

  const onChangeDisciplinas = disciplinaId => {
    if (!disciplinaId) {
      setBimestreSelecionado(undefined);
    }
    setDisciplinaIdSelecionada(disciplinaId);
  };

  const onChangeBimestre = bimestre => {
    setBimestreSelecionado(bimestre);
  };

  const onClickEditar = pendencia => {
    history.push(`pendencias-fechamento/editar/${pendencia.id}`);
  };

  const onClickVoltar = () => {
    history.push(URL_HOME);
  };

  const onClickExcluir = async () => {
    if (pendenciasSelecionadas && pendenciasSelecionadas.length > 0) {
      const listaExcluir = pendenciasSelecionadas.map(
        item => item.nomeAtividade
      );
      const confirmadoParaExcluir = await confirmar(
        'Excluir pendência',
        listaExcluir,
        `Deseja realmente excluir ${
          pendenciasSelecionadas.length > 1
            ? 'estas pendências'
            : 'esta pendência'
        }?`,
        'Excluir',
        'Cancelar'
      );
      if (confirmadoParaExcluir) {
        const idsDeletar = pendenciasSelecionadas.map(c => c.id);
        const excluir = await ServicoPendenciasFechamento.deletar(
          idsDeletar
        ).catch(e => erros(e));
        if (excluir && excluir.status === 200) {
          const mensagemSucesso = `${
            pendenciasSelecionadas.length > 1
              ? 'Pendências excluídas'
              : 'Pendência excluída'
          } com sucesso.`;
          sucesso(mensagemSucesso);
          filtrar();
        }
      }
    }
  };

  const onSelecionarItems = items => {
    setPendenciasSelecionadas(items);
  };

  const onClickAprovar = () => {
    // TODO Chamar endpoint
    alert('Aprovar');
  };

  return (
    <>
      {usuario && turmaSelecionada.turma ? (
        ''
      ) : (
        <Alert
          alerta={{
            tipo: 'warning',
            id: 'pendencias-selecione-turma',
            mensagem: 'Você precisa escolher uma turma.',
            estiloTitulo: { fontSize: '18px' },
          }}
          className="mb-2"
        />
      )}
      <Cabecalho pagina="Análise de Pendências" />
      <Card>
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-12 d-flex justify-content-end pb-4">
              <Button
                label="Voltar"
                icon="arrow-left"
                color={Colors.Azul}
                border
                className="mr-2"
                onClick={onClickVoltar}
              />
              <Button
                label="Excluir"
                color={Colors.Vermelho}
                border
                className="mr-2"
                onClick={onClickExcluir}
                disabled={
                  pendenciasSelecionadas && pendenciasSelecionadas.length < 1
                }
              />
              <Button
                label="Aprovar"
                color={Colors.Roxo}
                border
                bold
                className="mr-2"
                onClick={onClickAprovar}
                disabled={
                  !turmaSelecionada.turma ||
                  (turmaSelecionada.turma && listaDisciplinas.length < 1) ||
                  (pendenciasSelecionadas && pendenciasSelecionadas.length < 1)
                }
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-2">
              <SelectComponent
                id="bimestre"
                name="bimestre"
                onChange={onChangeBimestre}
                valueOption="valor"
                valueText="descricao"
                lista={listaBimestres}
                placeholder="Selecione o bimestre"
                valueSelect={bimestreSelecionado}
              />
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-2">
              <Loader loading={carregandoDisciplinas} tip="">
                <SelectComponent
                  id="disciplina"
                  name="disciplinaId"
                  lista={listaDisciplinas}
                  valueOption="codigoComponenteCurricular"
                  valueText="nome"
                  valueSelect={disciplinaIdSelecionada}
                  onChange={onChangeDisciplinas}
                  placeholder="Selecione o componente curricular"
                  disabled={desabilitarDisciplina}
                />
              </Loader>
            </div>
          </div>
        </div>
        {exibirLista ? (
          <div className="col-md-12 pt-2">
            <ListaPaginada
              // TODO Ajustar URL quando tiver controller no backend!
              url="v1/fechamento/pendencias"
              id="lista-pendencias-fechamento"
              colunaChave="id"
              colunas={colunas}
              filtro={filtro}
              onClick={onClickEditar}
              multiSelecao
              selecionarItems={onSelecionarItems}
            />
          </div>
        ) : (
          ''
        )}
      </Card>
    </>
  );
};

export default PendenciasFechamentoLista;
