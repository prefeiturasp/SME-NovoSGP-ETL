import { Form, Formik } from 'formik';
import * as moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { CampoData, Loader, momentSchema } from '~/componentes';
import { Cabecalho, DreDropDown, UeDropDown } from '~/componentes-sgp';
import Auditoria from '~/componentes/auditoria';
import Button from '~/componentes/button';
import CampoTexto from '~/componentes/campoTexto';
import Card from '~/componentes/card';
import { Colors } from '~/componentes/colors';
import SelectComponent from '~/componentes/select';
import RotasDto from '~/dtos/rotasDto';
import { confirmar, erros, sucesso } from '~/servicos/alertas';
import api from '~/servicos/api';
import { setBreadcrumbManual } from '~/servicos/breadcrumb-services';
import history from '~/servicos/history';
import modalidadeTipoCalendario from '~/dtos/modalidadeTipoCalendario';

const PeriodoFechamentoReaberturaForm = ({ match }) => {
  const usuarioStore = useSelector(store => store.usuario);

  const [listaTipoCalendarioEscolar, setListaTipoCalendarioEscolar] = useState(
    []
  );
  const [listaBimestres, setListaBimestres] = useState([]);
  const [desabilitarTipoCalendario, setDesabilitarTipoCalendario] = useState(
    false
  );
  const [carregandoTipos, setCarregandoTipos] = useState(false);
  const [idFechamentoReabertura, setIdFechamentoReabertura] = useState(0);
  const [validacoes, setValidacoes] = useState({});
  const [exibirAuditoria, setExibirAuditoria] = useState(false);
  const [auditoria, setAuditoria] = useState([]);
  const [novoRegistro, setNovoRegistro] = useState(true);
  const [modoEdicao, setModoEdicao] = useState(false);

  const [valoresIniciais, setValoresIniciais] = useState({
    tipoCalendarioId: undefined,
    dreId: undefined,
    ueId: undefined,
    dataInicio: '',
    dataFim: '',
    descricao: '',
    bimestres: [],
  });

  const montarListaBimestres = tipoModalidade => {
    const listaNova = [
      {
        valor: 1,
        descricao: 'Primeiro Bimestre',
      },
      {
        valor: 2,
        descricao: 'Segundo Bimestre',
      },
    ];

    if (tipoModalidade != modalidadeTipoCalendario.EJA) {
      listaNova.push(
        {
          valor: 3,
          descricao: 'Terceiro Bimestre',
        },
        {
          valor: 4,
          descricao: 'Quarto Bimestre',
        }
      );
    }

    listaNova.push({
      valor: 5,
      descricao: 'Todos',
    });
    setListaBimestres(listaNova);
  };

  const onChangeCampos = () => {
    if (!modoEdicao) {
      setModoEdicao(true);
    }
  };

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
          setDesabilitarTipoCalendario(true);
          if (!(match && match.params && match.params.id)) {
            const valores = {
              tipoCalendarioId: listaTipo.data[0].id,
              dreId: undefined,
              ueId: undefined,
              dataInicio: '',
              dataFim: '',
              descricao: '',
              bimestres: [],
            };
            setValoresIniciais(valores);
          }
          montarListaBimestres(listaTipo.data[0].modalidade);
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

  useEffect(() => {
    const consultaPorId = async () => {
      if (
        match &&
        match.params &&
        match.params.id &&
        listaTipoCalendarioEscolar.length
      ) {
        setBreadcrumbManual(
          match.url,
          'Períodos',
          RotasDto.PERIODO_FECHAMENTO_REABERTURA
        );
        setIdFechamentoReabertura(match.params.id);
        const cadastrado = await api
          .get(`v1/fechamentos/reaberturas/${match.params.id}`)
          .catch(e => erros(e));

        if (cadastrado && cadastrado.data) {
          const bimestres = [];
          for (var i = 0; i < cadastrado.data.bimestres.length; i++) {
            const bimestre = cadastrado.data.bimestres[i];
            if (bimestre) bimestres.push(i + 1);
          }
          cadastrado.data.bimestres = [...bimestres];
          const calendario = listaTipoCalendarioEscolar.find(
            item => item.id == cadastrado.data.tipoCalendarioId
          );
          if (calendario) {
            montarListaBimestres(calendario.modalidade);
          }
          setValoresIniciais({
            tipoCalendarioId: String(cadastrado.data.tipoCalendarioId),
            dreId: cadastrado.data.dreCodigo || undefined,
            ueId: cadastrado.data.ueCodigo || undefined,
            dataInicio: moment(cadastrado.data.dataInicio),
            dataFim: moment(cadastrado.data.dataFim),
            descricao: cadastrado.data.descricao,
            bimestres: cadastrado.data.bimestres.map(item => String(item)),
          });

          setAuditoria({
            criadoPor: cadastrado.data.criadoPor,
            criadoRf: cadastrado.data.criadoRf,
            criadoEm: cadastrado.data.criadoEm,
            alteradoPor: cadastrado.data.alteradoPor,
            alteradoRf: cadastrado.data.alteradoRf,
            alteradoEm: cadastrado.data.alteradoEm,
          });
          setExibirAuditoria(true);
        }
        setNovoRegistro(false);
      }
    };

    consultaPorId();
  }, [match, listaTipoCalendarioEscolar]);

  useEffect(() => {
    const montaValidacoes = () => {
      const val = {
        tipoCalendarioId: Yup.string().required('Calendário obrigatório'),
        descricao: Yup.string().required('Descrição obrigatória'),
        dataInicio: momentSchema.required('Data obrigatória'),
        dataFim: momentSchema.required('Data obrigatória'),
        bimestres: Yup.string().required('Bimestre obrigatório'),
      };

      if (!usuarioStore.possuiPerfilSme) {
        val.dreId = Yup.string().required('DRE obrigatória');
      }

      if (!usuarioStore.possuiPerfilSmeOuDre) {
        val.ueId = Yup.string().required('UE obrigatória');
      }

      setValidacoes(Yup.object(val));
    };

    montaValidacoes();
  }, [usuarioStore.possuiPerfilSme, usuarioStore.possuiPerfilSmeOuDre]);

  const perguntaAoSalvar = async () => {
    return confirmar(
      'Atenção',
      '',
      'Suas alterações não foram salvas, deseja salvar agora?'
    );
  };

  const validaAntesDoSubmit = form => {
    const arrayCampos = Object.keys(valoresIniciais);
    arrayCampos.forEach(campo => {
      form.setFieldTouched(campo, true, true);
    });
    form.validateForm().then(() => {
      if (form.isValid || Object.keys(form.errors).length == 0) {
        form.handleSubmit(e => e);
      }
    });
  };

  const onClickVoltar = async form => {
    if (modoEdicao) {
      const confirmado = await perguntaAoSalvar();
      if (confirmado) {
        validaAntesDoSubmit(form);
      }
    } else {
      history.push(RotasDto.PERIODO_FECHAMENTO_REABERTURA);
    }
  };

  const onClickExcluir = async () => {
    if (!novoRegistro) {
      const confirmado = await confirmar(
        'Excluir Fechamento',
        '',
        'Deseja realmente excluir este fechamento?',
        'Excluir',
        'Cancelar'
      );
      if (confirmado) {
        const parametrosDelete = { data: [idFechamentoReabertura] };
        const excluir = await api
          .delete('v1/fechamentos/reaberturas', parametrosDelete)
          .catch(e => erros(e));

        if (excluir && excluir.status == 200) {
          sucesso('Fechamento excluído com sucesso.');
          history.push(RotasDto.PERIODO_FECHAMENTO_REABERTURA);
        }
      }
    }
  };

  const resetarTela = form => {
    form.resetForm();
    setModoEdicao(false);
    setListaBimestres([]);
  };

  const onClickCancelar = async form => {
    if (modoEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );
      if (confirmou) {
        resetarTela(form);
      }
    }
  };

  const obterBimestresSalvar = valoresForm => {
    const todosBimestres = valoresForm.bimestres.find(item => item == '5');
    if (todosBimestres) {
      const calendarioSelecionado = listaTipoCalendarioEscolar.find(
        item => item.id == valoresForm.tipoCalendarioId
      );
      if (
        calendarioSelecionado &&
        calendarioSelecionado.modalidade &&
        calendarioSelecionado.modalidade == modalidadeTipoCalendario.EJA
      ) {
        return ['1', '2'];
      }
      return ['1', '2', '3', '4'];
    }

    return valoresForm.bimestres;
  };
  const onClickCadastrar = async valoresForm => {
    const bimestres = obterBimestresSalvar(valoresForm);
    const {
      descricao,
      dreId,
      dataFim,
      dataInicio,
      tipoCalendarioId,
      ueId,
    } = valoresForm;
    const prametrosParaSalvar = {
      bimestres,
      descricao,
      dreCodigo: dreId,
      fim: dataFim,
      inicio: dataInicio,
      tipoCalendarioId,
      ueCodigo: ueId,
    };
    const cadastrado = await api
      .post('v1/fechamentos/reaberturas', prametrosParaSalvar)
      .catch(e => erros(e));

    if (cadastrado && cadastrado.status == 200) {
      sucesso('Reabertura de Fechamento cadastrada com sucesso');
      history.push(RotasDto.PERIODO_FECHAMENTO_REABERTURA);
    }
  };

  const onChangeTipoCalendario = (tipoId, form) => {
    if (tipoId) {
      const calendarioSelecionado = listaTipoCalendarioEscolar.find(
        item => item.id == tipoId
      );
      if (calendarioSelecionado) {
        montarListaBimestres(calendarioSelecionado.modalidade);
      }
    }
    form.setFieldValue('bimestres', []);
    onChangeCampos();
  };

  return (
    <>
      <Cabecalho pagina="Período de Fechamento (Reabertura)" />
      <Card>
        <Formik
          enableReinitialize
          initialValues={valoresIniciais}
          validationSchema={validacoes}
          onSubmit={valores => onClickCadastrar(valores)}
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
                    onClick={() => onClickVoltar(form)}
                  />
                  <Button
                    label="Cancelar"
                    color={Colors.Roxo}
                    border
                    className="mr-2"
                    onClick={() => onClickCancelar(form)}
                    disabled={!modoEdicao}
                  />
                  <Button
                    label="Excluir"
                    color={Colors.Vermelho}
                    border
                    className="mr-2"
                    onClick={onClickExcluir}
                    disabled={novoRegistro}
                  />
                  <Button
                    label={`${
                      idFechamentoReabertura > 0 ? 'Alterar' : 'Cadastrar'
                      }`}
                    color={Colors.Roxo}
                    border
                    bold
                    className="mr-2"
                    onClick={() => validaAntesDoSubmit(form)}
                  />
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-2">
                  <Loader loading={carregandoTipos} tip="">
                    <div style={{ maxWidth: '300px' }}>
                      <SelectComponent
                        label="Calendário"
                        form={form}
                        name="tipoCalendarioId"
                        id="tipoCalendarioId"
                        lista={listaTipoCalendarioEscolar}
                        valueOption="id"
                        valueText="descricaoTipoCalendario"
                        disabled={desabilitarTipoCalendario}
                        placeholder="Selecione um tipo de calendário"
                        onChange={valor => onChangeTipoCalendario(valor, form)}
                      />
                    </div>
                  </Loader>
                </div>
                <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 mb-2">
                  <DreDropDown
                    name="dreId"
                    label="Diretoria Regional de Educação (DRE)"
                    form={form}
                    desabilitado={false}
                    onChange={() => {
                      onChangeCampos();
                    }}
                  />
                </div>
                <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 mb-2">
                  <UeDropDown
                    name="ueId"
                    dreId={form.values.dreId}
                    label="Unidade Escolar (UE)"
                    form={form}
                    url="v1/dres"
                    desabilitado={false}
                    onChange={() => {
                      onChangeCampos();
                    }}
                  />
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-2">
                  <CampoTexto
                    label="Descrição"
                    name="descricao"
                    id="descricao"
                    type="textarea"
                    form={form}
                    onChange={() => {
                      onChangeCampos();
                    }}
                  />
                </div>
                <div className="col-sm-2 col-md-2 col-lg-2 col-xl-2 mb-2">
                  <CampoData
                    label="Início"
                    form={form}
                    name="dataInicio"
                    placeholder="DD/MM/AAAA"
                    formatoData="DD/MM/YYYY"
                    onChange={() => {
                      onChangeCampos();
                    }}
                  />
                </div>
                <div className="col-sm-2 col-md-2 col-lg-2 col-xl-2 mb-2">
                  <CampoData
                    label="Fim"
                    form={form}
                    name="dataFim"
                    placeholder="DD/MM/AAAA"
                    formatoData="DD/MM/YYYY"
                    onChange={() => {
                      onChangeCampos();
                    }}
                  />
                </div>
                <div className="col-sm-4 col-md-4 col-lg-4 col-xl-4 mb-2">
                  <SelectComponent
                    form={form}
                    label="Bimestre"
                    name="bimestres"
                    id="bimestres"
                    lista={listaBimestres}
                    onChange={valor => {
                      if (valor.includes('5')) {
                        form.setFieldValue('bimestres', ['5']);
                        onChangeCampos();
                      }
                    }}
                    valueOption="valor"
                    valueText="descricao"
                    placeholder="Selecione bimestre(s)"
                    multiple
                  />
                </div>
              </div>
            </Form>
          )}
        </Formik>
        {exibirAuditoria ? (
          <Auditoria
            criadoEm={auditoria.criadoEm}
            criadoPor={auditoria.criadoPor}
            alteradoPor={auditoria.alteradoPor}
            alteradoEm={auditoria.alteradoEm}
          />
        ) : (
            ''
          )}
      </Card>
    </>
  );
};

export default PeriodoFechamentoReaberturaForm;
