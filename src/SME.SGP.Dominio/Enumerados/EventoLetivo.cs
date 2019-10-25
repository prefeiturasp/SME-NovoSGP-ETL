﻿using System.ComponentModel.DataAnnotations;

namespace SME.SGP.Dominio
{
    public enum EventoLetivo
    {
        [Display(Name = "Sim")]
        Sim = 1,

        [Display(Name = "Não")]
        Nao,

        [Display(Name = "Opcional")]
        Opcional
    }
}