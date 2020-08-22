﻿using MediatR;
using SME.SGP.Dominio;
using System;
using System.Collections.Generic;
using System.Text;

namespace SME.SGP.Aplicacao
{
    public class ObterComponentesCurricularesPorUeAnosModalidadeQuery : IRequest<IEnumerable<ComponenteCurricularEol>>
    {
        public ObterComponentesCurricularesPorUeAnosModalidadeQuery(string turmaCodigo, int anoLetivo, Modalidade modalidade, string[] anos)
        {
            TurmaCodigo = turmaCodigo;
            AnoLetivo = anoLetivo;
            Modalidade = modalidade;
            Anos = anos;
        }

        public string TurmaCodigo { get; set; }
        public int AnoLetivo { get; set; }
        public Modalidade Modalidade { get; set; }
        public string[] Anos { get; set; }
    }
}
