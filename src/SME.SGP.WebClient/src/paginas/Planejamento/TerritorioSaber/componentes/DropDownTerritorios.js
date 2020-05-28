import React, { useEffect, useState } from 'react';
import t from 'prop-types';

// Redux
import { useSelector } from 'react-redux';

// Componentes
import { SelectComponent, Loader } from '~/componentes';

// Serviços
import AbrangenciaServico from '~/servicos/Abrangencia';

function DropDownTerritorios({ onChangeTerritorio, territorioSelecionado }) {
  const [carregando, setCarregando] = useState(false);
  const [listaTerritorios, setListaTerritorios] = useState([]);

  const { turmaSelecionada } = useSelector(state => state.usuario);

  useEffect(() => {
    async function buscarTerritorios() {
      setCarregando(true);
      const { data } = await AbrangenciaServico.buscarDisciplinas(
        turmaSelecionada.turma
      );
      if (data) {
        const lista = data.filter(x => x.territorioSaber === true);
        setListaTerritorios(lista);
      }
      setCarregando(false);
    }
    if (Object.keys(turmaSelecionada).length > 0) {
      onChangeTerritorio(undefined);
      buscarTerritorios();
    } else {
      setListaTerritorios([]);
    }
  }, [onChangeTerritorio, turmaSelecionada, turmaSelecionada.turma]);

  useEffect(() => {
    if (listaTerritorios.length === 1) {
      onChangeTerritorio(
        String(listaTerritorios[0].codigoComponenteCurricular)
      );
    }
  }, [listaTerritorios, onChangeTerritorio]);

  return (
    <Loader tip={false} loading={carregando}>
      <SelectComponent
        name="territorio"
        id="territorio"
        lista={listaTerritorios}
        valueOption="codigoComponenteCurricular"
        valueText="nome"
        onChange={valor => onChangeTerritorio(valor)}
        valueSelect={territorioSelecionado || undefined}
        placeholder="Selecione um território"
      />
    </Loader>
  );
}

DropDownTerritorios.propTypes = {
  onChangeTerritorio: t.func,
  territorioSelecionado: t.oneOfType([t.any]),
};

DropDownTerritorios.defaultProps = {
  onChangeTerritorio: () => null,
  territorioSelecionado: {},
};

export default DropDownTerritorios;
