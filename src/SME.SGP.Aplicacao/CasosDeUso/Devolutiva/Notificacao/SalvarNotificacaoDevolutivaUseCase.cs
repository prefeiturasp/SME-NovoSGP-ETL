﻿using MediatR;
using Microsoft.Extensions.Configuration;
using SME.SGP.Aplicacao.Interfaces;
using SME.SGP.Dominio;
using SME.SGP.Dominio.Interfaces;
using SME.SGP.Infra;
using SME.SGP.Infra.Dtos;
using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SME.SGP.Aplicacao
{
    public class SalvarNotificacaoDevolutivaUseCase : ISalvarNotificacaoDevolutivaUseCase
    {
        private readonly IMediator mediator;
        private readonly IConfiguration configuration;
        private readonly IRepositorioNotificacaoDevolutiva repositorioNotificacaoDevolutiva;
        private readonly IServicoNotificacao servicoNotificacao;

        public SalvarNotificacaoDevolutivaUseCase(IMediator mediator, IConfiguration configuration, IServicoNotificacao servicoNotificacao,
            IRepositorioNotificacaoDevolutiva repositorioNotificacaoDevolutiva)
        {
            this.mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
            this.configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            this.servicoNotificacao = servicoNotificacao ?? throw new ArgumentNullException(nameof(servicoNotificacao));
            this.repositorioNotificacaoDevolutiva = repositorioNotificacaoDevolutiva ?? throw new ArgumentNullException(nameof(repositorioNotificacaoDevolutiva));
        }
        public async Task<bool> Executar(MensagemRabbit mensagemRabbit)
        {
            var dadosMensagem = mensagemRabbit.ObterObjetoMensagem<NotificarNovaCartaIntencoesObservacaoDto>();

            var turma = dadosMensagem.Turma;
            var usuarioLogado = dadosMensagem.Usuario;
            var cartaIntencoesObservacaoId = dadosMensagem.CartaIntencoesObservacaoId;

            var titulares = await mediator.Send(new ObterProfessoresTitularesDaTurmaQuery(turma.CodigoTurma));

            if (titulares != null)
            {
                var mensagem = new StringBuilder($"O usuário {usuarioLogado.Nome} ({usuarioLogado.CodigoRf}) inseriu uma nova observação na Carta de intenções da turma <strong>{turma.Nome}</strong> da <strong>{turma.Ue.Nome}</strong> ({turma.Ue.Dre.Abreviacao})");

                var hostAplicacao = configuration["UrlFrontEnd"];
                mensagem.AppendLine($"<br/><br/><a href='{hostAplicacao}planejamento/carta-intencoes'>Clique aqui para visualizar a observação.</a>");

                if (titulares.Count() == 1)
                    titulares = titulares.FirstOrDefault().Split(',');

                foreach (var titular in titulares)
                {
                    var codigoRf = titular.Trim();

                    if (codigoRf != usuarioLogado.CodigoRf)
                    {
                        var usuario = await mediator.Send(new ObterUsuarioPorRfQuery(codigoRf));
                        if (usuario != null)
                        {
                            var notificacao = new Notificacao()
                            {
                                Ano = DateTime.Now.Year,
                                Categoria = NotificacaoCategoria.Aviso,
                                Tipo = NotificacaoTipo.Planejamento,
                                Titulo = $"Nova observação na Carta de intenções da turma {turma.Nome}",
                                Mensagem = mensagem.ToString(),
                                UsuarioId = usuario.Id,
                                TurmaId = "",
                                UeId = "",
                                DreId = "",
                            };

                            await servicoNotificacao.SalvarAsync(notificacao);

                            var notificacaoObservacao = new NotificacaoCartaIntencoesObservacao()
                            {
                                NotificacaoId = notificacao.Id,
                                CartaIntencoesObservacaoId = cartaIntencoesObservacaoId
                            };

                            await repositorioNotificacaoCartaIntencoesObservacao.Salvar(notificacaoObservacao);

                        }

                    }
                }
                return true;
            }
            return false;
        }
    }
}
