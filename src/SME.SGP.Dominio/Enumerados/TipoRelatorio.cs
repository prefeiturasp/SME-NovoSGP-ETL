﻿using System.ComponentModel.DataAnnotations;

namespace SME.SGP.Dominio
{
    public enum TipoRelatorio
    {
        [Display(Name = "relatorios/alunos", ShortName = "RelatorioExemplo.pdf")]
        RelatorioExemplo = 1,

        [Display(Name = "relatorio/conselhoclassealuno", ShortName = "RelatorioConselhoClasse", Description = "Relatório de conselho de classe")]
        ConselhoClasseAluno = 2,

        [Display(Name = "relatorio/conselhoclasseturma", ShortName = "RelatorioConselhoTurma", Description = "Relatório de conselho de classe")]
        ConselhoClasseTurma = 3,

        [Display(Name = "relatorios/boletimescolar", ShortName = "BoletimEscolar", Description = "Boletim escolar")]
        Boletim = 4,

        [Display(Name = "relatorios/atafinalresultados", ShortName = "RelatorioAtaFinalResultados", Description = "Relatório Ata final de resultados")]
        AtaFinalResultados = 5,

        [Display(Name = "relatorios/faltas-frequencia", ShortName = "RelatorioFaltasFrequencia", Description = "Relatório de faltas e frequência")]
        FaltasFrequencia = 6,
        [Display(Name = "relatorios/historicoescolarfundamental", ShortName = "HistoricoEscolar", Description = "Histórico Escolar")]
        HistoricoEscolarFundamental = 7,

        [Display(Name = "relatorios/fechamentopendencias", ShortName = "FechamentoPendencias", Description = "Relatório de Pendências do Fechamento")]
        FechamentoPendencias = 8,

        [Display(Name = "relatorios/parecerconclusivo", ShortName = "ParecerConclusivo", Description = "Relatório de Parecer Conclusivo")]
        ParecerConclusivo = 9,

        [Display(Name = "relatorios/recuperacaoparalela", ShortName = "RecuperacaoParalela", Description = "Relatório de Recuperação Paralela")]
        RecuperacaoParalela = 10,

        [Display(Name = "relatorios/notasconceitosfinais", ShortName = "NotasEConceitosFinais", Description = "Relatório de Notas e Conceitos Finais")]
        NotasEConceitosFinais = 11,

        [Display(Name = "relatorios/compensacaoausencia", ShortName = "CompensacaoAusencia", Description = "Relatório de Compensação de Ausência")]
        CompensacaoAusencia = 12,

        [Display(Name = "relatorios/impressaocalendario", ShortName = "Calendario", Description = "Relatório Impressão do Calendário")]
        Calendario = 13,

        [Display(Name = "relatorios/planoaula", ShortName = "Plano de Aula", Description = "Relatório Plano de Aula")]
        PlanoAula = 14,

        [Display(Name = "relatorios/resumopap", ShortName = "ResumoPAP", Description = "Relatório de acompanhamento PAP - Resumos")]
        ResumoPAP = 15,

        [Display(Name = "relatorios/sondagem/matematica-por-turma", ShortName = "Relatório de Sondagem (Matemática)", Description = "Relatório de Sondagem (Matemática)")]
        RelatorioMatetimaticaPorTurma = 16,

        [Display(Name = "relatorios/sondagem/matematica-consolidado", ShortName = "MatematicaConsolidado", Description = "Matematica Consolidado")]
        RelatorioMatetimaticaConsolidado = 17,

        [Display(Name = "relatorios/controle-grade", ShortName = "ControleGrade", Description = "Relatório Controle de Grade")]
        ControleGrade = 18,

        [Display(Name = "relatorios/notificacoes", ShortName = "Notificacoes", Description = "Relatório de Notificações")]
        Notificacoes = 19,        

        [Display(Name = "relatorios/usuarios", ShortName = "Usuarios", Description = "Relatório de Usuários")]
        Usuarios = 20,

        [Display(Name = "relatorios/atribuicoes-cj", ShortName = "Atribuição CJ", Description = "Relatório de Atribuições de CJ")]
        AtribuicaoCJ = 22,
        
        [Display(Name = "relatorios/graficopap", ShortName = "GraficoPAP", Description = "Relatório de acompanhamento PAP - Gráficos")]
        GraficoPAP = 23,

        [Display(Name = "relatorios/alteracao-notas", ShortName = "AlteracaoNotas", Description = "Relatório de alterações de notas")]
        AlteracaoNotasBimestre = 24
    }
}
