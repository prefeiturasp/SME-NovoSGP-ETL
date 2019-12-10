﻿using System.Collections.Generic;
using System.Threading.Tasks;

namespace SME.SGP.Dominio.Interfaces
{
    public interface IRepositorioAtividadeAvaliativaRegencia : IRepositorioBase<AtividadeAvaliativaRegencia>
    {
        Task<IEnumerable<AtividadeAvaliativaRegencia>> Listar(long idAtividadeAvaliativa);
    }
}