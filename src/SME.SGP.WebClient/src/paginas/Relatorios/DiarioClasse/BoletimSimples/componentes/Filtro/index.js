import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { Form, Formik } from 'formik';

import { useSelector } from 'react-redux';
import { Grid, SelectComponent, Loader } from '~/componentes';
import { Linha } from '~/componentes/EstilosGlobais';

import AnoLetivoDropDown from './componentes/AnoLetivoDropDown';
import modalidade from '~/dtos/modalidade';
import FiltroHelper from '~/componentes-sgp/filtro/helper';
import { DreDropDown, UeDropDown } from '~/componentes-sgp';
import TurmasDropDown from './componentes/TurmasDropDown';

function Filtro({ onFiltrar, resetForm }) {
  const [refForm, setRefForm] = useState({});

  const filtro = useSelector(store => store.filtro);

  const [valoresIniciais, setValoresIniciais] = useState({
    anoLetivo: filtro.anosLetivos.length ? filtro.anosLetivos[0].valor : '',
    modalidadeId: '',
    semestre: '',
    dreId: '',
    ueId: '',
    turmaId: '',
    opcaoAlunoId: '0',
  });

  const [carregandoModalidades, setCarregandoModalidades] = useState(false);
  const [carregandoPeriodos, setCarregandoPeriodos] = useState(false);

  const modalidadesStore = filtro.modalidades;
  const periodosStore = filtro.periodos;

  const [modalidades, setModalidades] = useState([]);
  const [periodos, setPeriodos] = useState([]);

  useEffect(() => {
    setCarregandoModalidades(true);
    if (modalidadesStore && modalidadesStore.length && !modalidades.length)
      setModalidades(modalidadesStore);
    setCarregandoModalidades(false);
  }, [modalidades.length, modalidadesStore]);

  const [modalidadeId, setModalidadeId] = useState(undefined);

  useEffect(() => {
    if (modalidades && modalidades.length === 1 && refForm) {
      refForm.setFieldValue('modalidadeId', String(modalidades[0].valor));
      setModalidadeId(String(modalidades[0].valor));
      setValoresIniciais({
        ...valoresIniciais,
        modalidadeId: String(modalidades[0].valor),
      });
    }
  }, [modalidades, refForm]);

  const [anoLetivo, setAnoLetivo] = useState(undefined);
  const [dreId, setDreId] = useState(undefined);

  useEffect(() => {
    if (refForm && resetForm) refForm.resetForm();
  }, [refForm, resetForm]);

  const obterPeriodosPorModalidadeId = useCallback(async () => {
    if (anoLetivo && modalidadeId) {
      return FiltroHelper.obterPeriodos({
        consideraHistorico: false,
        modalidadeSelecionada: modalidadeId,
        anoLetivoSelecionado: anoLetivo,
      });
    }
    return [];
  }, [anoLetivo, modalidadeId]);

  useEffect(() => {
    setCarregandoPeriodos(true);
    if (periodosStore && periodosStore.length) setPeriodos(periodosStore);
    else {
      const obterPeriodos = async () => {
        const periodosLista = await obterPeriodosPorModalidadeId();
        setPeriodos(periodosLista);

        if (periodosLista && periodosLista.length === 1) {
          refForm.setFieldValue('semestre', String(periodosLista[0].valor));
          setValoresIniciais({
            ...valoresIniciais,
            modalidadeId,
            semestre: String(periodosLista[0].valor),
          });
        }
      };
      obterPeriodos();
    }
    setCarregandoPeriodos(false);
  }, [
    refForm,
    periodosStore,
    anoLetivo,
    modalidadeId,
    obterPeriodosPorModalidadeId,
  ]);

  const aoTrocarModalidadeId = id => {
    if (!id) refForm.setFieldValue('semestre', undefined);
    setModalidadeId(id);
    refForm.setFieldValue('dreId', undefined);
    refForm.setFieldValue('ueId', undefined);
    refForm.setFieldValue('turmaId', undefined);
    refForm.setFieldValue('opcaoAlunoId', '0');
  };

  const aoTrocarDreId = id => {
    if (!id) refForm.setFieldValue('ueId', undefined);
    setDreId(id);
  };

  const aoTrocarUeId = id => {
    if (!id) refForm.setFieldValue('turmaId', undefined);
  };

  const aoTrocarTurma = () => {
    refForm.setFieldValue('opcaoAlunoId', '0');
  };

  const opcoesAlunos = [
    { desc: 'Todos', valor: '0' },
    { desc: 'Selecionar Alunos', valor: '1' },
  ];

  const onSubmitFiltro = valores => {
    onFiltrar(valores);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={valoresIniciais}
      validate={valores => onSubmitFiltro(valores)}
      ref={refFormik => setRefForm(refFormik)}
      validateOnBlur={false}
      validateOnChange
    >
      {form => (
        <Form className="col-md-12 mb-4">
          <Linha className="row mb-2">
            <Grid cols={2}>
              <AnoLetivoDropDown
                form={form}
                onChange={ano => setAnoLetivo(ano)}
              />
            </Grid>
            <Grid
              cols={
                modalidadeId && String(modalidadeId) === String(modalidade.EJA)
                  ? 5
                  : 10
              }
            >
              <Loader loading={carregandoModalidades} tip="">
                <SelectComponent
                  form={form}
                  name="modalidadeId"
                  className="fonte-14"
                  onChange={valor => aoTrocarModalidadeId(valor)}
                  lista={modalidades}
                  valueOption="valor"
                  valueText="desc"
                  placeholder="Modalidade"
                  label="Modalidade"
                  disabled={
                    !anoLetivo || (modalidades && modalidades.length === 1)
                  }
                />
              </Loader>
            </Grid>
            {modalidadeId && String(modalidadeId) === String(modalidade.EJA) ? (
              <Grid cols={5}>
                <Loader loading={carregandoPeriodos} tip="">
                  <SelectComponent
                    form={form}
                    name="semestre"
                    className="fonte-14"
                    lista={periodos}
                    valueOption="valor"
                    valueText="desc"
                    placeholder="Semestre"
                    label="Semestre"
                    disabled={
                      !modalidadeId || (periodos && periodos.length === 1)
                    }
                  />
                </Loader>
              </Grid>
            ) : null}
          </Linha>
          <Linha className="row mb-2">
            <Grid cols={6}>
              <DreDropDown
                form={form}
                onChange={dre => aoTrocarDreId(dre)}
                label="Diretoria Regional de Educação (DRE)"
                desabilitado={!modalidadeId}
              />
            </Grid>
            <Grid cols={6}>
              <UeDropDown
                dreId={dreId}
                form={form}
                onChange={ue => aoTrocarUeId(ue)}
                label="Unidade Escolar (UE)"
              />
            </Grid>
          </Linha>
          <Linha className="row mb-2">
            <Grid cols={6}>
              <TurmasDropDown
                form={form}
                onChange={aoTrocarTurma}
                label="Turma"
              />
            </Grid>
            <Grid cols={6}>
              <SelectComponent
                form={form}
                name="opcaoAlunoId"
                className="fonte-14"
                lista={opcoesAlunos}
                valueOption="valor"
                valueText="desc"
                placeholder="Alunos"
                label="Alunos"
                disabled={
                  refForm &&
                  refForm.state &&
                  (!refForm.state.values.turmaId ||
                    refForm.state.values.turmaId === '0')
                }
              />
            </Grid>
          </Linha>
        </Form>
      )}
    </Formik>
  );
}

Filtro.propTypes = {
  onFiltrar: PropTypes.func,
  resetForm: PropTypes.bool,
};

Filtro.defaultProps = {
  onFiltrar: () => null,
  resetForm: false,
};

export default Filtro;
