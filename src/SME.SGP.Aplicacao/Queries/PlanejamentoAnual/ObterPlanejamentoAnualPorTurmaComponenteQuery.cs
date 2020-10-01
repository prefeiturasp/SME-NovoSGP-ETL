﻿using FluentValidation;
using MediatR;
using SME.SGP.Infra;

namespace SME.SGP.Aplicacao
{
    public class ObterPlanejamentoAnualPorTurmaComponenteQuery : IRequest<PlanejamentoAnualPeriodoEscolarDto>
    {
        public ObterPlanejamentoAnualPorTurmaComponenteQuery(long turmaId, long componenteCurricularId, long periodoEscolarId)
        {
            TurmaId = turmaId;
            ComponenteCurricularId = componenteCurricularId;
            PeriodoEscolarId = periodoEscolarId;
        }

        public long TurmaId { get; set; }
        public long ComponenteCurricularId { get; set; }
        public long PeriodoEscolarId { get; set; }
    }

    public class ObterPlanejamentoAnualPorTurmaComponenteQueryValidator : AbstractValidator<ObterPlanejamentoAnualPorTurmaComponenteQuery>
    {
        public ObterPlanejamentoAnualPorTurmaComponenteQueryValidator()
        {
            RuleFor(c => c.TurmaId)
                .NotEmpty()
                .WithMessage("A turma deve ser informada.");

            RuleFor(c => c.ComponenteCurricularId)
                .NotEmpty()
                .WithMessage("O componente curricular deve ser informado.");

            RuleFor(c => c.PeriodoEscolarId)
                .NotEmpty()
                .WithMessage("O período escolar deve ser informado.");
        }
    }
}
