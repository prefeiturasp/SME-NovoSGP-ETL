﻿using MediatR;
using SME.SGP.Dominio;
using SME.SGP.Dominio.Interfaces;
using SME.SGP.Infra;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace SME.SGP.Aplicacao
{
    public class ObterAlunosComNotaLancadaPorPeriodoEscolarUEQueryHandler : IRequestHandler<ObterAlunosComNotaLancadaPorPeriodoEscolarUEQuery, IEnumerable<AlunosFechamentoNotaDto>>
    {
        private readonly IRepositorioFechamentoNota repositorioFechamentoNota;

        public ObterAlunosComNotaLancadaPorPeriodoEscolarUEQueryHandler(IRepositorioFechamentoNota repositorioFechamentoNota)
        {
            this.repositorioFechamentoNota = repositorioFechamentoNota ?? throw new ArgumentNullException(nameof(repositorioFechamentoNota));
        }

        public async Task<IEnumerable<AlunosFechamentoNotaDto>> Handle(ObterAlunosComNotaLancadaPorPeriodoEscolarUEQuery request, CancellationToken cancellationToken)
        {
            return await repositorioFechamentoNota.ObterAComNotaLancadaPorPeriodoEscolarUE(request.UeId, request.PeriodoEscolarId);
        }
    }
}
