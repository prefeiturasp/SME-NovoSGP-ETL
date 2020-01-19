﻿using Dapper;
using SME.SGP.Dominio;
using SME.SGP.Dominio.Interfaces;
using SME.SGP.Infra;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SME.SGP.Dados.Repositorios
{
    public class RepositorioFechamentoReabertura : RepositorioBase<FechamentoReabertura>, IRepositorioFechamentoReabertura
    {
        protected readonly ISgpContext database;

        public RepositorioFechamentoReabertura(ISgpContext database) : base(database)
        {
            this.database = database;
        }

        public async Task<PaginacaoResultadoDto<FechamentoReabertura>> Listar(long tipoCalendarioId, long? dreId, long? ueId, Paginacao paginacao)
        {
            StringBuilder query = new StringBuilder();

            if (paginacao == null || paginacao.QuantidadeRegistros == 0)
                paginacao = new Paginacao(1, 10);

            MontaQueryListarCabecalho(query);
            MontaQueryListarFrom(query);
            MontaQueryListarWhere(query, tipoCalendarioId, dreId, ueId);

            var retornoPaginado = new PaginacaoResultadoDto<FechamentoReabertura>();

            var lookup = new Dictionary<long, FechamentoReabertura>();

            if (paginacao.QuantidadeRegistros != 0)
                query.AppendFormat(" OFFSET {0} ROWS FETCH NEXT {1} ROWS ONLY ", paginacao.QuantidadeRegistrosIgnorados, paginacao.QuantidadeRegistros);

            await database.Conexao.QueryAsync<FechamentoReabertura, FechamentoReaberturaBimestre, FechamentoReabertura>(query.ToString(), (fechamento, bimestre) =>
           {
               FechamentoReabertura fechamentoReabertura;
               if (!lookup.TryGetValue(fechamento.Id, out fechamentoReabertura))
               {
                   fechamentoReabertura = fechamento;
                   lookup.Add(fechamento.Id, fechamentoReabertura);
               }

               fechamentoReabertura.Adicionar(bimestre);
               return fechamentoReabertura;
           }, new
           {
               tipoCalendarioId,
               dreId,
               ueId
           });

            retornoPaginado.Items = lookup.Values;

            query = new StringBuilder();
            MontaQueryListarCount(query, tipoCalendarioId, dreId, ueId);

            retornoPaginado.TotalRegistros = (await database.Conexao.QueryFirstOrDefaultAsync<int>(query.ToString(), new
            {
                tipoCalendarioId,
                dreId,
                ueId
            }));

            retornoPaginado.TotalPaginas = (int)Math.Ceiling((double)retornoPaginado.TotalRegistros / paginacao.QuantidadeRegistros);
            return retornoPaginado;
        }

        private void MontaQueryListarCabecalho(StringBuilder query)
        {
            query.AppendLine("select fr.*, frb.*");
        }

        private void MontaQueryListarCount(StringBuilder query, long tipoCalendarioId, long? dreId, long? ueId)
        {
            query.AppendLine("select count(fr.*)");
            query.AppendLine("from fechamento_reabertura fr");
            MontaQueryListarWhere(query, tipoCalendarioId, dreId, ueId);
        }

        private void MontaQueryListarFrom(StringBuilder query)
        {
            query.AppendLine("from fechamento_reabertura fr");
            query.AppendLine("inner");
            query.AppendLine("join fechamento_reabertura_bimestre frb");
            query.AppendLine("on frb.fechamento_reabertura_id = fr.id");
        }

        private void MontaQueryListarWhere(StringBuilder query, long tipoCalendarioId, long? dreId, long? ueId)
        {
            query.AppendLine("where excluido = false");

            if (tipoCalendarioId > 0)
                query.AppendLine("and fr.tipo_calendario_id = @tipoCalendarioId");

            if (dreId.HasValue && dreId.Value > 0)
                query.AppendLine("and fr.dre_id = @dreId");

            if (ueId.HasValue && ueId.Value > 0)
                query.AppendLine("and fr.ue_id = @ueId");
        }
    }
}