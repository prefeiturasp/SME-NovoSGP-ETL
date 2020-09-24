﻿using MediatR;
using SME.SGP.Infra;
using System;
using System.Threading.Tasks;

namespace SME.SGP.Aplicacao
{
    public class ObterPlanejamentoAnualPorTurmaComponenteUseCase : IObterPlanejamentoAnualPorTurmaComponenteUseCase
    {
        private readonly IMediator mediator;

        public ObterPlanejamentoAnualPorTurmaComponenteUseCase(IMediator mediator)
        {
            this.mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }

        public async Task<PlanejamentoAnualPeriodoEscolarDto> Executar(long turmaId, long componenteCurricularId, long periodoEscolarId)
        {
            return await mediator.Send(new ObterPlanejamentoAnualPorTurmaComponenteQuery(turmaId, componenteCurricularId, periodoEscolarId));
        }
    }
}