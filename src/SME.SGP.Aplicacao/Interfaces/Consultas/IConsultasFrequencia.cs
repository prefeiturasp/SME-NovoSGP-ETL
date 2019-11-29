﻿using SME.SGP.Infra;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SME.SGP.Aplicacao
{
    public interface IConsultasFrequencia
    {
        Task<IEnumerable<DisciplinaDto>> ObterDisciplinasLecionadasPeloProfessorPorTurma(string turmaId);

        Task<FrequenciaDto> ObterListaFrequenciaPorAula(long aulaId);
    }
}