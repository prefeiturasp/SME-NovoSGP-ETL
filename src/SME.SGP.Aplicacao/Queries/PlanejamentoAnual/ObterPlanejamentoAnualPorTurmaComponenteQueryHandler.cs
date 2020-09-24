﻿using MediatR;
using SME.SGP.Dominio.Interfaces;
using SME.SGP.Infra;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SME.SGP.Aplicacao
{
    public class ObterPlanejamentoAnualPorTurmaComponenteQueryHandler : IRequestHandler<ObterPlanejamentoAnualPorTurmaComponenteQuery, PlanejamentoAnualPeriodoEscolarDto>
    {
        private readonly IRepositorioPlanejamentoAnualPeriodoEscolar repositorioPlanejamentoAnualPeriodoEscolar;

        public ObterPlanejamentoAnualPorTurmaComponenteQueryHandler(IRepositorioPlanejamentoAnualPeriodoEscolar repositorioPlanejamentoAnualPeriodoEscolar)
        {
            this.repositorioPlanejamentoAnualPeriodoEscolar = repositorioPlanejamentoAnualPeriodoEscolar ?? throw new System.ArgumentNullException(nameof(repositorioPlanejamentoAnualPeriodoEscolar));
        }

        public async Task<PlanejamentoAnualPeriodoEscolarDto> Handle(ObterPlanejamentoAnualPorTurmaComponenteQuery request, CancellationToken cancellationToken)
        {
            var planejamento = new PlanejamentoAnualPeriodoEscolarDto
            {
                Componentes = new List<PlanejamentoAnualComponenteDto>(),
            };

            var periodo = await repositorioPlanejamentoAnualPeriodoEscolar.ObterPlanejamentoAnualPeriodoEscolarPorTurmaEComponenteCurricular(request.TurmaId, request.ComponenteCurricularId, request.PeriodoEscolarId);
            if (periodo != null)
            {
                planejamento.Bimestre = periodo.PeriodoEscolar != null ? periodo.PeriodoEscolar.Bimestre : 0;
                planejamento.Componentes = periodo.ComponentesCurriculares?.Select(c => new PlanejamentoAnualComponenteDto
                {
                    ComponenteCurricularId = c.ComponenteCurricularId,
                    Descricao = c.Descricao,
                    ObjetivosAprendizagemId = c.ObjetivosAprendizagem?.Select(o => o.ObjetivoAprendizagemId),
                    Auditoria = (AuditoriaDto)c
                })?.ToList();
                planejamento.PeriodoEscolarId = periodo.PeriodoEscolar.Id;
            }

            return planejamento;

        }
    }
}