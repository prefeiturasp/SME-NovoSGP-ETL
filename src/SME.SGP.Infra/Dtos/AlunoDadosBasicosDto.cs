﻿using SME.SGP.Dominio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SME.SGP.Infra
{
    public class AlunoDadosBasicosDto
    {
        public string Nome { get; set; }
        public int NumeroChamada { get; set; }
        public DateTime DataNascimento { get; set; }
        public string CodigoEOL { get; set; }
        public SituacaoMatriculaAluno SituacaoCodigo { get; set; }
        public string Situacao { get; set; }
        public DateTime DataSituacao { get; set; }
        public double Frequencia { get; set; }
        public MarcadorFrequenciaDto Marcador { get; set; }
        public string NomeResponsavel { get; set; }
        public string TipoResponsavel { get; set; }
        public string CelularResponsavel { get; set; }
        public DateTime DataAtualizacaoContato { get; set; }

        /// <summary>
        /// Refere-se ao processo que a tela executa, se já foi realizado ou não
        /// </summary>
        public bool ProcessoConcluido { get; set; }

        public bool Desabilitado { get => EstaInativo() || TemMarcadorInativo(); }

        public bool TemMarcadorInativo()
            => Marcador != null &&
                (new[] { TipoMarcadorFrequencia.Transferido,
                        TipoMarcadorFrequencia.Remanejado,
                        TipoMarcadorFrequencia.Inativo}).Contains(Marcador.Tipo);

        public bool EstaInativo()
            => !(new[] { SituacaoMatriculaAluno.Ativo,
                        SituacaoMatriculaAluno.Rematriculado,
                        SituacaoMatriculaAluno.PendenteRematricula,
                        SituacaoMatriculaAluno.SemContinuidade,
                        SituacaoMatriculaAluno.Concluido
                    }).Contains(SituacaoCodigo);


        public static explicit operator AlunoDadosBasicosDto(AlunoPorTurmaResposta dadosAluno)
            => dadosAluno == null ? null : new AlunoDadosBasicosDto()
            {
                Nome = dadosAluno.NomeAluno,
                NumeroChamada = dadosAluno.NumeroAlunoChamada,
                DataNascimento = dadosAluno.DataNascimento,
                CodigoEOL = dadosAluno.CodigoAluno,
                SituacaoCodigo = dadosAluno.CodigoSituacaoMatricula,
                Situacao = dadosAluno.SituacaoMatricula,
                DataSituacao = dadosAluno.DataSituacao,
                NomeResponsavel = dadosAluno.NomeResponsavel,
                TipoResponsavel = dadosAluno.TipoResponsavel,
                CelularResponsavel = dadosAluno.CelularResponsavel,
                DataAtualizacaoContato = dadosAluno.DataAtualizacaoContato
            };
    }
}
