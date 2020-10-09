﻿using System.Threading.Tasks;

namespace SME.SGP.Dominio.Interfaces
{
    public interface IRepositorioPlanejamentoAnual : IRepositorioBase<PlanejamentoAnual>
    {
        Task<PlanejamentoAnual> ObterPorTurmaEComponenteCurricularPeriodoEscolar(long turmaId, long componenteCurricularId, long periodoEscolarId);
        Task<long> ObterIdPorTurmaEComponenteCurricular(long turmaId, long componenteCurricularId);
        Task<PlanejamentoAnual> ObterPlanejamentoSimplificadoPorTurmaEComponenteCurricular(long turmaId, long componenteCurricularId);
    }
}
