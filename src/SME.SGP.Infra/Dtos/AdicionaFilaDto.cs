﻿namespace SME.SGP.Infra.Dtos
{
    public class AdicionaFilaDto
    {
        public AdicionaFilaDto(string fila, object filtros, string endpoint)
        {
            Fila = fila;
            Filtros = filtros;
            Endpoint = endpoint;
        }

        public string Fila { get; set; }
        public object Filtros { get; set; }
        //TODO: PENSAR EM NOME MELHOR
        public string Endpoint { get; set; }
    }
}
