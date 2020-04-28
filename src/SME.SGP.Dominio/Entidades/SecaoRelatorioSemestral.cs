﻿using System;

namespace SME.SGP.Dominio
{
    public class SecaoRelatorioSemestral
    {
        public long Id { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public bool Obrigatorio { get; set; }
        public DateTime InicioVigencia { get; set; }
        public DateTime FimVigencia { get; set; }
    }
}