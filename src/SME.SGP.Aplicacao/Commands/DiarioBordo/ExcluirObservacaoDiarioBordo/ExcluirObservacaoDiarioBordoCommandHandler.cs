﻿using MediatR;
using SME.SGP.Dominio;
using SME.SGP.Dominio.Interfaces;
using System.Threading;
using System.Threading.Tasks;
using System;
using SME.SGP.Infra;
using SME.SGP.Infra.Dtos;

namespace SME.SGP.Aplicacao
{
    public class ExcluirObservacaoDiarioBordoCommandHandler : IRequestHandler<ExcluirObservacaoDiarioBordoCommand, bool>
    {
        private readonly IRepositorioDiarioBordoObservacao repositorioDiarioBordoObservacao;
        private readonly IMediator mediator;

        public ExcluirObservacaoDiarioBordoCommandHandler(IRepositorioDiarioBordoObservacao repositorioDiarioBordoObservacao, IMediator mediator)
        {
            this.repositorioDiarioBordoObservacao = repositorioDiarioBordoObservacao ?? throw new ArgumentNullException(nameof(repositorioDiarioBordoObservacao));
            this.mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }

        public async Task<bool> Handle(ExcluirObservacaoDiarioBordoCommand request, CancellationToken cancellationToken)
        {
            var diarioBordoObservacao = await repositorioDiarioBordoObservacao.ObterPorIdAsync(request.ObservacaoId);
            if (diarioBordoObservacao == null)
                throw new NegocioException("Observação do diário de bordo não encontrada.");

            await mediator.Send(new PublicarFilaSgpCommand(RotasRabbit.RotaExcluirNotificacaoDiarioBordo,
                      new ExcluirNotificacaoDiarioBordoDto(request.ObservacaoId), Guid.NewGuid(), null));

            diarioBordoObservacao.ValidarUsuarioAlteracao(request.UsuarioId);
            diarioBordoObservacao.Remover();

            await repositorioDiarioBordoObservacao.SalvarAsync(diarioBordoObservacao);
            return true;
        }
    }
}
