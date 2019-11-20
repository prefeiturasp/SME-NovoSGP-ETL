﻿using Microsoft.AspNetCore.Http;
using SME.SGP.Infra;
using SME.SGP.Infra.Interfaces;
using System;
using System.Linq;

namespace SME.SGP.Aplicacao
{
    public abstract class ConsultasBase
    {
        private readonly IContextoAplicacao contextoAplicacao;

        public ConsultasBase(IContextoAplicacao contextoAplicacao)
        {
            this.contextoAplicacao = contextoAplicacao ?? throw new ArgumentNullException(nameof(contextoAplicacao));
        }

        public Paginacao Paginacao
        {
            get
            {
                var numeroPaginaQueryString = contextoAplicacao.ObterVarivel<string>("NumeroPagina");
                var numeroRegistrosQueryString = contextoAplicacao.ObterVarivel<string>("NumeroRegistros");

                if (string.IsNullOrWhiteSpace(numeroPaginaQueryString) || string.IsNullOrWhiteSpace(numeroRegistrosQueryString))
                    return new Paginacao(0, 0);

                var numeroPagina = int.Parse(numeroPaginaQueryString);
                var numeroRegistros = int.Parse(numeroRegistrosQueryString);

                return new Paginacao(numeroPagina, numeroRegistros);
            }
        }
    }
}