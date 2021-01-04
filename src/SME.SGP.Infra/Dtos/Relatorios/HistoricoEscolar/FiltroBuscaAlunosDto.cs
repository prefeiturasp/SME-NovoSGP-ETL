﻿namespace SME.SGP.Infra
{
    public class FiltroBuscaAlunosDto
    {
        public string Codigo { get; set; }
        public string Nome { get; set; }
        public string AnoLetivo { get; set; }
        public string CodigoUe { get; set; }
    }

    public class FiltroBuscaEstudanteDto
    {
        public string AnoLetivo { get; set; }
        public string CodigoUe { get; set; }
        public long CodigoTurma { get; set; }
        public string Codigo { get; set; }
        public string Nome { get; set; }
    }
}
