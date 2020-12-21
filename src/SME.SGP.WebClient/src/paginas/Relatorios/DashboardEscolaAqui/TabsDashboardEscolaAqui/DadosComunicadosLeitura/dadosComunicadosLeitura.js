import * as moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  CampoData,
  Loader,
  SelectAutocomplete,
  SelectComponent,
} from '~/componentes';
import Alert from '~/componentes/alert';
import { ModalidadeDTO } from '~/dtos';
import {
  limparDadosDashboardEscolaAqui,
  setDadosDeLeituraDeComunicadosAgrupadosPorModalidade,
} from '~/redux/modulos/dashboardEscolaAqui/actions';
import { AbrangenciaServico, api, erros } from '~/servicos';
import ServicoFiltroRelatorio from '~/servicos/Paginas/FiltroRelatorio/ServicoFiltroRelatorio';
import ServicoDashboardEscolaAqui from '~/servicos/Paginas/Relatorios/EscolaAqui/DashboardEscolaAqui/ServicoDashboardEscolaAqui';
import {
  mapearParaDtoGraficoPizzaComValorEPercentual,
  obterDadosComunicadoSelecionado,
} from '../../dashboardEscolaAquiGraficosUtils';
import DataUltimaAtualizacaoDashboardEscolaAqui from '../ComponentesDashboardEscolaAqui/dataUltimaAtualizacaoDashboardEscolaAqui';
import GraficoPizzaDashboardEscolaAqui from '../ComponentesDashboardEscolaAqui/graficoPizzaDashboardEscolaAqui';
import LeituraDeComunicadosAgrupadosPorDre from './leituraDeComunicadosAgrupadosPorDre';
import LeituraDeComunicadosPorModalidades from './leituraDeComunicadosPorModalidades';
import LeituraDeComunicadosPorModalidadesETurmas from './leituraDeComunicadosPorModalidadesETurmas';
import LeituraDeComunicadosPorTurmas from './leituraDeComunicadosPorTurmas';

