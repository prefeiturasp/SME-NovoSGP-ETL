﻿using SME.SGP.Infra;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SME.SGP.Dominio.Interfaces
{
    public interface IRepositorioEvento : IRepositorioBase<Evento>
    {
        bool ExisteEventoNaMesmaDataECalendario(DateTime dataInicio, long tipoCalendarioId);

        Task<PaginacaoResultadoDto<Evento>> Listar(long? tipoCalendarioId, long? tipoEventoId, string nomeEvento, DateTime? dataInicio, DateTime? dataFim, Paginacao paginacao, string dreId, string ueId);


        Task<IEnumerable<CalendarioEventosNoDiaRetornoDto>> ObterEventosPorDia(CalendarioEventosFiltroDto calendarioEventosMesesFiltro, int mes, int dia);

        Task<IEnumerable<Evento>> ObterEventosPorRecorrencia(long eventoId, long eventoPaiId, DateTime dataEvento);

        Task<IEnumerable<Evento>> ObterEventosPorTipoETipoCalendario(long tipoEventoCodigo, long tipoCalendarioId);

        Task<IEnumerable<EventosPorDiaRetornoQueryDto>> ObterQuantidadeDeEventosPorDia(CalendarioEventosFiltroDto calendarioEventosMesesFiltro, int mes);

        Task<IEnumerable<CalendarioEventosMesesDto>> ObterQuantidadeDeEventosPorMeses(CalendarioEventosFiltroDto calendarioEventosMesesFiltro);
        bool ExisteEventoPorTipoCalendarioId(long tipoCalendarioId);
        bool ExisteEventoPorFeriadoId(long feriadoId);
        bool ExisteEventoPorEventoTipoId(long eventoTipoId);
    }
}