﻿using SME.SGP.Dominio;
using SME.SGP.Infra;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SME.SGP.Aplicacao
{
    public interface IConsultasConselhoClasseAluno
    {
        Task<ConselhoClasseAluno> ObterPorConselhoClasseAsync(long conselhoClasseId, string alunoCodigo);
        Task<bool> ExisteConselhoClasseUltimoBimestreAsync(Turma turma, string alunoCodigo);
        Task<ParecerConclusivoDto> ObterParecerConclusivo(long conselhoClasseId, long fechamentoTurmaId, string alunoCodigo);
        Task<IEnumerable<ConselhoDeClasseGrupoMatrizDto>> ObterListagemDeSinteses(long conselhoClasseId, long fechamentoTurmaId, string alunoCodigo);
    }
}