const DadosComunicadosLeitura = props => {
  const { codigoDre, codigoUe } = props;

  const dispatch = useDispatch();

  const [exibirLoader, setExibirLoader] = useState(false);

  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [anoLetivo, setAnoLetivo] = useState();

  const [carregandoModalidades, setCarregandoModalidades] = useState(false);
  const [listaModalidades, setListaModalidades] = useState([]);
  const [modalidadeId, setModalidadeId] = useState();

  const [carregandoSemestres, setCarregandoSemestres] = useState(false);
  const [listaSemestres, setListaSemestres] = useState([]);
  const [semestre, setSemestre] = useState();

  const [carregandoAnosEscolares, setCarregandoAnosEscolares] = useState(false);
  const [listaAnosEscolares, setListaAnosEscolares] = useState([]);
  const [anosEscolares, setAnosEscolares] = useState(undefined);

  const [listaGrupo, setListaGrupo] = useState([]);
  const [grupo, setGrupo] = useState();

  const [dataInicio, setDataInicio] = useState();
  const [dataFim, setDataFim] = useState();

  const [carregandoTurmas, setCarregandoTurmas] = useState(false);
  const [codigoTurma, setCodigoTurma] = useState();
  const [listaTurmas, setListaTurmas] = useState([]);

  const [carrecandoComunicado, setCarrecandoComunicado] = useState(false);
  const [listaComunicado, setListaComunicado] = useState([]);
  const [comunicado, setComunicado] = useState();
  const [pesquisaComunicado, setPesquisaComunicado] = useState('');

  const [
    dadosDeLeituraDeComunicados,
    setDadosDeLeituraDeComunicados,
  ] = useState([]);

  const [timeoutCampoPesquisa, setTimeoutCampoPesquisa] = useState();

  // TODO Verificar no componente de gráficos outra forma de fazer!
  const chavesGrafico = [
    'Usuários que não receberam o comunicado (CPF válido porém que não tem o APP instalado)',
    'Usuário que receberam o comunicado e ainda não visualizaram',
    'Visualizaram o comunicado',
  ];

  const [listaVisualizacao] = useState([
    {
      valor: '1',
      descricao: 'Responsáveis',
    },
    {
      valor: '2',
      descricao: 'Estudantes',
    },
  ]);
  const [visualizacao, setVisualizacao] = useState('1');

  const OPCAO_TODOS = '-99';

  const obterAnosLetivos = useCallback(async () => {
    setExibirLoader(true);
    const anosLetivo = await AbrangenciaServico.buscarTodosAnosLetivos()
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (anosLetivo?.data?.length) {
      const a = [];
      anosLetivo.data.forEach(ano => {
        a.push({ desc: ano, valor: ano });
      });
      setAnoLetivo(a[0].valor);
      setListaAnosLetivo(a);
    } else {
      setListaAnosLetivo([]);
    }
  }, []);

  const obterListaGrupos = async () => {
    const resposta = await api
      .get('v1/comunicacao/grupos/listar')
      .catch(e => erros(e));

    if (resposta?.data?.length) {
      const lista = resposta.data.map(g => {
        return {
          valor: g.id,
          desc: g.nome,
        };
      });

      if (lista.length > 1) {
        lista.unshift({ valor: OPCAO_TODOS, desc: 'Todos' });
      }
      if (lista?.length === 1) {
        setGrupo([lista[0].valor]);
      }

      setListaGrupo(lista);
    } else {
      setListaGrupo([]);
    }
  };

  useEffect(() => {
    obterAnosLetivos();
    obterListaGrupos();
  }, [obterAnosLetivos]);

  const obterModalidades = async (ue, ano) => {
    if (ue && ano) {
      setCarregandoModalidades(true);
      const resposta = await api
        .get(`/v1/ues/${ue}/modalidades?ano=${ano}`)
        .catch(e => erros(e))
        .finally(() => setCarregandoModalidades(false));

      if (resposta?.data?.length) {
        const lista = resposta.data.map(item => ({
          desc: item.nome,
          valor: String(item.id),
        }));

        if (lista && lista.length && lista.length === 1) {
          setModalidadeId(lista[0].valor);
        }
        setListaModalidades(lista);
      } else {
        setListaModalidades([]);
      }
    }
  };

  useEffect(() => {
    setModalidadeId();
    if (anoLetivo && codigoUe && codigoUe !== OPCAO_TODOS) {
      obterModalidades(codigoUe, anoLetivo);
    } else {
      setListaModalidades([]);
    }
  }, [anoLetivo, codigoUe]);

  const obterAnosEscolares = useCallback(async (mod, ue) => {
    setCarregandoAnosEscolares(true);
    const respota = await ServicoFiltroRelatorio.obterAnosEscolares(ue, mod)
      .catch(e => erros(e))
      .finally(() => setCarregandoAnosEscolares(false));

    if (respota?.data?.length) {
      setListaAnosEscolares(respota.data);

      if (respota.data && respota.data.length && respota.data.length === 1) {
        setAnosEscolares(respota.data[0].valor);
      }
    } else {
      setListaAnosEscolares([]);
    }
  }, []);

  useEffect(() => {
    if (modalidadeId && codigoUe && codigoUe !== OPCAO_TODOS) {
      obterAnosEscolares(modalidadeId, codigoUe);
    } else {
      setAnosEscolares(undefined);
      setListaAnosEscolares([]);
    }
  }, [modalidadeId, obterAnosEscolares]);

  const obterSemestres = async (
    modalidadeSelecionada,
    anoLetivoSelecionado
  ) => {
    setCarregandoSemestres(true);
    const retorno = await api.get(
      `v1/abrangencias/false/semestres?anoLetivo=${anoLetivoSelecionado}&modalidade=${modalidadeSelecionada ||
        0}`
    );
    if (retorno && retorno.data) {
      const lista = retorno.data.map(periodo => {
        return { desc: periodo, valor: periodo };
      });

      if (lista && lista.length && lista.length === 1) {
        setSemestre(lista[0].valor);
      }
      setListaSemestres(lista);
    }
    setCarregandoSemestres(false);
  };

  useEffect(() => {
    if (
      modalidadeId &&
      anoLetivo &&
      String(modalidadeId) === String(ModalidadeDTO.EJA)
    ) {
      obterSemestres(modalidadeId, anoLetivo);
    } else {
      setSemestre();
      setListaSemestres([]);
    }
  }, [modalidadeId, anoLetivo]);

  const obterTurmas = useCallback(async (modalidadeSelecionada, ue, ano) => {
    if (ue && modalidadeSelecionada) {
      setCarregandoTurmas(true);
      const resultado = await AbrangenciaServico.buscarTurmas(
        ue,
        modalidadeSelecionada,
        '',
        ano
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoTurmas(false));

      if (resultado?.data?.length) {
        const lista = resultado.data.map(item => ({
          desc: item.nome,
          valor: item.codigo,
        }));
        setListaTurmas(lista);

        if (lista && lista.length && lista.length === 1) {
          setCodigoTurma(lista[0].valor);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (codigoUe && codigoUe !== OPCAO_TODOS && modalidadeId && anoLetivo) {
      obterTurmas(modalidadeId, codigoUe, anoLetivo);
    } else {
      setCodigoTurma();
      setListaTurmas([]);
    }
  }, [modalidadeId, obterTurmas]);

  useEffect(() => {
    if (codigoUe === OPCAO_TODOS) {
      setCodigoTurma();
      setListaTurmas([]);
    }
  }, [codigoUe]);

  const desabilitarData = current => {
    if (current) {
      return (
        current < moment().startOf('year') || current > moment().endOf('year')
      );
    }
    return false;
  };

  const handleSearch = descricao => {
    if (descricao.length > 3 || descricao.length === 0) {
      if (timeoutCampoPesquisa) {
        clearTimeout(timeoutCampoPesquisa);
      }
      const timeout = setTimeout(() => {
        setPesquisaComunicado(descricao);
      }, 500);
      setTimeoutCampoPesquisa(timeout);
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    (async () => {
      if (isSubscribed && anoLetivo && codigoDre && codigoUe) {
        if (
          modalidadeId &&
          String(modalidadeId) === String(ModalidadeDTO.EJA) &&
          !semestre
        ) {
          return;
        }

        const todosGrupos =
          grupo && grupo[0] === OPCAO_TODOS
            ? listaGrupo
                .filter(item => item.valor !== OPCAO_TODOS)
                .map(g => g.valor)
            : grupo;

        setCarrecandoComunicado(true);
        const resposta = await ServicoDashboardEscolaAqui.obterComunicadosAutoComplete(
          anoLetivo || '',
          codigoDre === OPCAO_TODOS ? '' : codigoDre || '',
          codigoUe === OPCAO_TODOS ? '' : codigoUe || '',
          todosGrupos,
          modalidadeId || '',
          semestre || '',
          anosEscolares === OPCAO_TODOS ? '' : anosEscolares || '',
          codigoTurma || '',
          dataInicio || '',
          dataFim || '',
          pesquisaComunicado || ''
        )
          .catch(e => erros(e))
          .finally(() => setCarrecandoComunicado(false));

        if (resposta?.data?.length) {
          const lista = resposta.data.map(item => {
            return {
              ...item,
              descricao: `${item.titulo} - ${moment(item.dataEnvio).format(
                'DD/MM/YYYY'
              )}`,
            };
          });
          setListaComunicado([]);
          setListaComunicado(lista);
        } else {
          setListaComunicado([]);
          setComunicado();
          setPesquisaComunicado();
        }
      }
    })();

    return () => {
      isSubscribed = false;
    };
  }, [
    anoLetivo,
    codigoDre,
    codigoUe,
    grupo,
    modalidadeId,
    semestre,
    anosEscolares,
    codigoTurma,
    dataInicio,
    dataFim,
    pesquisaComunicado,
    listaGrupo,
  ]);

  const mapearParaDtoGraficoPizza = dados => {
    const dadosParaMapear = [];

    if (dados.naoReceberamComunicado) {
      const naoReceberamComunicado = {
        label: chavesGrafico[0],
        value: dados.naoReceberamComunicado || 0,
      };
      dadosParaMapear.push(naoReceberamComunicado);
    }

    if (dados.receberamENaoVisualizaram) {
      const receberamENaoVisualizaram = {
        label: chavesGrafico[1],
        value: dados.receberamENaoVisualizaram || 0,
      };
      dadosParaMapear.push(receberamENaoVisualizaram);
    }

    if (dados.visualizaramComunicado) {
      const visualizaramComunicado = {
        label: chavesGrafico[2],
        value: dados.visualizaramComunicado || 0,
      };
      dadosParaMapear.push(visualizaramComunicado);
    }

    const dadosMapeados = mapearParaDtoGraficoPizzaComValorEPercentual(
      dadosParaMapear
    );
    return dadosMapeados;
  };

  const obterDadosDeLeituraDeComunicados = useCallback(async () => {
    const dadosComunicado = obterDadosComunicadoSelecionado(
      comunicado,
      listaComunicado
    );
    if (dadosComunicado?.id) {
      setExibirLoader(true);

      dispatch(setDadosDeLeituraDeComunicadosAgrupadosPorModalidade([]));
      const resposta = await ServicoDashboardEscolaAqui.obterDadosDeLeituraDeComunicados(
        dadosComunicado.codigoDre || '',
        dadosComunicado.codigoUe || '',
        dadosComunicado.id,
        visualizacao
      )
        .catch(e => erros(e))
        .finally(() => setExibirLoader(false));

      if (resposta?.data) {
        const dados = mapearParaDtoGraficoPizza(resposta.data[0]);
        setDadosDeLeituraDeComunicados(dados);
      } else {
        setDadosDeLeituraDeComunicados([]);
      }
    } else {
      setDadosDeLeituraDeComunicados([]);
    }
  }, [codigoDre, codigoUe, visualizacao, comunicado, listaComunicado]);

  useEffect(() => {
    if (visualizacao && comunicado && listaComunicado.length) {
      obterDadosDeLeituraDeComunicados();
    }
  }, [
    comunicado,
    visualizacao,
    listaComunicado,
    obterDadosDeLeituraDeComunicados,
  ]);

  useEffect(() => {
    if (!comunicado) {
      setDadosDeLeituraDeComunicados([]);
    }
  }, [comunicado]);

  useEffect(() => {
    dispatch(limparDadosDashboardEscolaAqui([]));
    return () => {
      dispatch(limparDadosDashboardEscolaAqui([]));
    };
  }, [dispatch]);

  return (
    <>
      {!comunicado ? (
        <Alert
          alerta={{
            tipo: 'warning',
            id: 'selecionar-comunicado',
            mensagem:
              'Você precisa selecionar um comunicado para visualizar os dados de leitura',
            estiloTitulo: { fontSize: '18px' },
          }}
          className="mb-2"
        />
      ) : (
        ''
      )}
      <Loader loading={exibirLoader}>
        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-3 col-xl-2 mb-2">
            <SelectComponent
              id="select-ano-letivo"
              label="Ano Letivo"
              lista={listaAnosLetivo}
              valueOption="valor"
              valueText="desc"
              disabled={listaAnosLetivo?.length === 1}
              onChange={setAnoLetivo}
              valueSelect={anoLetivo}
              placeholder="Selecione o ano"
              allowClear={false}
            />
          </div>
          <div className="col-sm-12 col-md-6 col-lg-6 col-xl-4 mb-2">
            <SelectComponent
              id="select-grupo"
              label="Grupo"
              lista={listaGrupo}
              valueOption="valor"
              valueText="desc"
              valueSelect={grupo}
              placeholder="Selecione o grupo"
              multiple
              onChange={valores => {
                const opcaoTodosJaSelecionado = grupo
                  ? grupo.includes(OPCAO_TODOS)
                  : false;
                if (opcaoTodosJaSelecionado) {
                  const listaSemOpcaoTodos = valores.filter(
                    v => v !== OPCAO_TODOS
                  );
                  setGrupo(listaSemOpcaoTodos);
                } else if (valores.includes(OPCAO_TODOS)) {
                  setGrupo([OPCAO_TODOS]);
                } else {
                  setGrupo(valores);
                }
              }}
            />
          </div>
          <div className="col-sm-12 col-md-6 col-lg-3 col-xl-3  mb-2">
            <Loader loading={carregandoModalidades} tip="">
              <SelectComponent
                id="select-modalidade"
                label="Modalidade"
                lista={listaModalidades}
                valueOption="valor"
                valueText="desc"
                onChange={setModalidadeId}
                valueSelect={modalidadeId}
                placeholder="Modalidade"
                disabled={
                  codigoUe === OPCAO_TODOS || listaModalidades?.length === 1
                }
              />
            </Loader>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-3 col-xl-3 mb-2">
            <Loader loading={carregandoSemestres} tip="">
              <SelectComponent
                id="select-semestre"
                lista={listaSemestres}
                valueOption="valor"
                valueText="desc"
                label="Semestre"
                disabled={
                  !modalidadeId ||
                  (listaSemestres && listaSemestres.length === 1) ||
                  String(modalidadeId) !== String(ModalidadeDTO.EJA)
                }
                valueSelect={semestre}
                onChange={setSemestre}
                placeholder="Semestre"
              />
            </Loader>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-2">
            <Loader loading={carregandoAnosEscolares} tip="">
              <SelectComponent
                id="select-ano-escolar"
                lista={listaAnosEscolares}
                valueOption="valor"
                valueText="descricao"
                label="Ano"
                disabled={
                  !modalidadeId ||
                  codigoUe === OPCAO_TODOS ||
                  listaAnosEscolares?.length === 1
                }
                valueSelect={anosEscolares}
                onChange={setAnosEscolares}
                placeholder="Selecione o ano"
              />
            </Loader>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-3 col-xl-3 mb-2">
            <Loader loading={carregandoTurmas} tip="">
              <SelectComponent
                id="select-turma"
                lista={listaTurmas}
                valueOption="valor"
                valueText="desc"
                label="Turma"
                disabled={
                  codigoUe === OPCAO_TODOS ||
                  !modalidadeId ||
                  (listaTurmas && listaTurmas.length === 1)
                }
                valueSelect={codigoTurma}
                onChange={setCodigoTurma}
                placeholder="Turma"
              />
            </Loader>
          </div>

          <div className="col-sm-12 col-md-6 col-lg-3 col-xl-3 pb-2">
            <CampoData
              if="data-inicio"
              label="Data de envio início"
              placeholder="DD/MM/AAAA"
              formatoData="DD/MM/YYYY"
              onChange={setDataInicio}
              desabilitarData={desabilitarData}
              valor={dataInicio}
            />
          </div>
          <div className="col-sm-12 col-md-6 col-lg-3 col-xl-3 pb-2">
            <CampoData
              id="data-fim"
              label="Data de envio fim"
              placeholder="DD/MM/AAAA"
              formatoData="DD/MM/YYYY"
              onChange={setDataFim}
              desabilitarData={desabilitarData}
              valor={dataFim}
            />
          </div>
          <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-2">
            <Loader loading={carrecandoComunicado} tip="">
              <SelectAutocomplete
                id="autocomplete-comunicados"
                label="Comunicado"
                showList
                isHandleSearch
                placeholder="Selecione um comunicado"
                className="col-md-12"
                lista={listaComunicado}
                valueField="id"
                textField="descricao"
                onSelect={setComunicado}
                onChange={setComunicado}
                handleSearch={handleSearch}
                value={comunicado}
              />
            </Loader>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-3 col-xl-3 mb-2">
            <SelectComponent
              lista={listaVisualizacao}
              valueOption="valor"
              valueText="descricao"
              label="Visualização"
              valueSelect={visualizacao}
              onChange={setVisualizacao}
              placeholder="Selecione a visualização"
              allowClear={false}
            />
          </div>
          {dadosDeLeituraDeComunicados?.length ? (
            <div className="col-md-12 mt-5">
              <DataUltimaAtualizacaoDashboardEscolaAqui
                nomeConsulta="ConsolidarLeituraNotificacao"
                tituloAdicional="Os dados estão considerando a situação atual dos estudantes e responsáveis"
              />
            </div>
          ) : (
            ''
          )}

          <div className="col-md-12">
            {dadosDeLeituraDeComunicados?.length ? (
              <GraficoPizzaDashboardEscolaAqui
                titulo="Dados de leitura"
                dadosGrafico={dadosDeLeituraDeComunicados}
              />
            ) : (
              ''
            )}
          </div>
          {dadosDeLeituraDeComunicados?.length ? (
            <LeituraDeComunicadosAgrupadosPorDre
              chavesGrafico={chavesGrafico}
              modoVisualizacao={visualizacao}
              comunicado={comunicado}
              listaComunicado={listaComunicado}
            />
          ) : (
            ''
          )}
          {dadosDeLeituraDeComunicados?.length ? (
            <LeituraDeComunicadosPorModalidades
              chavesGrafico={chavesGrafico}
              modoVisualizacao={visualizacao}
              comunicado={comunicado}
              listaComunicado={listaComunicado}
            />
          ) : (
            ''
          )}
          {dadosDeLeituraDeComunicados?.length ? (
            <LeituraDeComunicadosPorModalidadesETurmas
              chavesGrafico={chavesGrafico}
              modoVisualizacao={visualizacao}
              comunicado={comunicado}
              listaComunicado={listaComunicado}
            />
          ) : (
            ''
          )}
          {dadosDeLeituraDeComunicados?.length ? (
            <LeituraDeComunicadosPorTurmas
              chavesGrafico={chavesGrafico}
              modoVisualizacao={visualizacao}
              comunicado={comunicado}
              listaComunicado={listaComunicado}
            />
          ) : (
            ''
          )}
        </div>
      </Loader>
    </>
  );
};

DadosComunicadosLeitura.propTypes = {
  codigoDre: PropTypes.oneOfType([PropTypes.string]),
  codigoUe: PropTypes.oneOfType([PropTypes.string]),
};

DadosComunicadosLeitura.defaultProps = {
  codigoDre: '',
  codigoUe: '',
};

export default DadosComunicadosLeitura;