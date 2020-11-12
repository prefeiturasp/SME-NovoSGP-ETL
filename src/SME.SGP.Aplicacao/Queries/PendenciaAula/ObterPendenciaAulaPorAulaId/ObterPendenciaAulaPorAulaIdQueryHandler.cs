﻿using MediatR;
using SME.SGP.Dominio.Interfaces;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SME.SGP.Aplicacao
{
    public class ObterPendenciaAulaPorAulaIdQueryHandler : IRequestHandler<ObterPendenciaAulaPorAulaIdQuery, long>
    {
        private readonly IRepositorioPendenciaAula repositorioPendenciaAula;

        public ObterPendenciaAulaPorAulaIdQueryHandler(IRepositorioPendenciaAula repositorioPendenciaAula)
        {
            this.repositorioPendenciaAula = repositorioPendenciaAula ?? throw new ArgumentNullException(nameof(repositorioPendenciaAula));
        }

        public async Task<long> Handle(ObterPendenciaAulaPorAulaIdQuery request, CancellationToken cancellationToken)
                  => await repositorioPendenciaAula.ObterPendenciaAulaPorAulaId(request.AulaId, request.TipoPendencia);
    }
}
