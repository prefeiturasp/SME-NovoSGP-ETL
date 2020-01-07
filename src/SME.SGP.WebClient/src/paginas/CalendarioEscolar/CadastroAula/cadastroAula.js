import { Form, Formik } from 'formik';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import Cabecalho from '~/componentes-sgp/cabecalho';
import Auditoria from '~/componentes/auditoria';
import Button from '~/componentes/button';
import { CampoData, momentSchema } from '~/componentes/campoData/campoData';
import CampoTexto from '~/componentes/campoTexto';
import Card from '~/componentes/card';
import { Colors } from '~/componentes/colors';
import RadioGroupButton from '~/componentes/radioGroupButton';
import SelectComponent from '~/componentes/select';
import { confirmar, erros, sucesso, erro } from '~/servicos/alertas';
import api from '~/servicos/api';
import { setBreadcrumbManual } from '~/servicos/breadcrumb-services';
import history from '~/servicos/history';
import RotasDTO from '~/dtos/rotasDto';
import { ModalConteudoHtml } from '~/componentes';
import Alert from '~/componentes/alert';
import modalidade from '~/dtos/modalidade';
import ServicoAula from '~/servicos/Paginas/ServicoAula';
import moment from 'moment';

const CadastroAula = ({ match }) => {
  const usuario = useSelector(store => store.usuario);
  const permissaoTela = useSelector(
    store => store.usuario.permissoes[RotasDTO.CALENDARIO_PROFESSOR]
  );
  const diaAula = useSelector(
    store => store.calendarioProfessor.diaSelecionado
  );
  const { turmaSelecionada } = usuario;
  const turmaId = turmaSelecionada ? turmaSelecionada.turma : 0;
  const ueId = turmaSelecionada ? turmaSelecionada.unidadeEscolar : 0;

  const [dataAula, setDataAula] = useState();
  const [idAula, setIdAula] = useState(0);
  const [auditoria, setAuditoria] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [novoRegistro, setNovoRegistro] = useState(!match.params.id);
  const [listaDisciplinas, setListaDisciplinas] = useState([]);
  const [validacoes, setValidacoes] = useState({});
  const [exibirAuditoria, setExibirAuditoria] = useState(false);
  const [quantidadeMaximaAulas, setQuantidadeMaximaAulas] = useState(undefined);
  const [controlaQuantidadeAula, setControlaQuantidadeAula] = useState(true);
  const [refForm, setRefForm] = useState({});
  const [refFormRecorrencia, setRefFormRecorrencia] = useState({});
  const [ehReposicao, setEhReposicao] = useState(false);
  const [quantidadeRecorrencia, setQuantidadeRecorrencia] = useState(0);
  const [existeFrequenciaPlanoAula, setExisteFrequenciaPlanoAula] = useState(
    false
  );
  const [ehAulaUnica, setEhAulaUnica] = useState(false);
  const [ehRegencia, setEhRegencia] = useState(false);
  const [ehEJA, setEhEja] = useState(false);
  const [ehRecorrencia, setEhRecorrencia] = useState(false);
  const [
    visualizarFormExcRecorrencia,
    setVisualizarFormExcRecorrencia,
  ] = useState(false);

  const [inicial, setInicial] = useState({
    tipoAula: 1,
    disciplinaId: undefined,
    quantidadeTexto: '',
    quantidadeRadio: 0,
    dataAula: '',
    recorrenciaAula: '',
    quantidade: 0,
    tipoCalendarioId: '',
    ueId: '',
    turmaId: '',
    dataAulaCompleta: window.moment(diaAula),
  });
  const [aula, setAula] = useState(inicial);
  const opcoesTipoAula = [
    { label: 'Normal', value: 1 },
    { label: 'Reposição', value: 2 },
  ];

  const opcoesQuantidadeAulas = [
    {
      label: '1',
      value: 1,
      disabled:
        (quantidadeMaximaAulas < 1 && controlaQuantidadeAula) ||
        (ehRegencia && ehEJA && !ehReposicao),
    },
    {
      label: '2',
      value: 2,
      disabled:
        (quantidadeMaximaAulas < 2 && controlaQuantidadeAula) ||
        (ehRegencia && ehEJA && !ehReposicao),
    },
  ];

  const recorrencia = {
    AULA_UNICA: 1,
    REPETIR_BIMESTRE_ATUAL: 2,
    REPETIR_TODOS_BIMESTRES: 3,
  };

  const [opcoesRecorrencia, setOpcoesRecorrencia] = useState([
    { label: 'Aula única', value: recorrencia.AULA_UNICA },
    {
      label: 'Repetir no Bimestre atual',
      value: recorrencia.REPETIR_BIMESTRE_ATUAL,
    },
    {
      label: 'Repetir em todos os Bimestres',
      value: recorrencia.REPETIR_TODOS_BIMESTRES,
    },
  ]);

  const [opcoesExcluirRecorrencia, setOpcoesExcluirRecorrencia] = useState([
    { label: 'Somente o dia', value: 1 },
    { label: 'Bimestre atual', value: 2 },
    { label: 'Todos os bimestres', value: 3 },
  ]);

  const valoresIniciaisExclusao = {
    tipoRecorrenciaExclusao: recorrencia.AULA_UNICA,
  };

  useEffect(() => {
    const obterDisciplinas = async () => {
      const disciplinas = await api.get(
        `v1/professores/${usuario.rf}/turmas/${turmaId}/disciplinas`
      );
      setListaDisciplinas(disciplinas.data);

      if (disciplinas.data && disciplinas.data.length == 1) {
        inicial.disciplinaId = String(
          disciplinas.data[0].codigoComponenteCurricular
        );
        if (Object.keys(refForm).length > 0) {
          onChangeDisciplinas(
            disciplinas.data[0].codigoComponenteCurricular,
            refForm
          );
        }
        const { regencia } = disciplinas.data ? disciplinas.data[0] : false;
        setEhRegencia(regencia);
      }

      if (novoRegistro) {
        setInicial(inicial);
      }
    };
    if (turmaId) {
      obterDisciplinas();
      validarConsultaModoEdicaoENovo();
    }
  }, [refForm]);

  useEffect(() => {
    if (ehReposicao) refForm.setFieldValue('recorrenciaAula', 1);
  }, [ehReposicao, refForm]);

  const montaValidacoes = useCallback(() => {
    const validacaoQuantidade = Yup.number()
      .typeError('O valor informado deve ser um número')
      .when('quantidadeRadio', (quantidadeRadio, schema) => {
        return quantidadeRadio <= 0
          ? schema.required('A quantidade de aulas é obrigatóriia')
          : schema.required(false);
      })
      .required('A quantidade de aulas é obrigatóriia')
      .positive('Valor inválido')
      .integer();

    const val = {
      tipoAula: Yup.string().required('Tipo obrigatório'),
      disciplinaId: Yup.string().required('Disciplina obrigatório'),
      dataAula: momentSchema.required('Hora obrigatória'),
      dataAulaCompleta: momentSchema.required('Data obrigatória'),
      recorrenciaAula: Yup.string().required('Recorrência obrigatória'),
      quantidadeTexto: controlaQuantidadeAula
        ? validacaoQuantidade.lessThan(
            quantidadeMaximaAulas + 1,
            `Valor não pode ser maior que ${quantidadeMaximaAulas}`
          )
        : validacaoQuantidade,
    };

    if (!ehReposicao) {
      //todo
      if (ehRecorrencia) {
        //todo
      }
      //TODO
      if (controlaQuantidadeAula) {
        //todo
      }
      //validar se esta usando radio ou texto
      if (ehRegencia) {
        if (turmaSelecionada.modalidade === modalidade.EJA) {
          // aula.quantidade = 5;
          setInicial({ ...inicial, quantidadeTexto: 5, quantidadeRadio: '' });
          setEhEja(true);
        } else {
          //todo limpar campo texto;
          setInicial({ ...inicial, quantidadeTexto: '', quantidadeRadio: 1 });
          setEhEja(false);
        }
      }
    }
    if (refForm && refForm.fields) {
      refForm.setFieldValue('quantidadeRadio', inicial.quantidadeRadio);
      refForm.setFieldValue('quantidadeTexto', inicial.quantidadeTexto);
    }

    setValidacoes(Yup.object(val));
  }, [
    aula,
    controlaQuantidadeAula,
    ehRecorrencia,
    ehRegencia,
    ehReposicao,
    idAula,
    quantidadeMaximaAulas,
    turmaSelecionada.modalidade,
  ]);

  useEffect(() => {
    montaValidacoes();
  }, [montaValidacoes]);

  const validarConsultaModoEdicaoENovo = async () => {
    setBreadcrumbManual(
      match.url,
      'Cadastro de Aula',
      '/calendario-escolar/calendario-professor'
    );

    if (match && match.params && match.params.id) {
      setNovoRegistro(false);
      setIdAula(match.params.id);
      consultaPorId(match.params.id);
    } else {
      setNovoRegistro(true);
      setDataAula(window.moment(diaAula));
      // TODO
    }
  };

  const consultaPorId = async id => {
    const aula = await api
      .get(`v1/calendarios/professores/aulas/${id}`)
      .catch(e => {
        if (
          e &&
          e.response &&
          e.response.data &&
          Array.isArray(e.response.data)
        ) {
          erros(e);
        }
      });
    setNovoRegistro(false);
    if (aula && aula.data) {
      setDataAula(moment(aula.data.dataAula));
      const respRecorrencia = await api.get(
        `v1/calendarios/professores/aulas/${id}/recorrencias/serie`
      );
      const dadosRecorrencia = respRecorrencia.data;

      if (respRecorrencia && dadosRecorrencia) {
        setEhAulaUnica(
          dadosRecorrencia.recorrenciaAula === recorrencia.AULA_UNICA
        );

        setExisteFrequenciaPlanoAula(
          dadosRecorrencia.existeFrequenciaOuPlanoAula
        );
      }

      if (
        respRecorrencia &&
        dadosRecorrencia &&
        dadosRecorrencia.recorrenciaAula !== recorrencia.AULA_UNICA
      ) {
        setQuantidadeRecorrencia(dadosRecorrencia.quantidadeAulasRecorrentes);

        setOpcoesRecorrencia([
          ...getRecorrenciasHabilitadas(opcoesRecorrencia, dadosRecorrencia),
        ]);
        setOpcoesExcluirRecorrencia([
          ...getRecorrenciasHabilitadas(
            opcoesExcluirRecorrencia,
            dadosRecorrencia
          ),
        ]);
      }

      const val = {
        tipoAula: aula.data.tipoAula,
        disciplinaId: String(aula.data.disciplinaId),
        dataAula: aula.data.dataAula
          ? window.moment(aula.data.dataAula)
          : window.moment(),
        recorrenciaAula: recorrencia.AULA_UNICA,
        id: aula.data.id,
        tipoCalendarioId: aula.data.tipoCalendarioId,
        ueId: aula.data.ueId,
        turmaId: aula.data.turmaId,
        dataAulaCompleta: window.moment(aula.data.dataAula),
      };
      if (aula.data.quantidade > 0 && aula.data.quantidade < 3) {
        val.quantidadeRadio = aula.data.quantidade;
        val.quantidadeTexto = '';
      } else if (aula.data.quantidade > 0 && aula.data.quantidade > 2) {
        val.quantidadeTexto = aula.data.quantidade;
      }
      setInicial(val);
      setAuditoria({
        criadoPor: aula.data.criadoPor,
        criadoRf: aula.data.criadoRF > 0 ? aula.data.criadoRF : '',
        criadoEm: aula.data.criadoEm,
        alteradoPor: aula.data.alteradoPor,
        alteradoRf: aula.data.alteradoRF > 0 ? aula.data.alteradoRF : '',
        alteradoEm: aula.data.alteradoEm,
      });
      setExibirAuditoria(true);
    }
  };

  const getRecorrenciasHabilitadas = (opcoesRecorrencia, dadosRecorrencia) => {
    opcoesRecorrencia.forEach(item => {
      if (
        item.value === dadosRecorrencia.recorrenciaAula ||
        item.value === recorrencia.AULA_UNICA
      ) {
        item.disabled = false;
      } else {
        item.disabled = true;
      }
    });
    return opcoesRecorrencia;
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

  const onClickVoltar = async () => {
    if (modoEdicao) {
      const confirmado = await confirmar(
        'Atenção',
        '',
        'Suas alterações não foram salvas, deseja salvar agora?',
        'Sim',
        'Não'
      );

      if (confirmado) {
        onClickCadastrar(refForm.state.values);
      } else {
        history.push('/calendario-escolar/calendario-professor');
      }
    } else {
      history.push('/calendario-escolar/calendario-professor');
    }
  };

  const resetarTela = form => {
    form.resetForm();
    setControlaQuantidadeAula(true);
    setQuantidadeMaximaAulas(0);
    setModoEdicao(false);
    setEhAulaUnica(false);
  };

  const onChangeCampos = () => {
    if (!modoEdicao) {
      setModoEdicao(true);
    }
  };

  const onChangeDisciplinas = async (id, form) => {
    onChangeCampos();

    const disciplina = listaDisciplinas.find(c => c.id === id);
    const { regencia } = disciplina || false;
    setEhRegencia(regencia);
    const resultado = await api
      .get(`v1/grades/aulas/turmas/${turmaId}/disciplinas/${id}`, {
        params: {
          data: dataAula ? dataAula.format('YYYY-MM-DD') : null,
        },
      })
      .then(res => res)
      .catch(err => {
        const mensagemErro =
          err &&
          err.response &&
          err.response.data &&
          err.response.data.mensagens;

        if (mensagemErro) {
          erro(mensagemErro.join(','));
          return null;
        }

        erro('Ocorreu um erro, por favor contate o suporte');

        return null;
      });

    if (resultado) {
      if (resultado.status === 200) {
        setControlaQuantidadeAula(true);
        setQuantidadeMaximaAulas(resultado.data.quantidadeAulasRestante);
        if (resultado.data.quantidadeAulasRestante > 0) {
          setControlaQuantidadeAula(true);
        }
      } else if (resultado.status === 204) {
        setControlaQuantidadeAula(false);
      }
    }
    // montaValidacoes();
  };

  const onClickCadastrar = async valoresForm => {
    const observacao = existeFrequenciaPlanoAula
      ? `Esta aula${
          ehAulaUnica ? '' : ', ou sua recorrencia'
        }, já possui frequência registrada, após a alteração você deverá acessar a aula e revisar a frequência`
      : '';
    if (
      quantidadeRecorrencia > 1 &&
      valoresForm.recorrenciaAula !== recorrencia.AULA_UNICA
    ) {
      const confirmado = await confirmar(
        'Atenção',
        observacao,
        `Você tem certeza que deseja alterar ${quantidadeRecorrencia} ocorrências desta aula a partir desta data?`,
        'Sim',
        'Não'
      );
      if (confirmado) {
        await salvar(valoresForm);
        history.push('/calendario-escolar/calendario-professor');
      }
    } else {
      if (existeFrequenciaPlanoAula) {
        const confirmado = await confirmar(
          'Atenção',
          observacao,
          'Você tem certeza que deseja alterar ?',
          'Sim',
          'Não'
        );

        if (!confirmado) return;
      }

      await salvar(valoresForm);
    }
  };

  const salvar = async valoresForm => {
    const dados = { ...valoresForm };
    const data =
      dados.dataAulaCompleta && dados.dataAulaCompleta.format('YYYY-MM-DD');
    const hora = dados.dataAula && dados.dataAula.format('HH:mm');

    dados.dataAula = moment(`${data}T${hora}`);
    if (dados.quantidadeRadio && dados.quantidadeRadio > 0) {
      dados.quantidade = dados.quantidadeRadio;
    } else if (dados.quantidadeTexto && dados.quantidadeTexto > 0) {
      dados.quantidade = dados.quantidadeTexto;
    }

    if (novoRegistro) {
      dados.tipoCalendarioId = match.params.tipoCalendarioId;
      dados.ueId = ueId;
      dados.turmaId = turmaId;
      // valoresForm.dataAula = dataAula;
    }

    // const cadastrado = idAula
    //   ? await api
    //       .put(`v1/calendarios/professores/aulas/${idAula}`, {
    //         ...valoresForm,
    //         dataAula: valoresForm.dataAula.format(),
    //       })
    //       .then(resp => resp)
    //       .catch(err => err)
    //   : await api
    //       .post('v1/calendarios/professores/aulas', valoresForm)
    //       .then(resp => resp)
    //       .catch(err => err);

    const cadastrado = await ServicoAula.salvar(idAula, dados).catch(e =>
      erros(e)
    );
    if (cadastrado) {
      if (cadastrado.status === 200) {
        if (cadastrado.data) sucesso(cadastrado.data.mensagens[0]);
        history.push('/calendario-escolar/calendario-professor');
      } else if (cadastrado.response) {
        erro(
          cadastrado.response.status === 601
            ? cadastrado.response.data.mensagens
            : 'Houve uma falha ao salvar a aula, por favor contate o suporte'
        );
      }
    }
  };

  const onClickExcluir = async () => {
    if (!novoRegistro) {
      var observacao = existeFrequenciaPlanoAula
        ? 'Obs: Esta aula ou sua recorrência possui frequência ou plano de aula registrado, ao excluí-la estará excluindo esse registro também'
        : '';

      if (quantidadeRecorrencia > 1) {
        setVisualizarFormExcRecorrencia(true);
      } else {
        const confirmado = await confirmar(
          `Excluir aula  - ${dataAula.format('dddd')}, ${dataAula.format(
            'DD/MM/YYYY'
          )}`,
          `Você tem certeza que deseja excluir esta aula? ${observacao}`,
          'Deseja continuar?',
          'Excluir',
          'Cancelar'
        );
        if (confirmado) {
          excluir(recorrencia.AULA_UNICA);
        }
      }
    }
  };

  const excluir = async tipoRecorrencia => {
    const excluir = await api
      .delete(
        `v1/calendarios/professores/aulas/${idAula}/recorrencias/${tipoRecorrencia}`
      )
      .catch(e => erros(e));
    if (excluir) {
      if (tipoRecorrencia === recorrencia.AULA_UNICA) {
        sucesso('Aula excluída com sucesso.');
      } else {
        if (excluir.status === 200) sucesso(excluir.data.mensagens[0]);
      }
      history.push('/calendario-escolar/calendario-professor');
    }
  };

  const validaAntesDoSubmit = form => {
    const arrayCampos = Object.keys(aula);
    arrayCampos.forEach(campo => {
      form.setFieldTouched(campo, true, true);
    });
    form.validateForm().then(() => {
      if (form.isValid || Object.keys(form.errors).length == 0) {
        form.handleSubmit(e => e);
      }
    });
  };

  const getDataFormatada = () => {
    const titulo = `${dataAula ? dataAula.format('dddd') : ''}, ${
      dataAula ? dataAula.format('DD/MM/YYYY') : ''
    } `;
    return titulo;
  };

  return (
    <>
      <div className="col-md-12">
        {quantidadeMaximaAulas <= 0 ? (
          <Alert
            alerta={{
              tipo: 'warning',
              id: 'cadastro-aula-quantidade-maxima',
              mensagem:
                'Não é possível criar aula normal porque o limite da grade curricular foi atingido',
              estiloTitulo: { fontSize: '18px' },
            }}
            className="mb-2"
          />
        ) : null}
      </div>
      <Cabecalho pagina={`Cadastro de Aula - ${getDataFormatada()}`} />
      <Card>
        <ModalConteudoHtml
          key="reiniciarSenha"
          visivel={visualizarFormExcRecorrencia}
          onConfirmacaoPrincipal={() =>
            excluir(refFormRecorrencia.state.values.tipoRecorrenciaExclusao)
          }
          onConfirmacaoSecundaria={() => setVisualizarFormExcRecorrencia(false)}
          onClose={() => {}}
          labelBotaoPrincipal="Confirmar"
          labelBotaoSecundario="Cancelar"
          titulo={`Excluir aula - ${getDataFormatada()}`}
          closable={false}
        >
          <Formik
            enableReinitialize
            initialValues={valoresIniciaisExclusao}
            validationSchema={validacoes}
            ref={refFormik => setRefFormRecorrencia(refFormik)}
            onSubmit={() => {}}
            validateOnChange
            validateOnBlur
          >
            {form => (
              <Form className="col-md-12 mb-4">
                <div className="row justify-content-start">
                  <div
                    className="col-sm-12 col-md-12"
                    style={{ paddingTop: '10px' }}
                  >
                    <p>{`Essa aula se repete por ${quantidadeRecorrencia}${
                      quantidadeRecorrencia > 1 ? ' vezes' : ' vez'
                    } em seu planejamento.${
                      existeFrequenciaPlanoAula
                        ? ' Obs: Esta aula ou sua recorrência possui frequência ou plano de aula registrado, ao excluí-la estará excluindo esse registro também'
                        : ''
                    }`}</p>
                    <p>Qual opção de exclusão você deseja realizar?</p>
                  </div>
                  <div className="col-sm-12 col-md-12 d-block">
                    <RadioGroupButton
                      form={form}
                      id="tipo-recorrencia-exclusao"
                      label="Realizar exclusão"
                      opcoes={opcoesExcluirRecorrencia}
                      name="tipoRecorrenciaExclusao"
                      onChange={() => {}}
                    />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </ModalConteudoHtml>
        <Formik
          enableReinitialize
          initialValues={inicial}
          validationSchema={validacoes}
          ref={refFormik => setRefForm(refFormik)}
          onSubmit={valores => onClickCadastrar(valores)}
          validateOnChange
          validateOnBlur
        >
          {form => (
            <Form className="col-md-12 mb-4">
              <div className="row pb-3">
                <div className="col-md-2 pb-2 d-flex justify-content-start">
                  <CampoData
                    form={form}
                    placeholder="Data da aula"
                    formatoData="DD/MM/YYYY"
                    label=""
                    name="dataAulaCompleta"
                    onChange={onChangeCampos}
                  />
                </div>
                <div className="col-md-10 pb-2 d-flex justify-content-end">
                  <Button
                    label="Voltar"
                    icon="arrow-left"
                    color={Colors.Azul}
                    border
                    className="mr-2"
                    onClick={onClickVoltar}
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
                    hidden={novoRegistro}
                    onClick={onClickExcluir}
                  />
                  <Button
                    label={novoRegistro ? 'Cadastrar' : 'Alterar'}
                    color={Colors.Roxo}
                    border
                    bold
                    className="mr-2"
                    disabled={
                      (novoRegistro && !permissaoTela.podeIncluir) ||
                      (!novoRegistro && !permissaoTela.podeAlterar)
                    }
                    onClick={() => validaAntesDoSubmit(form)}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12 col-md-5 col-lg-3 col-xl-3 mb-2">
                  <RadioGroupButton
                    desabilitado={!novoRegistro}
                    id="tipo-aula"
                    label="Tipo de aula"
                    form={form}
                    opcoes={opcoesTipoAula}
                    name="tipoAula"
                    onChange={e => {
                      setEhReposicao(e.target.value === 2);
                      // setAula({
                      //   ...aula,
                      //   tipoAula: e.target.value,
                      //   recorrenciaAula: e.target.value === 2 ? 1 : '',
                      // });
                      onChangeCampos();
                      // montaValidacoes();
                      setControlaQuantidadeAula(ehReposicao);
                    }}
                  />
                </div>
                <div className="col-sm-12 col-md-7 col-lg-9 col-xl-6 mb-2">
                  <SelectComponent
                    id="disciplina"
                    form={form}
                    name="disciplinaId"
                    lista={listaDisciplinas}
                    valueOption="codigoComponenteCurricular"
                    valueText="nome"
                    onChange={e => onChangeDisciplinas(e, form)}
                    label="Disciplina"
                    placeholder="Disciplina"
                    disabled={
                      !!(
                        listaDisciplinas &&
                        listaDisciplinas.length &&
                        listaDisciplinas.length === 1
                      ) || !novoRegistro
                    }
                  />
                </div>
                <div className="col-sm-12 col-md-4 col-lg-4 col-xl-3 pb-2">
                  <CampoData
                    form={form}
                    label="Horário do início da aula"
                    placeholder="Formato 24 horas"
                    formatoData="HH:mm"
                    name="dataAula"
                    onChange={onChangeCampos}
                    somenteHora
                  />
                </div>
                <div className="col-sm-12 col-md-8 col-lg-8 col-xl-5 mb-2 d-flex justify-content-start">
                  <RadioGroupButton
                    id="quantidadeRadio"
                    label="Quantidade de Aulas"
                    form={form}
                    opcoes={opcoesQuantidadeAulas}
                    name="quantidadeRadio"
                    onChange={e => {
                      onChangeCampos();
                      refForm.setFieldValue('quantidadeTexto', '');
                    }}
                    className="text-nowrap"
                  />
                  <div className="mt-4 ml-2 mr-2 text-nowrap">
                    ou informe a quantidade
                  </div>
                  <CampoTexto
                    form={form}
                    name="quantidadeTexto"
                    className="mt-3"
                    style={{ width: '70px' }}
                    id="quantidadeTexto"
                    desabilitado={
                      !form.values.disciplinaId ||
                      (quantidadeMaximaAulas < 3 && controlaQuantidadeAula) ||
                      (ehRegencia && !ehReposicao)
                    }
                    onChange={e => {
                      refForm.setFieldValue('quantidadeRadio', 0);
                      onChangeCampos();
                      // montaValidacoes();
                    }}
                    icon
                  />
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-7 mb-2">
                  <RadioGroupButton
                    id="recorrencia"
                    label="Recorrência"
                    form={form}
                    opcoes={opcoesRecorrencia}
                    name="recorrenciaAula"
                    desabilitado={ehReposicao}
                    onChange={e => {
                      onChangeCampos();
                      setEhRecorrencia(e.target.value !== 1);
                      // montaValidacoes();
                    }}
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
            criadoRf={auditoria.criadoRf}
            alteradoPor={auditoria.alteradoPor}
            alteradoEm={auditoria.alteradoEm}
            alteradoRf={auditoria.alteradoRf}
          />
        ) : (
          ''
        )}
      </Card>
    </>
  );
};

export default CadastroAula;
