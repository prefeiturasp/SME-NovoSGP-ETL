﻿namespace SME.SGP.Dominio
{
    public class WorkflowAprovacaoNivelNotificacao
    {
        public Notificacao Notificacao { get; set; }
        public long NotificacaoId { get; set; }
        public WorkflowAprovacaoNivel WorkflowAprovacaoNivel { get; set; }
        public long WorkflowAprovacaoNivelId { get; set; }
    }
}