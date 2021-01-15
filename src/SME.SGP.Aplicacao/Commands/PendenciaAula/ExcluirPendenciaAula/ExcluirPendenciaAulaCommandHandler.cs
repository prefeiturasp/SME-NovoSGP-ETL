﻿using MediatR;
using SME.SGP.Dominio;
using SME.SGP.Dominio.Interfaces;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SME.SGP.Aplicacao
{
    public class ExcluirPendenciaAulaCommandHandler : IRequestHandler<ExcluirPendenciaAulaCommand, bool>
    {
        private readonly IMediator mediator;
        private readonly IRepositorioPendenciaAula repositorioPendenciaAula;

        public ExcluirPendenciaAulaCommandHandler(IMediator mediator, IRepositorioPendenciaAula repositorioPendenciaAula)
        {
            this.mediator = mediator ?? throw new System.ArgumentNullException(nameof(mediator));
            this.repositorioPendenciaAula = repositorioPendenciaAula ?? throw new System.ArgumentNullException(nameof(repositorioPendenciaAula));
        }

        public async Task<bool> Handle(ExcluirPendenciaAulaCommand request, CancellationToken cancellationToken)
        {
            var pendenciasId = await repositorioPendenciaAula.ObterPendenciaIdPorAula(request.AulaId, request.TipoPendenciaAula);
            foreach(var pendenciaId in pendenciasId)
            {
                await repositorioPendenciaAula.Excluir(pendenciaId, request.AulaId);

                await ExcluirPendenciaSeNaoHouverMaisPendenciaAula(pendenciaId);
            }
            return true;
        }

        private async Task ExcluirPendenciaSeNaoHouverMaisPendenciaAula(long pendenciaId)
        {
            var pendenciasAulasRestantes = await repositorioPendenciaAula.ObterPendenciasAulasPorPendencia(pendenciaId);
            if (pendenciasAulasRestantes == null || !pendenciasAulasRestantes.Any())
                await mediator.Send(new ExcluirPendenciaPorIdCommand(pendenciaId));
        }
    }
}
