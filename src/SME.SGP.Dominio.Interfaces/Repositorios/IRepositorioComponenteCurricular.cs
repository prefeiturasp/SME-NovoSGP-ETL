﻿using SME.SGP.Infra;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SME.SGP.Dominio.Interfaces
{
    public interface IRepositorioComponenteCurricular
    {
        Task<IEnumerable<ComponenteCurricularDto>> ListarComponentesCurriculares();
        void SalvarVarias(IEnumerable<ComponenteCurricularDto> componentesCurriculares);
        Task<IEnumerable<DisciplinaDto>> ObterDisciplinasPorIds(long[] ids);
    }
}