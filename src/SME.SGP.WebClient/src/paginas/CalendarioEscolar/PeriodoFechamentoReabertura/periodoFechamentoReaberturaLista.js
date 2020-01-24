import { DreDropDown, UeDropDown } from 'componentes-sgp';
import { Form, Formik } from 'formik';
import * as moment from 'moment';
import React, { useEffect, useState } from 'react';
import { ListaPaginada, Loader } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import Button from '~/componentes/button';
import Card from '~/componentes/card';
import { Colors } from '~/componentes/colors';
import SelectComponent from '~/componentes/select';
import { URL_HOME } from '~/constantes/url';
import api from '~/servicos/api';
import history from '~/servicos/history';

const PeriodoFechamentoReaberturaLista = () => {
  const [listaTipoCalendarioEscolar, setListaTipoCalendarioEscolar] = useState(
    []
  );
  const [tipoCalendarioSelecionado, setTipoCalendarioSelecionado] = useState(
    undefined
  );
  const [desabilitarTipoCalendario, setDesabilitarTipoCalendario] = useState(
    false
  );
  const [carregandoTipos, setCarregandoTipos] = useState(false);
  const [reaberturasSelecionadas, setReaberturasSelecionadas] = useState([]);

  const [ueSelecionada, setUeSelecionada] = useState(undefined);
  const [dreSelecionada, setDreSelecionada] = useState('');
  const [filtroValido, setFiltroValido] = useState(false);
  const [filtro, setFiltro] = useState({});

  useEffect(() => {
    if (tipoCalendarioSelecionado) {
      const novoFiltro = {
        tipoCalendarioId: tipoCalendarioSelecionado,
      };

      if (dreSelecionada) {
        novoFiltro.dreId = dreSelecionada;
      }
      if (ueSelecionada) {
        novoFiltro.ueId = ueSelecionada;
      }
      setFiltroValido(true);
      setFiltro({ ...novoFiltro });
    } else {
      setFiltroValido(false);
    }
  }, [tipoCalendarioSelecionado, ueSelecionada, dreSelecionada]);

  useEffect(() => {
    async function consultaTipos() {
      setCarregandoTipos(true);
      const listaTipo = await api.get('v1/calendarios/tipos');
      if (listaTipo && listaTipo.data && listaTipo.data.length) {
        listaTipo.data.map(item => {
          item.id = String(item.id);
          item.descricaoTipoCalendario = `${item.anoLetivo} - ${item.nome} - ${item.descricaoPeriodo}`;
        });
        setListaTipoCalendarioEscolar(listaTipo.data);
        if (listaTipo.data.length === 1) {
          setTipoCalendarioSelecionado(listaTipo.data[0].id);
          setDesabilitarTipoCalendario(true);
        } else {
          setDesabilitarTipoCalendario(false);
        }
      } else {
        setListaTipoCalendarioEscolar([]);
      }
      setCarregandoTipos(false);
    }
    consultaTipos();
  }, []);

  const onClickVoltar = () => {
    history.push(URL_HOME);
  };

  const onClickExcluir = async () => {};

  const onClickNovo = () => {
    history.push(`/calendario-escolar/periodo-fechamento-reabertura/novo`);
  };
  const onClickEditar = item => {
    history.push(
      `/calendario-escolar/periodo-fechamento-reabertura/novo/${item.id}`
    );
  };

  const onSelecionarItems = ids => {
    setReaberturasSelecionadas(ids);
  };

  const formatarCampoDataGrid = data => {
    let dataFormatada = '';
    if (data) {
      dataFormatada = moment(data).format('DD/MM/YYYY');
    }
    return <span> {dataFormatada}</span>;
  };

  const colunas = [
    {
      title: 'Descrição',
      dataIndex: 'descricao',
      width: '45%',
    },
    {
      title: 'Início',
      dataIndex: 'dataInicio',
      width: '15%',
      render: data => formatarCampoDataGrid(data),
    },
    {
      title: 'Fim',
      dataIndex: 'dataFim',
      width: '15%',
      render: data => formatarCampoDataGrid(data),
    },
  ];

  return (
    <>
      <Cabecalho pagina="Período de Fechamento (Reabertura)" />
      <Card>
        <Formik
          enableReinitialize
          initialValues={{ ueId: undefined, dreId: undefined }}
          validateOnChange
          validateOnBlur
        >
          {form => (
            <Form className="col-md-12">
              <div className="row mb-4">
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
                  />
                  <Button
                    label="Novo"
                    color={Colors.Roxo}
                    border
                    bold
                    className="mr-2"
                    onClick={onClickNovo}
                  />
                </div>
                <div className="col-md-12 mb-2">
                  <Loader loading={carregandoTipos} tip="">
                    <div style={{ maxWidth: '300px' }}>
                      <SelectComponent
                        name="tipoCalendarioId"
                        id="tipoCalendarioId"
                        lista={listaTipoCalendarioEscolar}
                        valueOption="id"
                        valueText="descricaoTipoCalendario"
                        onChange={id => setTipoCalendarioSelecionado(id)}
                        valueSelect={tipoCalendarioSelecionado}
                        disabled={desabilitarTipoCalendario}
                        placeholder="Selecione um tipo de calendário"
                      />
                    </div>
                  </Loader>
                </div>
                <div className="col-md-6 mb-2">
                  {tipoCalendarioSelecionado && (
                    <DreDropDown
                      label="Diretoria Regional de Educação (DRE)"
                      form={form}
                      onChange={dreId => setDreSelecionada(dreId)}
                      desabilitado={false}
                    />
                  )}
                </div>
                <div className="col-md-6 pb-2">
                  {tipoCalendarioSelecionado && (
                    <UeDropDown
                      dreId={form.values.dreId}
                      label="Unidade Escolar (UE)"
                      form={form}
                      url="v1/dres"
                      onChange={ueId => setUeSelecionada(ueId)}
                      desabilitado={false}
                    />
                  )}
                </div>
                <div className="col-md-12 pt-2">
                  {tipoCalendarioSelecionado ? (
                    <ListaPaginada
                      url="v1/fechamentos/reaberturas"
                      id="lista-fechamento-reaberturas"
                      colunaChave="id"
                      colunas={colunas}
                      filtro={filtro}
                      onClick={onClickEditar}
                      multiSelecao
                      selecionarItems={onSelecionarItems}
                      filtroEhValido={filtroValido}
                    />
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </>
  );
};

export default PeriodoFechamentoReaberturaLista;
