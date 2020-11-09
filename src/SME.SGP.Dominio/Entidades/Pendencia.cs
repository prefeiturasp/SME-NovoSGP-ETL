﻿using System;
using System.Linq;

namespace SME.SGP.Dominio
{
    public class Pendencia : EntidadeBase
    {
        public Pendencia(TipoPendencia tipo, string titulo = "", string descricao = "")
        {
            Situacao = SituacaoPendencia.Pendente;
            Tipo = tipo;
            Titulo = titulo;
            Descricao = descricao;
        }

        protected Pendencia()
        {
        }

        public string Descricao { get; set; }
        public SituacaoPendencia Situacao { get; set; }
        public TipoPendencia Tipo { get; set; }
        public string Titulo { get; set; }

        public bool EhPendenciaFechamento()
            => new TipoPendencia[] {
                TipoPendencia.AvaliacaoSemNotaParaNenhumAluno,
                TipoPendencia.AulasReposicaoPendenteAprovacao,
                TipoPendencia.AulasSemPlanoAulaNaDataDoFechamento,
                TipoPendencia.AulasSemFrequenciaNaDataDoFechamento,
                TipoPendencia.ResultadosFinaisAbaixoDaMedia,
                TipoPendencia.AlteracaoNotaFechamento
            }.Contains(Tipo);

        public bool EhPendenciaAula()
            => new TipoPendencia[] {
                TipoPendencia.Frequencia,
                TipoPendencia.PlanoAula,
                TipoPendencia.DiarioBordo,
                TipoPendencia.Avaliacao,
                TipoPendencia.AulaNaoLetivo
            }.Contains(Tipo);

        public bool EhPendenciaCalendarioUe()
            => new TipoPendencia[] {
                TipoPendencia.CalendarioLetivoInsuficiente
            }.Contains(Tipo);

        public bool EhPendenciaCadastroEvento()
            => new TipoPendencia[] {
                TipoPendencia.CadastroEventoPendente
            }.Contains(Tipo);
    }
}