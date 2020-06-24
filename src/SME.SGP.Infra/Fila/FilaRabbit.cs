﻿using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RabbitMQ.Client;
using Sentry;
using SME.SGP.Infra.Dtos;
using SME.SGP.Infra.Interfaces;
using System;
using System.Text;

namespace SME.SGP.Infra
{
    public class FilaRabbit : IServicoFila
    {

        private readonly IModel rabbitChannel;
        private readonly IConfiguration configuration;

        public FilaRabbit(IModel rabbitChannel, IConfiguration configuration)
        {
            this.rabbitChannel = rabbitChannel ?? throw new ArgumentNullException(nameof(rabbitChannel));
            this.configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        public void AdicionaFilaWorkerServidorRelatorios(AdicionaFilaDto adicionaFilaDto)
        {
            byte[] body = FormataBodyWorker(adicionaFilaDto);

            rabbitChannel.QueueBind(RotasRabbit.WorkerRelatoriosSgp, RotasRabbit.ExchangeServidorRelatorios, RotasRabbit.RotaRelatoriosSolicitados);
            rabbitChannel.BasicPublish(RotasRabbit.ExchangeServidorRelatorios, adicionaFilaDto.Fila, null, body);

            SentrySdk.CaptureMessage("3 - AdicionaFilaWorkerRelatorios");
        }

        public void AdicionaFilaWorkerSgp(AdicionaFilaDto adicionaFilaDto)
        {
            byte[] body = FormataBodyWorker(adicionaFilaDto);

            rabbitChannel.QueueBind(RotasRabbit.FilaSgp, RotasRabbit.ExchangeSgp, adicionaFilaDto.Fila);
            rabbitChannel.BasicPublish(RotasRabbit.ExchangeSgp, adicionaFilaDto.Fila, null, body);

            SentrySdk.CaptureMessage("3 - AdicionaFilaWorkerRelatorios");
        }

        private static byte[] FormataBodyWorker(AdicionaFilaDto adicionaFilaDto)
        {
            var request = new MensagemRabbit(adicionaFilaDto.Endpoint, adicionaFilaDto.Filtros, adicionaFilaDto.CodigoCorrelacao, adicionaFilaDto.NotificarErroUsuario);
            var mensagem = JsonConvert.SerializeObject(request);
            var body = Encoding.UTF8.GetBytes(mensagem);
            return body;
        }
    }
}



