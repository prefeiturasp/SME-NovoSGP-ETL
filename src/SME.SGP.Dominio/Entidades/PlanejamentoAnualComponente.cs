﻿using System.Collections.Generic;

namespace SME.SGP.Dominio
{
    public class PlanejamentoAnualComponente : EntidadeBase
    {
        public long ComponenteCurricularId { get; set; }
        public string Descricao { get; set; }
        public long PlanejamentoAnualPeriodoEscolarId { get; set; }
        public IEnumerable<PlanejamentoAnualObjetivoAprendizagem> ObjetivosAprendizagem { get; set; }
    }
}
