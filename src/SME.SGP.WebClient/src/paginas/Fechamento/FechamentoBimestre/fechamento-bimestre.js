import { Tabs, Tooltip } from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Colors, Loader } from '~/componentes';
import Cabecalho from '~/componentes-sgp/cabecalho';
import Alert from '~/componentes/alert';
import Button from '~/componentes/button';
import Card from '~/componentes/card';
import Grid from '~/componentes/grid';
import SelectComponent from '~/componentes/select';
import { ContainerTabsCard } from '~/componentes/tabs/tabs.css';
import FechamentoBimestreLista from './fechamento-bimestre-lista/fechamento-bimestre-lista';

const FechamentoBismestre = () => {
  const { TabPane } = Tabs;
  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;
  const [carregandoBimestres, setCarregandoBimestres] = useState(false);
  const [listaDisciplinas, setListaDisciplinas] = useState([]);
  const [disciplinaIdSelecionada, setDisciplinaIdSelecionada] = useState(null);
  const [desabilitarDisciplina, setDesabilitarDisciplina] = useState(
    listaDisciplinas && listaDisciplinas.length === 1
  );
  const [modoEdicao, setModoEdicao] = useState(false);
  const [somenteConsulta, setSomenteConsulta] = useState(false);
  const [bimestreCorrente, setBimestreCorrente] = useState('1Bimestre');
  const [dados, setDados] = useState({
    totalAulasPrevistas: 343,
    totalAulasDadas: 300,
    lista: [
      {
        contador: 1,
        informacao: 'Estudante transferido em 01/02/2020',
        nome: 'Alvaro Ramos Grassi',
        nota_conceito: 8.5,
        faltas_bimestre: 12,
        ausencias_compensadas: 12,
        frequencia: 70,
        ativo: true,
        regencia: [
          {
            disciplina: 'Português',
            nota: 2,
          },
          {
            disciplina: 'Matemática',
            nota: 3,
          },
          {
            disciplina: 'História',
            nota: 4,
          },
        ],
      },
      {
        contador: 2,
        nome: 'Aline  Grassi',
        nota_conceito: 9,
        faltas_bimestre: 3,
        ausencias_compensadas: 3,
        frequencia: 89,
        ativo: true,
      },
      {
        contador: 3,
        nome: 'Valentina  Grassi',
        nota_conceito: undefined,
        faltas_bimestre: undefined,
        ausencias_compensadas: undefined,
        frequencia: undefined,
        ativo: false,
        informacao: 'desabilitado',
      },
    ],
  });

  const onChangeDisciplinas = () => { };

  const onClickVoltar = () => { };

  const onClickCancelar = () => { };

  const onClickSalvar = () => { };

  const onChangeTab = async numeroBimestre => {
    setBimestreCorrente(numeroBimestre);
  };

  return (
    <>
      {!turmaSelecionada.turma ? (
        <Grid cols={12} className="p-0">
          <Alert
            alerta={{
              tipo: 'warning',
              id: 'AlertaTurmaFechamentoBimestre',
              mensagem: 'Você precisa escolher uma turma.',
              estiloTitulo: { fontSize: '18px' },
            }}
            className="mb-2"
          />
        </Grid>
      ) : null}{' '}
      <Cabecalho pagina="Fechamento" />
      <Loader loading={carregandoBimestres}>
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
                  label="Cancelar"
                  color={Colors.Roxo}
                  border
                  className="mr-2"
                  onClick={onClickCancelar}
                  disabled={!modoEdicao || somenteConsulta}
                />
                <Button
                  label="Salvar"
                  color={Colors.Roxo}
                  border
                  bold
                  className="mr-2"
                  onClick={onClickSalvar}
                  disabled={!modoEdicao || somenteConsulta}
                />
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="row">
              <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-4">
                <SelectComponent
                  id="disciplina"
                  name="disciplinaId"
                  lista={listaDisciplinas}
                  valueOption="codigoComponenteCurricular"
                  valueText="nome"
                  valueSelect={disciplinaIdSelecionada}
                  onChange={onChangeDisciplinas}
                  placeholder="Selecione um componente curricular"
                  disabled={desabilitarDisciplina || !turmaSelecionada.turma}
                />
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-2">
                <ContainerTabsCard
                  type="card"
                  onChange={onChangeTab}
                  activeKey={bimestreCorrente}
                >
                  <TabPane tab="1º Bimestre" key="1Bimestre">
                    <FechamentoBimestreLista
                      dados={dados}
                    />
                  </TabPane>

                  <TabPane tab="2º Bimestre" key="2Bimestre">
                    <FechamentoBimestreLista
                      dados={dados}
                    />
                  </TabPane>

                  <TabPane tab="3º Bimestre" key="3Bimestre">
                    <FechamentoBimestreLista
                      dados={dados}
                    />
                  </TabPane>

                  <TabPane tab="4º Bimestre" key="4Bimestre">
                    <FechamentoBimestreLista
                      dados={dados}
                    />
                  </TabPane>

                  <TabPane tab="Final" key="final">
                    teste
                  </TabPane>
                </ContainerTabsCard>
              </div>
            </div>
          </div>
        </Card>
      </Loader>
    </>
  );
};

export default FechamentoBismestre;
