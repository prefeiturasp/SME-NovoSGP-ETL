﻿using Microsoft.AspNetCore.Mvc;
using SME.SGP.Api.Filtros;
using SME.SGP.Aplicacao;
using SME.SGP.Infra;
using System.Threading.Tasks;

namespace SME.SGP.Api.Controllers
{
    [ApiController]
    [Route("api/v1/atividade-avaliativa/")]
    [ValidaDto]
    public class AtividadeAvaliativaController : ControllerBase
    {
        private readonly IComandosAtividadeAvaliativa comandoAtividadeAvaliativa;
        private readonly IConsultaAtividadeAvaliativa consultaAtividadeAvaliativa;

        public AtividadeAvaliativaController(IComandosAtividadeAvaliativa comandoAtividadeAvaliativa, IConsultaAtividadeAvaliativa consultaAtividadeAvaliativa)
        {
            this.comandoAtividadeAvaliativa = comandoAtividadeAvaliativa ?? throw new System.ArgumentNullException(nameof(comandoAtividadeAvaliativa));
            this.consultaAtividadeAvaliativa = consultaAtividadeAvaliativa ?? throw new System.ArgumentNullException(nameof(consultaAtividadeAvaliativa));
        }

        [HttpPut("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof(RetornoBaseDto), 500)]
        [Permissao(Permissao.CP_A, Policy = "Bearer")]
        public IActionResult Alterar([FromBody]AtividadeAvaliativaDto atividadeAvaliativaDto, long id)
        {
            comandoAtividadeAvaliativa.Alterar(atividadeAvaliativaDto, id);
            return Ok();
        }

        [HttpDelete]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof(RetornoBaseDto), 500)]
        [ProducesResponseType(typeof(RetornoBaseDto), 601)]
        [Permissao(Permissao.CP_E, Policy = "Bearer")]
        public async Task<IActionResult> Excluir(long id)
        {
            await comandoAtividadeAvaliativa.Excluir(id);
            return Ok();
        }

        [HttpGet("listar")]
        [ProducesResponseType(typeof(PaginacaoResultadoDto<AtividadeAvaliativaCompletaDto>), 200)]
        [ProducesResponseType(typeof(RetornoBaseDto), 500)]
        [Permissao(Permissao.TE_C, Permissao.E_C, Policy = "Bearer")]
        public async Task<IActionResult> Listar([FromQuery]FiltroAtividadeAvaliativaDto filtro)
        {
            var listaAtividadeAvaliativa = await consultaAtividadeAvaliativa.ListarPaginado(filtro);
            return Ok(listaAtividadeAvaliativa);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(AtividadeAvaliativaCompletaDto), 200)]
        [ProducesResponseType(typeof(RetornoBaseDto), 500)]
        [ProducesResponseType(typeof(RetornoBaseDto), 601)]
        [Permissao(Permissao.CP_C, Policy = "Bearer")]
        public IActionResult ObterPorId(long id)
        {
            return Ok(consultaAtividadeAvaliativa.ObterPorId(id));
        }

        [HttpPost]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof(RetornoBaseDto), 500)]
        [Permissao(Permissao.CP_I, Policy = "Bearer")]
        public async Task<IActionResult> PostAsync([FromBody]AtividadeAvaliativaDto atividadeAvaliativaDto)
        {
            await comandoAtividadeAvaliativa.Inserir(atividadeAvaliativaDto);
            return Ok();
        }

        [HttpPost("validar")]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof(RetornoBaseDto), 500)]
        [Permissao(Permissao.CP_I, Policy = "Bearer")]
        public async Task<IActionResult> Validar([FromBody]FiltroAtividadeAvaliativaDto filtro)
        {
            await comandoAtividadeAvaliativa.Validar(filtro);
            return Ok();
        }
    }
}