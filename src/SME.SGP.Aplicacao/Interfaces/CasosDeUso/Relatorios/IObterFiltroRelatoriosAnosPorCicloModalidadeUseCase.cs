﻿using SME.SGP.Dominio;
using SME.SGP.Infra;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SME.SGP.Aplicacao
{
    public interface IObterFiltroRelatoriosAnosPorCicloModalidadeUseCase
    {
        Task<IEnumerable<OpcaoDropdownDto>> Executar(long cicloId, Modalidade modalidade);
    }
}
