﻿using MediatR;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using SME.SGP.Infra;
using System.Net.Http;
using Newtonsoft.Json;
using SME.SGP.Dominio;

namespace SME.SGP.Aplicacao
{
    public class ObterComponentesCurricularesPorTurmaECodigoUeQueryHandler : IRequestHandler<ObterComponentesCurricularesPorTurmaECodigoUeQuery, IEnumerable<ComponenteCurricularDto>>
    {
        private readonly IHttpClientFactory httpClientFactory;

        public ObterComponentesCurricularesPorTurmaECodigoUeQueryHandler(IHttpClientFactory httpClientFactory)
        {
            this.httpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
        }

        public async Task<IEnumerable<ComponenteCurricularDto>> Handle(ObterComponentesCurricularesPorTurmaECodigoUeQuery request, CancellationToken cancellationToken)
        {
            using var httpClient = httpClientFactory.CreateClient("servicoEOL");
            var turmas = String.Join("&turmas=", request.CodigosDeTurmas);

            var resposta = await httpClient.GetAsync($"/api/v1/componentes-curriculares/ues/{request.CodigoUe}/turmas?turmas={turmas}");

            if (resposta.IsSuccessStatusCode && resposta.StatusCode != HttpStatusCode.NoContent)
            {
                var json = await resposta.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<IEnumerable<ComponenteCurricularDto>>(json);
            }
            else throw new NegocioException("Não foi possível obter Componentes Curriculares.");
        }
    }
}
