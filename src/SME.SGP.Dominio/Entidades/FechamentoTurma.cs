﻿using System;
using System.Collections.Generic;
using System.Text;

namespace SME.SGP.Dominio
{
    public class FechamentoTurma: EntidadeBase
    {
        protected FechamentoTurma() { }
        public FechamentoTurma(long id, long turmaId, long periodoEscolarId)
        {
            Id = id;
            TurmaId = turmaId;
            PeriodoEscolarId = periodoEscolarId;
        }
        public FechamentoTurma(Turma turma, PeriodoEscolar periodoEscolar)
        {
            Turma = turma;
            TurmaId = turma.Id;

            PeriodoEscolar = periodoEscolar;
            PeriodoEscolarId = periodoEscolar.Id;
        }

        public long? PeriodoEscolarId { get; set; }
        public PeriodoEscolar PeriodoEscolar { get; set; }
        public long TurmaId { get; set; }
        public Turma Turma { get; set; }
        public bool Migrado { get; set; }
        public bool Excluido { get; set; }

        public void AdicionarPeriodoEscolar(PeriodoEscolar periodoEscolar)
        {
            PeriodoEscolar = periodoEscolar;
        }
    }
}
