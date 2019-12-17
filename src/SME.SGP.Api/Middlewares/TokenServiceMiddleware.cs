﻿using Microsoft.AspNetCore.Http;
using SME.SGP.Aplicacao;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace SME.SGP.Api.Middlewares
{
    public class TokenServiceMiddleware : IMiddleware
    {
        private readonly IServicoTokenJwt servicoToken;

        public TokenServiceMiddleware(IServicoTokenJwt servicoToken)
        {
            this.servicoToken = servicoToken ?? throw new ArgumentException(nameof(servicoToken));
        }

        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            if ((servicoToken.TokenPresente() && servicoToken.TokenAtivo())
                || !servicoToken.TokenPresente())
            {
                await next(context);

                return;
            }

            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
        }
    }
}
