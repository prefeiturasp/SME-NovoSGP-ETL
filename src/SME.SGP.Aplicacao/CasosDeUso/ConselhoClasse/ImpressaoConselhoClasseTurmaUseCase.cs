﻿using MediatR;
using SME.SGP.Aplicacao.Interfaces.CasosDeUso;
using SME.SGP.Infra.Dtos.Relatorios;
using SME.SGP.Infra.Enumerados;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SME.SGP.Aplicacao
{
    public class ImpressaoConselhoClasseTurmaUseCase : IImpressaoConselhoClassTurmaUseCase
    {
        private readonly IMediator mediator;

        public ImpressaoConselhoClasseTurmaUseCase(IMediator mediator)
        {
            this.mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }

        public Task<bool> Executar(FiltroRelatorioConselhoClasseDto filtroRelatorioConselhoClasseAlunoDto)
        {
            return mediator.Send(new GerarRelatorioCommand(TipoRelatorio.ConselhoClasseAluno, filtroRelatorioConselhoClasseAlunoDto));
        }
    }
}
