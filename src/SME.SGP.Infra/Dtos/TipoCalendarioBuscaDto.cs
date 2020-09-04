﻿using SME.SGP.Dominio;

namespace SME.SGP.Infra
{
    public class TipoCalendarioBuscaDto
    {
        public long Id { get; set; }
        public string Descricao { get; set; }
        public int AnoLetivo { get; set; }
        public string Nome { get; set; }
        public ModalidadeTipoCalendario Modalidade { get; set; }
    }
}
