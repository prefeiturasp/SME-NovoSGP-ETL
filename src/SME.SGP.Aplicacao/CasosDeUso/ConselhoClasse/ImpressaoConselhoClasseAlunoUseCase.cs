﻿using MediatR;
using SME.SGP.Aplicacao.Interfaces.CasosDeUso;
using SME.SGP.Dominio;
using SME.SGP.Infra.Dtos.Relatorios;
using System;
using System.Threading.Tasks;

namespace SME.SGP.Aplicacao
{
    public class ImpressaoConselhoClasseAlunoUseCase : IImpressaoConselhoClasseAlunoUseCase
    {
        private readonly IMediator mediator;

        public ImpressaoConselhoClasseAlunoUseCase(IMediator mediator)
        {
            this.mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }

        public async Task<bool> Executar(FiltroRelatorioConselhoClasseAlunoDto filtroRelatorioConselhoClasseAlunoDto)
        {
            var usuarioId = await mediator.Send(new ObterUsuarioLogadoIdQuery());

            if (usuarioId == 0)
                throw new NegocioException("Não foi possível localizar o usuário.");

            return await mediator.Send(new GerarRelatorioCommand(TipoRelatorio.ConselhoClasseAluno, filtroRelatorioConselhoClasseAlunoDto, usuarioId));
        }
    }
}
