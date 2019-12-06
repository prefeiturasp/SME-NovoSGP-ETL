import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import queryString from 'query-string';

// Form
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import {
  setLoaderSecao,
  setLoaderTabela,
} from '~/redux/modulos/loader/actions';

// Serviços
import RotasDto from '~/dtos/rotasDto';
import history from '~/servicos/history';
import { erro, sucesso, confirmar } from '~/servicos/alertas';
import { setBreadcrumbManual } from '~/servicos/breadcrumb-services';
import AtribuicaoCJServico from '~/servicos/Paginas/AtribuicaoCJ';

// Componentes SGP
import { Cabecalho, DreDropDown, UeDropDown } from '~/componentes-sgp';

// Componentes
import {
  Card,
  ButtonGroup,
  Grid,
  Localizador,
  Loader,
  Auditoria,
} from '~/componentes';
import ModalidadesDropDown from './componentes/ModalidadesDropDown';
import TurmasDropDown from './componentes/TurmasDropDown';
import Tabela from './componentes/Tabela';

// Styles
import { Row } from './styles';

// Funçoes
import {
  validaSeObjetoEhNuloOuVazio,
  valorNuloOuVazio,
  objetoEstaTodoPreenchido,
} from '~/utils/funcoes/gerais';

function AtribuicaoCJForm({ match, location }) {
  const dispatch = useDispatch();
  const carregando = useSelector(store => store.loader.loaderSecao);
  const carregandoTabela = useSelector(store => store.loader.loaderTabela);
  const permissoesTela = useSelector(store => store.usuario.permissoes);
  const [dreId, setDreId] = useState('');
  const [novoRegistro, setNovoRegistro] = useState(true);
  const [modoEdicao] = useState(false);
  const [auditoria, setAuditoria] = useState({});
  const [refForm, setRefForm] = useState(null);
  const [listaProfessores, setListaProfessores] = useState([]);
  const [valoresForm, setValoresForm] = useState({});
  const [valoresIniciais, setValoresIniciais] = useState({
    professorRf: '',
    professorNome: '',
    dreId: '',
    ueId: '',
    modalidadeId: '',
    turmaId: '',
  });

  const validacoes = () => {
    return Yup.object({
      dreId: Yup.string().required('Campo obrigatório'),
      ueId: Yup.string().required('Campo obrigatório'),
      professorRf: Yup.string().required('Campo obrigatório'),
      modalidadeId: Yup.string().required('Campo obrigatório'),
      turmaId: Yup.string().required('Campo obrigatório'),
    });
  };

  const validaAntesDoSubmit = form => {
    const arrayCampos = Object.keys(valoresIniciais);
    arrayCampos.forEach(campo => {
      form.setFieldTouched(campo, true, true);
    });
    form.validateForm().then(() => {
      if (form.isValid || Object.keys(form.errors).length === 0) {
        form.submitForm(form);
      }
    });
  };

  const onClickBotaoPrincipal = form => {
    validaAntesDoSubmit(form);
  };

  const onSubmitFormulario = async valores => {
    try {
      dispatch(setLoaderSecao(true));
      const { data, status } = await AtribuicaoCJServico.salvarAtribuicoes({
        ...valores,
        usuarioRf: valores.professorRf,
        modalidade: valores.modalidadeId,
        disciplinas: [...listaProfessores],
      });
      if (data || status === 200) {
        dispatch(setLoaderSecao(false));
        sucesso('Atribuição de CJ salva com sucesso.');
        history.push('/gestao/atribuicao-cjs');
      }
    } catch (err) {
      if (err) {
        dispatch(setLoaderSecao(false));
        erro(err.response.data.mensagens[0]);
      }
    }
  };

  const onClickVoltar = async () => {
    if (modoEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );
      if (confirmou) {
        history.push('/gestao/atribuicao-cjs');
      }
    } else {
      history.push('/gestao/atribuicao-cjs');
    }
  };

  const validaFormulario = async valores => {
    if (validaSeObjetoEhNuloOuVazio(valores)) return;
    if (isEqual(valoresForm, valores)) return;

    if (objetoEstaTodoPreenchido(valores)) {
      setValoresForm(valores);
    }
  };

  const onChangeSubstituir = item => {
    setListaProfessores(
      listaProfessores.map(x => {
        if (item.disciplinaId === x.disciplinaId) {
          return {
            ...item,
            substituir: !x.substituir,
          };
        }
        return x;
      })
    );
  };

  useEffect(() => {
    if (location && location.search) {
      const query = queryString.parse(location.search);
      setNovoRegistro(false);
      setBreadcrumbManual(match.url, 'Atribuição', '/gestao/atribuicao-cjs');
      setValoresIniciais({
        ...valoresIniciais,
        modalidadeId: query.modalidadeId,
        turmaId: query.turmaId,
      });
    }
  }, []);

  useEffect(() => {
    async function buscaAtribs(valores) {
      const { ueId, modalidadeId, turmaId, professorRf } = valores;

      if (
        valorNuloOuVazio(ueId) ||
        valorNuloOuVazio(modalidadeId) ||
        valorNuloOuVazio(turmaId) ||
        valorNuloOuVazio(professorRf)
      ) {
        return;
      }

      try {
        setLoaderTabela(true);
        const { data, status } = await AtribuicaoCJServico.buscarAtribuicoes(
          ueId,
          modalidadeId,
          turmaId,
          professorRf
        );
        if (data && status === 200) {
          setListaProfessores(data.itens);
          setAuditoria(data);
          setLoaderTabela(false);
        }
      } catch (error) {
        setLoaderTabela(false);
        erro(error);
      }
    }

    if (
      refForm &&
      refForm.getFormikContext &&
      typeof refForm.getFormikContext === 'function'
    ) {
      buscaAtribs(valoresForm);
    }
  }, [valoresForm]);

  return (
    <>
      <Cabecalho pagina="Atribuição" />
      <Loader loading={carregando}>
        <Card>
          <Formik
            enableReinitialize
            initialValues={valoresIniciais}
            validationSchema={validacoes}
            ref={refFormik => setRefForm(refFormik)}
            onSubmit={valores => onSubmitFormulario(valores)}
            validate={valores => validaFormulario(valores)}
            validateOnBlur
            validateOnChange
          >
            {form => (
              <Form>
                <ButtonGroup
                  form={form}
                  permissoesTela={permissoesTela[RotasDto.ATRIBUICAO_CJ_LISTA]}
                  novoRegistro={novoRegistro}
                  labelBotaoPrincipal="Salvar"
                  onClickBotaoPrincipal={() => onClickBotaoPrincipal(form)}
                  onClickVoltar={() => onClickVoltar()}
                  modoEdicao={modoEdicao}
                />
                <Row className="row">
                  <Grid cols={6}>
                    <DreDropDown
                      label="Diretoria Regional de Educação (DRE)"
                      form={form}
                      onChange={valor => setDreId(valor)}
                    />
                  </Grid>
                  <Grid cols={6}>
                    <UeDropDown
                      label="Unidade Escolar (UE)"
                      dreId={dreId}
                      form={form}
                      onChange={() => null}
                    />
                  </Grid>
                </Row>
                <Row className="row">
                  <Grid cols={7}>
                    <Row className="row">
                      <Localizador
                        dreId={form.values.dreId}
                        anoLetivo="2019"
                        showLabel
                        form={form}
                        onChange={() => null}
                      />
                    </Row>
                  </Grid>
                  <Grid cols={3}>
                    <ModalidadesDropDown
                      label="Modalidade"
                      form={form}
                      onChange={() => null}
                    />
                  </Grid>
                  <Grid cols={2}>
                    <TurmasDropDown
                      label="Turma"
                      form={form}
                      onChange={value => value}
                    />
                  </Grid>
                </Row>
              </Form>
            )}
          </Formik>
          <Tabela
            carregando={carregandoTabela}
            lista={listaProfessores}
            onChangeSubstituir={onChangeSubstituir}
          />
          {auditoria && (
            <Auditoria
              criadoEm={auditoria.criadoEm}
              criadoPor={auditoria.criadoPor}
              criadoRf={auditoria.criadoRf}
              alteradoPor={auditoria.alteradoPor}
              alteradoEm={auditoria.alteradoEm}
              alteradoRf={auditoria.alteradoRf}
            />
          )}
        </Card>
      </Loader>
    </>
  );
}

AtribuicaoCJForm.propTypes = {
  match: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.object),
    PropTypes.any,
  ]),
  location: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.object),
    PropTypes.any,
  ]),
};

AtribuicaoCJForm.defaultProps = {
  match: null,
  location: null,
};

export default AtribuicaoCJForm;
