﻿using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using SME.SGP.Infra;

namespace SME.SGP.Dominio.Interfaces
{
    public interface IRepositorioPendenciaParametroEvento : IRepositorioBase<PendenciaParametroEvento>
    {
        Task<IEnumerable<PendenciaParametroEventoDto>> ObterPendenciasEventoPorPendenciaId(long pendenciaId);
        Task<PendenciaParametroEvento> ObterPendenciaEventoPorPendenciaEParametroId(long pendenciaId, long parametroId);
    }
}
