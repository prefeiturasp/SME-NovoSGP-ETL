﻿using SME.SGP.Dominio.Entidades;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SME.SGP.Dominio.Interfaces.Repositorios
{
    public interface IRepositorioOcorrencia
    {
        Task<Ocorrencia> ObterPorIdAsync(long id);
        Task<long> SalvarAsync(Ocorrencia ocorrencia);
    }
}