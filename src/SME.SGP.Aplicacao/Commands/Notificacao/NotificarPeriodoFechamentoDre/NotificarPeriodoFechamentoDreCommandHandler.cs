﻿using MediatR;
using SME.SGP.Dominio;
using SME.SGP.Infra;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace SME.SGP.Aplicacao
{
    public class NotificarPeriodoFechamentoDreCommandHandler : IRequestHandler<NotificarPeriodoFechamentoDreCommand, bool>
    {
        private readonly IMediator mediator;

        public NotificarPeriodoFechamentoDreCommandHandler(IMediator mediator)
        {
            this.mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }

        public async Task<bool> Handle(NotificarPeriodoFechamentoDreCommand request, CancellationToken cancellationToken)
        {
            var ano = DateTime.Now.Year;
            var ues = await mediator.Send(new ObterUEsSemPeriodoFechamentoQuery(request.PeriodoFechamentoBimestre.PeriodoEscolarId, ano, request.ModalidadeTipoCalendario));

            await EnviarNotificacaoDre(ues, request.PeriodoFechamentoBimestre, request.ModalidadeTipoCalendario, ano);

            return true;
        }

        private async Task EnviarNotificacaoDre(IEnumerable<Ue> ues, PeriodoFechamentoBimestre periodoFechamentoBimestre, ModalidadeTipoCalendario modalidadeTipoCalendario, int ano)
        {
            var grupoDres = ues.GroupBy(a => a.DreId);

            foreach (var grupoDre in grupoDres)
            {
                await NotificarDre(grupoDre, modalidadeTipoCalendario, ano);
            }
        }

        private async Task NotificarDre(IGrouping<long, Ue> grupoDre, ModalidadeTipoCalendario modalidadeTipoCalendario, int ano)
        {
            var dre = grupoDre.First().Dre;
            var titulo = $"UEs que não cadastraram o período de fechamento - {modalidadeTipoCalendario.Name()} {ano} ({dre.Abreviacao})";
            var mensagem = new StringBuilder($"As UEs abaixo ainda não cadastraram o período de fechamento para o tipo de calendário <b>{modalidadeTipoCalendario.Name()} {ano} ({dre.Abreviacao}</b>.<br/>");

            mensagem.Append("<ul>");
            foreach(var ue in grupoDre)
            {
                mensagem.Append($"<li>{ue.TipoEscola.ShortName()} {ue.Nome}</li>");
            }
            mensagem.Append("</ul>");

            await mediator.Send(new EnviarNotificacaoCommand(titulo, mensagem.ToString(), NotificacaoCategoria.Aviso, NotificacaoTipo.Calendario, ObterCargosDre(), dre.CodigoDre));

            var adminsDre = await ObterUsuariosDre(dre.CodigoDre);
            if (adminsDre != null && adminsDre.Any())
                await mediator.Send(new EnviarNotificacaoUsuariosCommand(titulo, mensagem.ToString(), NotificacaoCategoria.Aviso, NotificacaoTipo.Calendario, adminsDre, dre.CodigoDre));
        }

        private async Task<IEnumerable<long>> ObterUsuariosDre(string dreCodigo)
        {
            var funcionarios = await mediator.Send(new ObterFuncionariosDreOuUePorPerfisQuery(dreCodigo, ObterPerfisDre()));

            var listaUsuarios = new List<long>();
            foreach (var funcionario in funcionarios)
                listaUsuarios.Add(await mediator.Send(new ObterUsuarioIdPorRfOuCriaQuery(funcionario));

            return listaUsuarios;
        }

        private IEnumerable<Guid> ObterPerfisDre()
            => new List<Guid>() { Perfis.PERFIL_ADMDRE, Perfis.PERFIL_SUPERVISOR };

        private Cargo[] ObterCargosDre()
            => new[] { Cargo.Supervisor };
    }
}
