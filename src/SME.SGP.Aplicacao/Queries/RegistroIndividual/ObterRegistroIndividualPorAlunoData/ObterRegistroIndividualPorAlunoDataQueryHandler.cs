﻿using MediatR;
using SME.SGP.Dominio;
using SME.SGP.Infra;
using System.Threading;
using System.Threading.Tasks;

namespace SME.SGP.Aplicacao
{
    public class ObterRegistroIndividualPorAlunoDataQueryHandler : IRequestHandler<ObterRegistroIndividualPorAlunoDataQuery, RegistroIndividualDto>
    {
        private readonly IRepositorioRegistroIndividual repositorioRegistroIndividual;

        public ObterRegistroIndividualPorAlunoDataQueryHandler(IRepositorioRegistroIndividual repositorioRegistroIndividual)
        {
            this.repositorioRegistroIndividual = repositorioRegistroIndividual ?? throw new System.ArgumentNullException(nameof(repositorioRegistroIndividual));
        }

        public async Task<RegistroIndividualDto> Handle(ObterRegistroIndividualPorAlunoDataQuery request, CancellationToken cancellationToken)
        {
            var registroIndividual = await repositorioRegistroIndividual.ObterPorAlunoData(request.TurmaId, request.ComponenteCurricularId, request.AlunoCodigo, request.Data);

            return MapearParaDto(registroIndividual);
        }

        private RegistroIndividualDto MapearParaDto(RegistroIndividual registro)
        {
            if (registro != null)
            {
                return new RegistroIndividualDto()
                {
                    AlunoCodigo = registro.AlunoCodigo,
                    Auditoria = (AuditoriaDto)registro,
                    ComponenteCurricularId = registro.ComponenteCurricularId,
                    Data = registro.DataRegistro,
                    Excluido = registro.Excluido,
                    Migrado = registro.Migrado,
                    Registro = registro.Registro,
                    TurmaId = registro.TurmaId
                };
            }
            else
                return null;
        }
    }
}
