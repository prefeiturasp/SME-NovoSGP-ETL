import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Componentes
import { SelectComponent } from '~/componentes';

// Servicos
import AtribuicaoEsporadicaServico from '~/servicos/Paginas/AtribuicaoEsporadica';

import FiltroHelper from '~/componentes-sgp/filtro/helper';
import tipoEscolaDTO from '~/dtos/tipoEscolaDto';

function UeDropDown({ form, onChange, dreId, label, desabilitado }) {
  const [listaUes, setListaUes] = useState([]);

  const ehInfantil = valor => {
    if (listaUes && listaUes.length) {
      const ue = listaUes.find(item => item.codigo === valor);
      return ue.ehInfantil;
    }
    return false;
  };

  async function buscarUes() {
    const { data } = await AtribuicaoEsporadicaServico.buscarUes(dreId);
    if (data) {
      const lista = data.map(item => ({
        desc: item.nome,
        valor: item.codigo,
        ehInfantil: item.ehInfantil,
      }));
      setListaUes(lista);
      if (lista.length === 1) {
        form.setFieldValue('ueId', lista[0].valor);
        onChange(lista[0].valor, ehInfantil(lista[0].valor));
      }
    }
  }

  useEffect(() => {
    if (dreId) {
      buscarUes();
    } else {
      setListaUes([]);
    }
  }, [dreId]);

  return (
    <SelectComponent
      form={form}
      name="ueId"
      className="fonte-14"
      label={!label ? null : label}
      onChange={v => {
        onChange(v, ehInfantil(v));
      }}
      lista={listaUes}
      valueOption="valor"
      valueText="desc"
      placeholder="Unidade Escolar (UE)"
      disabled={listaUes.length === 1 || desabilitado}
    />
  );
}

UeDropDown.propTypes = {
  form: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.object),
    PropTypes.any,
  ]),
  onChange: PropTypes.func,
  dreId: PropTypes.string,
  label: PropTypes.string,
  desabilitado: PropTypes.bool,
};

UeDropDown.defaultProps = {
  form: {},
  onChange: () => {},
  dreId: '',
  label: null,
  desabilitado: null,
};

export default UeDropDown;
