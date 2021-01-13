﻿using MediatR;
using SME.SGP.Infra;
using System;
using System.Threading.Tasks;

namespace SME.SGP.Aplicacao
{
    public class AlterarNotificacaoObservacaoDiarioBordoUseCase : IAlterarNotificacaoObservacaoDiarioBordoUseCase
    {
        private readonly IMediator mediator;

        public AlterarNotificacaoObservacaoDiarioBordoUseCase(IMediator mediator)
        {
            this.mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }

        public async Task<AuditoriaDto> Executar(AlterarNotificacaoDiarioBordoDto dto)
        {
            return await mediator.Send(new AlterarNotificacaoDiarioBordoCommand(dto.ObservacaoId, dto.UsuarioId));
        }
    }
}
