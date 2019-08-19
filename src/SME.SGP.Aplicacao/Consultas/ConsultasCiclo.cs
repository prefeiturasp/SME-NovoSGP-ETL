﻿using SME.SGP.Dominio.Interfaces;
using SME.SGP.Dto;
using System.Collections.Generic;

namespace SME.SGP.Aplicacao
{
    public class ConsultasCiclo : IConsultasCiclo
    {
        private readonly IRepositorioCiclo repositorioCiclo;

        public ConsultasCiclo(IRepositorioCiclo repositorioCiclo)
        {
            this.repositorioCiclo = repositorioCiclo ?? throw new System.ArgumentNullException(nameof(repositorioCiclo));
        }

        public IEnumerable<CicloDto> Listar(IEnumerable<int> idsTurmas)
        {
            return repositorioCiclo.ObterCiclosPorTurma(idsTurmas);
        }

        public CicloDto Selecionar(int ano)
        {
            return repositorioCiclo.ObterCicloPorAno(ano);
        }
    }
}