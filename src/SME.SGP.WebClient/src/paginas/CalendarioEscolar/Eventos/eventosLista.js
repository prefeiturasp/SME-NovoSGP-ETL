import { Form, Formik } from 'formik';
import * as moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import Cabecalho from '~/componentes-sgp/cabecalho';
import Button from '~/componentes/button';
import { CampoData, momentSchema } from '~/componentes/campoData/campoData';
import CampoTexto from '~/componentes/campoTexto';
import Card from '~/componentes/card';
import { Colors } from '~/componentes/colors';
import ListaPaginada from '~/componentes/listaPaginada/listaPaginada';
import SelectComponent from '~/componentes/select';
import { URL_HOME } from '~/constantes/url';
import RotasDto from '~/dtos/rotasDto';
import { confirmar, erros, sucesso, erro } from '~/servicos/alertas';
import api from '~/servicos/api';
import history from '~/servicos/history';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';
import Grid from '~/componentes/grid';
import Alert from '~/componentes/alert';
import ServicoEvento from '~/servicos/Paginas/Calendario/ServicoEvento';
import FiltroHelper from '~/componentes-sgp/filtro/helper';
import tipoEscolaDTO from '~/dtos/tipoEscolaDto';
import { Loader } from '~/componentes';

const EventosLista = () => {
  const usuario = useSelector(store => store.usuario);
  const permissoesTela = usuario.permissoes[RotasDto.EVENTOS];

  const [somenteConsulta, setSomenteConsulta] = useState(false);

  const [listaCalendarioEscolar, setListaCalendarioEscolar] = useState([]);
  const [listaDre, setlistaDre] = useState([]);
  const [campoUeDesabilitado, setCampoUeDesabilitado] = useState(true);
  const [dreSelecionada, setDreSelecionada] = useState();
  const [listaUe, setListaUe] = useState([]);
  const [nomeEvento, setNomeEvento] = useState('');
  const [listaTipoEvento, setListaTipoEvento] = useState([]);
  const [tipoEvento, setTipoEvento] = useState(undefined);
  const [mensagemAlerta, setMesangemAlerta] = useState(false);
  const [eventosSelecionados, setEventosSelecionados] = useState([]);
  const [filtro, setFiltro] = useState({});
  const [selecionouCalendario, setSelecionouCalendario] = useState(false);

  const [carregandoTipos, setCarregandoTipos] = useState(false);

  const [refForm, setRefForm] = useState();

  const [valoresIniciais] = useState({
    tipoCalendarioId: undefined,
    dreId: undefined,
    ueId: undefined,
    dataInicio: '',
    dataFim: '',
  });

  const [validacoes] = useState(
    Yup.object({
      dataInicio: momentSchema.test(
        'validaInicio',
        'Data obrigatória',
        function validar() {
          const { dataInicio } = this.parent;
          const { dataFim } = this.parent;
          if (!dataInicio && dataFim) {
            return false;
          }
          return true;
        }
      ),
      dataFim: momentSchema.test(
        'validaFim',
        'Data obrigatória',
        function validar() {
          const { dataInicio } = this.parent;
          const { dataFim } = this.parent;
          if (dataInicio && !dataFim) {
            return false;
          }
          return true;
        }
      ),
    })
  );

  const formatarCampoDataGrid = data => {
    let dataFormatada = '';
    if (data) {
      dataFormatada = moment(data).format('DD/MM/YYYY');
    }
    return <span> {dataFormatada}</span>;
  };

  const colunas = [
    {
      title: 'Nome do evento',
      dataIndex: 'nome',
      width: '45%',
    },
    {
      title: 'Tipo de evento',
      dataIndex: 'tipo',
      width: '20%',
      render: (text, row) => <span> {row.tipoEvento.descricao}</span>,
    },
    {
      title: 'Data início',
      dataIndex: 'dataInicio',
      width: '15%',
      render: data => formatarCampoDataGrid(data),
    },
    {
      title: 'Data fim',
      dataIndex: 'dataFim',
      width: '15%',
      render: data => formatarCampoDataGrid(data),
    },
  ];

  const listarDres = async () => {
    const dres = await ServicoEvento.listarDres();

    if (dres.sucesso) {
      dres.conteudo.sort(FiltroHelper.ordenarLista('nome'));
      dres.conteudo.unshift({ codigo: 0, nome: 'Todas' });
      setlistaDre(dres.conteudo);
      return;
    }

    erro(dres.erro);
    setlistaDre([]);
  };

  useEffect(() => {
    const obterListaEventos = async () => {
      const tiposEvento = await api.get('v1/calendarios/eventos/tipos/listar');

      if (tiposEvento && tiposEvento.data && tiposEvento.data.items) {
        setListaTipoEvento(tiposEvento.data.items);
      } else {
        setListaTipoEvento([]);
      }
    };

    const consultaTipoCalendario = async () => {
      setCarregandoTipos(true);
      const tiposCalendario = await api.get('v1/calendarios/tipos');

      if (
        tiposCalendario &&
        tiposCalendario.data &&
        tiposCalendario.data.length
      ) {
        tiposCalendario.data.forEach(tipo => {
          tipo.id = String(tipo.id);
          tipo.descricaoTipoCalendario = `${tipo.anoLetivo} - ${tipo.nome} - ${tipo.descricaoPeriodo}`;
        });
        setListaCalendarioEscolar(tiposCalendario.data);
        setCarregandoTipos(false);
      } else {
        setListaCalendarioEscolar([]);
        setCarregandoTipos(false);
      }
    };

    setSomenteConsulta(verificaSomenteConsulta(permissoesTela));
    obterListaEventos();
    consultaTipoCalendario();
    listarDres();
  }, []);

  const validarFiltrar = () => {
    if (refForm) {
      refForm.validateForm().then(() => refForm.handleSubmit(e => e));
    }
  };

  useEffect(() => {
    validarFiltrar();
  }, [nomeEvento, tipoEvento]);

  useEffect(() => {
    const semTipoSelecionado =
      !filtro || !filtro.tipoCalendarioId || filtro.tipoCalendarioId === 0;

    setMesangemAlerta(semTipoSelecionado);
  }, [filtro]);

  const listarUes = async () => {
    if (dreSelecionada && dreSelecionada.toString() === '0') {
      const uesTodas = [{ codigo: 0, nome: 'Todas' }];
      setListaUe(uesTodas);
      return;
    }

    if (
      !dreSelecionada ||
      dreSelecionada === '' ||
      Object.entries(dreSelecionada).length === 0
    )
      return;

    const ues = await ServicoEvento.listarUes(dreSelecionada);

    if (!sucesso) {
      setListaUe([]);
      erro(ues.erro);
      setlistaDre([]);
      return;
    }

    if (
      !ues.conteudo ||
      ues.conteudo.length === 0 ||
      Object.entries(ues.conteudo).length === 0
    )
      setCampoUeDesabilitado(true);

    if (ues.conteudo) {
      ues.conteudo.forEach(
        ue => (ue.nome = `${tipoEscolaDTO[ue.tipoEscola]} ${ue.nome}`)
      );
      ues.conteudo.sort(FiltroHelper.ordenarLista('nome'));
      ues.conteudo.unshift({ codigo: 0, nome: 'Todas' });
      setListaUe(ues.conteudo);
    }
  };

  useEffect(() => {
    if (dreSelecionada) listarUes();

    if (selecionouCalendario) validarFiltrar();
  }, [dreSelecionada]);

  const onClickVoltar = () => {
    history.push(URL_HOME);
  };

  const onChangeUe = () => {
    if (selecionouCalendario) validarFiltrar();
  };

  const onChangeDreId = async dreId => {
    refForm.setFieldValue('ueId', undefined);

    if (dreId) {
      setDreSelecionada(dreId);
      setCampoUeDesabilitado(false);
      return;
    }

    setCampoUeDesabilitado(true);
    setListaUe([]);
    setDreSelecionada([]);
  };

  const onClickExcluir = async () => {
    if (eventosSelecionados && eventosSelecionados.length > 0) {
      const listaNomeExcluir = eventosSelecionados.map(item => item.nome);
      const confirmado = await confirmar(
        'Excluir evento',
        listaNomeExcluir,
        `Deseja realmente excluir ${
          eventosSelecionados.length > 1 ? 'estes eventos' : 'este evento'
        }?`,
        'Excluir',
        'Cancelar'
      );
      if (confirmado) {
        const idsDeletar = eventosSelecionados.map(c => c.id);
        const excluir = await ServicoEvento.deletar(idsDeletar).catch(e =>
          erros(e)
        );
        if (excluir && excluir.status === 200) {
          const mensagemSucesso = `${
            eventosSelecionados.length > 1
              ? 'Eventos excluídos'
              : 'Evento excluído'
          } com sucesso.`;
          sucesso(mensagemSucesso);
          validarFiltrar();
        }
      }
    }
  };

  const onClickNovo = () => {
    const calendarioId = refForm.getFormikContext().values.tipoCalendarioId;
    history.push(`eventos/novo/${calendarioId}`);
  };

  const onChangeNomeEvento = e => {
    setNomeEvento(e.target.value);
  };

  const onChangeTipoEvento = tipo => {
    setTipoEvento(tipo);
  };

  const onFiltrar = valoresForm => {
    const params = {
      tipoCalendarioId: valoresForm.tipoCalendarioId,
      nomeEvento,
      tipoEventoId: tipoEvento,
      ueId: valoresForm.ueId,
      dreId: valoresForm.dreId,
      dataInicio: valoresForm.dataInicio && valoresForm.dataInicio.toDate(),
      dataFim: valoresForm.dataInicio && valoresForm.dataFim.toDate(),
      EhTodasDres: valoresForm.dreId && valoresForm.dreId.toString() === '0',
      EhTodasUes: valoresForm.ueId && valoresForm.ueId.toString() === '0',
    };
    setFiltro(params);
    setEventosSelecionados([]);
  };

  const onChangeCalendarioId = tipoCalendarioId => {
    if (tipoCalendarioId) {
      setSelecionouCalendario(true);
    } else {
      setSelecionouCalendario(false);
      setDreSelecionada([]);
      setListaUe([]);
      setCampoUeDesabilitado(true);
      setTipoEvento('');
      setNomeEvento('');
      refForm.resetForm();
    }
    validarFiltrar();
  };

  const onClickEditar = evento => {
    history.push(`eventos/editar/${evento.id}`);
  };

  const onSelecionarItems = items => {
    setEventosSelecionados(items);
  };

  return (
    <>
      {mensagemAlerta && (
        <Grid cols={12} className="mb-3">
          <Alert
            alerta={{
              tipo: 'warning',
              id: 'AlertaPrincipal',
              mensagem:
                'Para cadastrar ou listar eventos você precisa selecionar um tipo de calendário.',
            }}
            className="mb-0"
          />
        </Grid>
      )}
      <Cabecalho pagina="Evento do Calendário Escolar" />
      <Card>
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
              !permissoesTela.podeExcluir ||
              (eventosSelecionados && eventosSelecionados.length < 1)
            }
            hidden={!selecionouCalendario}
          />
          <Button
            label="Novo"
            color={Colors.Roxo}
            border
            bold
            className="mr-2"
            onClick={onClickNovo}
            hidden={!selecionouCalendario}
            disabled={somenteConsulta || !permissoesTela.podeIncluir}
          />
        </div>

        <Formik
          ref={refFormik => setRefForm(refFormik)}
          enableReinitialize
          initialValues={valoresIniciais}
          validationSchema={validacoes}
          onSubmit={valores => onFiltrar(valores)}
          validateOnChange
          validateOnBlur
        >
          {form => (
            <Form className="col-md-12 mb-4">
              <div className="row">
                <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 pb-2">
                  <Loader loading={carregandoTipos} tip="">
                    <SelectComponent
                      name="tipoCalendarioId"
                      id="select-tipo-calendario"
                      lista={listaCalendarioEscolar}
                      valueOption="id"
                      valueText="descricaoTipoCalendario"
                      onChange={onChangeCalendarioId}
                      placeholder="Selecione um calendário"
                      form={form}
                    />
                  </Loader>
                </div>
                <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 pb-2">
                  <SelectComponent
                    name="dreId"
                    id="select-dre"
                    lista={listaDre}
                    valueOption="codigo"
                    valueText="nome"
                    onChange={onChangeDreId}
                    placeholder="Selecione uma DRE (Opcional)"
                    form={form}
                  />
                </div>
                <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 pb-2">
                  <SelectComponent
                    name="ueId"
                    id="select-ue"
                    lista={listaUe}
                    valueOption="codigo"
                    valueText="nome"
                    onChange={onChangeUe}
                    disabled={campoUeDesabilitado}
                    placeholder="Selecione uma UE (Opcional)"
                    form={form}
                  />
                </div>
                <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 pb-2">
                  <CampoTexto
                    placeholder="Digite o nome do evento"
                    onChange={onChangeNomeEvento}
                    value={nomeEvento}
                    desabilitado={!selecionouCalendario}
                  />
                </div>
                <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 pb-2">
                  <SelectComponent
                    name="select-tipo-evento"
                    id="select-tipo-evento"
                    lista={listaTipoEvento}
                    valueOption="id"
                    valueText="descricao"
                    onChange={onChangeTipoEvento}
                    valueSelect={tipoEvento || undefined}
                    placeholder="Selecione um tipo"
                    disabled={!selecionouCalendario}
                  />
                </div>

                <div className="col-sm-12 col-md-2 col-lg-2 col-xl-2 pb-2 pr-2">
                  <CampoData
                    formatoData="DD/MM/YYYY"
                    name="dataInicio"
                    onChange={validarFiltrar}
                    placeholder="Data início"
                    form={form}
                    desabilitado={!selecionouCalendario}
                  />
                </div>
                <div className="col-sm-12 col-md-2 col-lg-2 col-xl-2 pb-2 pl-2">
                  <CampoData
                    formatoData="DD/MM/YYYY"
                    name="dataFim"
                    onChange={validarFiltrar}
                    placeholder="Data fim"
                    form={form}
                    desabilitado={!selecionouCalendario}
                  />
                </div>
              </div>
            </Form>
          )}
        </Formik>
        <div className="col-md-12 pt-2">
          {selecionouCalendario ? (
            <ListaPaginada
              url="v1/calendarios/eventos"
              id="lista-eventos"
              colunaChave="id"
              colunas={colunas}
              filtro={filtro}
              onClick={onClickEditar}
              multiSelecao
              selecionarItems={onSelecionarItems}
            />
          ) : (
            ''
          )}
        </div>
      </Card>
    </>
  );
};

export default EventosLista;
