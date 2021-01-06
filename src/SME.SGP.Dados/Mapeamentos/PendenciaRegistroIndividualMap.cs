﻿using SME.SGP.Dominio.Entidades;

namespace SME.SGP.Dados.Mapeamentos
{
    public class PendenciaRegistroIndividualMap : BaseMap<PendenciaRegistroIndividual>
    {
        public PendenciaRegistroIndividualMap()
        {
            ToTable("pedencia_registro_individual");
            Map(x => x.PendenciaId).ToColumn("pendencia_id");
            Map(x => x.Turma).ToColumn("turma_id");
        }
    }
}