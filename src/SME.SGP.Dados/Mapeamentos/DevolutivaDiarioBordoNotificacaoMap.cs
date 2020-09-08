﻿using Dapper.FluentMap.Dommel.Mapping;
using SME.SGP.Dominio;

namespace SME.SGP.Dados.Mapeamentos
{
    public class DevolutivaDiarioBordoNotificacaoMap : DommelEntityMap<DevolutivaDiarioBordoNotificacao>
    {
        public DevolutivaDiarioBordoNotificacaoMap()
        {
            ToTable("devolutiva_diario_bordo_notificacao");
            Map(c => c.Id).ToColumn("id");
            Map(c => c.ObservacaoId).ToColumn("observacao_id");
            Map(c => c.NotificacaoId).ToColumn("notificacao_id");
        }
    }
}
