﻿using SME.SGP.Aplicacao.Integracoes;
using SME.SGP.Dominio;
using SME.SGP.Dominio.Interfaces;
using SME.SGP.Infra;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.SGP.Aplicacao
{
    public class ComandosAtividadeAvaliativa : IComandosAtividadeAvaliativa
    {
        private readonly IConsultasDisciplina consultasDisciplina;
        private readonly IConsultasProfessor consultasProfessor;
        private readonly IRepositorioAtividadeAvaliativa repositorioAtividadeAvaliativa;
        private readonly IRepositorioAtividadeAvaliativaRegencia repositorioAtividadeAvaliativaRegencia;
        private readonly IRepositorioAula repositorioAula;
        private readonly IRepositorioPeriodoEscolar repositorioPeriodoEscolar;
        private readonly IRepositorioAtribuicaoCJ repositorioAtribuicaoCJ;
        private readonly IServicoEOL servicoEOL;
        private readonly IServicoUsuario servicoUsuario;
        private readonly IUnitOfWork unitOfWork;

        public ComandosAtividadeAvaliativa(
            IRepositorioAtividadeAvaliativa repositorioAtividadeAvaliativa,
            IConsultasDisciplina consultasDisciplina,
            IConsultasProfessor consultasProfessor,
            IRepositorioAula repositorioAula,
            IServicoUsuario servicoUsuario,
            IServicoEOL servicoEOL,
            IRepositorioPeriodoEscolar repositorioPeriodoEscolar,
            IRepositorioAtribuicaoCJ repositorioAtribuicaoCJ,
            IUnitOfWork unitOfWork,
            IRepositorioAtividadeAvaliativaRegencia repositorioAtividadeAvaliativaRegencia)

        {
            this.repositorioAtividadeAvaliativa = repositorioAtividadeAvaliativa ?? throw new ArgumentNullException(nameof(repositorioAtividadeAvaliativa));
            this.consultasDisciplina = consultasDisciplina ?? throw new ArgumentException(nameof(consultasDisciplina));
            this.consultasProfessor = consultasProfessor ?? throw new ArgumentException(nameof(consultasProfessor));
            this.servicoUsuario = servicoUsuario ?? throw new ArgumentException(nameof(servicoUsuario));
            this.servicoEOL = servicoEOL ?? throw new ArgumentException(nameof(servicoEOL));
            this.unitOfWork = unitOfWork ?? throw new ArgumentException(nameof(unitOfWork));
            this.repositorioAula = repositorioAula ?? throw new ArgumentException(nameof(repositorioAula));
            this.repositorioPeriodoEscolar = repositorioPeriodoEscolar ?? throw new ArgumentException(nameof(repositorioPeriodoEscolar));
            this.repositorioAtividadeAvaliativaRegencia = repositorioAtividadeAvaliativaRegencia ?? throw new ArgumentException(nameof(repositorioAtividadeAvaliativaRegencia));
            this.repositorioAtribuicaoCJ = repositorioAtribuicaoCJ ?? throw new ArgumentException(nameof(repositorioAtribuicaoCJ));
        }

        public async Task<IEnumerable<RetornoCopiarAtividadeAvaliativaDto>> Alterar(AtividadeAvaliativaDto dto, long id)
        {
            var mensagens = new List<RetornoCopiarAtividadeAvaliativaDto>();

            var usuario = await servicoUsuario.ObterUsuarioLogado();
            var disciplina = ObterDisciplina(dto.DisciplinaId);
            var atividadeAvaliativa = MapearDtoParaEntidade(dto, id, usuario.CodigoRf, disciplina.Regencia);

            using (var transacao = unitOfWork.IniciarTransacao())
            {
                if (disciplina.Regencia)
                {
                    var regencias = await repositorioAtividadeAvaliativaRegencia.Listar(atividadeAvaliativa.Id);
                    foreach (var regencia in regencias)
                        repositorioAtividadeAvaliativaRegencia.Remover(regencia);
                    foreach (string idRegencia in dto.DisciplinaContidaRegenciaId)
                    {
                        var ativRegencia = new AtividadeAvaliativaRegencia
                        {
                            AtividadeAvaliativaId = atividadeAvaliativa.Id,
                            DisciplinaContidaRegenciaId = idRegencia
                        };
                        await repositorioAtividadeAvaliativaRegencia.SalvarAsync(ativRegencia);
                    }
                }
                await repositorioAtividadeAvaliativa.SalvarAsync(atividadeAvaliativa);
                unitOfWork.PersistirTransacao();
            }

            mensagens.Add(new RetornoCopiarAtividadeAvaliativaDto("Atividade Avaliativa alterada com sucesso", true));
            await CopiarAtividadeAvaliativa(dto, atividadeAvaliativa.ProfessorRf, usuario.EhProfessorCj(), mensagens);

            return mensagens;
        }

        public async Task Excluir(long idAtividadeAvaliativa)
        {
            var atividadeAvaliativa = repositorioAtividadeAvaliativa.ObterPorId(idAtividadeAvaliativa);
            if (atividadeAvaliativa is null)
                throw new NegocioException("Não foi possível localizar esta avaliação.");
            var disciplina = ObterDisciplina(atividadeAvaliativa.DisciplinaId);

            using (var transacao = unitOfWork.IniciarTransacao())
            {
                atividadeAvaliativa.Excluir();
                await repositorioAtividadeAvaliativa.SalvarAsync(atividadeAvaliativa);
                if (disciplina.Regencia)
                {
                    var regencias = await repositorioAtividadeAvaliativaRegencia.Listar(atividadeAvaliativa.Id);
                    foreach (var regencia in regencias)
                    {
                        regencia.Excluir();
                        await repositorioAtividadeAvaliativaRegencia.SalvarAsync(regencia);
                    }
                }
                unitOfWork.PersistirTransacao();
            }
        }

        public async Task<IEnumerable<RetornoCopiarAtividadeAvaliativaDto>> Inserir(AtividadeAvaliativaDto dto)
        {
            var mensagens = new List<RetornoCopiarAtividadeAvaliativaDto>();
            var usuario = await servicoUsuario.ObterUsuarioLogado();
            var disciplina = ObterDisciplina(dto.DisciplinaId);
            var atividadeAvaliativa = MapearDtoParaEntidade(dto, 0L, usuario.CodigoRf, disciplina.Regencia);
            await Salvar(atividadeAvaliativa, dto, mensagens);
            await CopiarAtividadeAvaliativa(dto, atividadeAvaliativa.ProfessorRf, usuario.EhProfessorCj(), mensagens);

            return mensagens;
        }

        private async Task Salvar(AtividadeAvaliativa atividadeAvaliativa,  AtividadeAvaliativaDto dto, 
                                  IEnumerable<RetornoCopiarAtividadeAvaliativaDto> mensagens, bool ehCopia = false)
        {
            unitOfWork.IniciarTransacao();

            await repositorioAtividadeAvaliativa.SalvarAsync(atividadeAvaliativa);
            if (atividadeAvaliativa.EhRegencia)
            {
                if (dto.DisciplinaContidaRegenciaId.Length == 0)
                    throw new NegocioException("É necessário informar as disciplinas da regência");

                foreach (string id in dto.DisciplinaContidaRegenciaId)
                {
                    var ativRegencia = new AtividadeAvaliativaRegencia
                    {
                        AtividadeAvaliativaId = atividadeAvaliativa.Id,
                        DisciplinaContidaRegenciaId = id
                    };
                    await repositorioAtividadeAvaliativaRegencia.SalvarAsync(ativRegencia);
                }
            }

            unitOfWork.PersistirTransacao();

            if (!ehCopia)
                mensagens.ToList().Add(new RetornoCopiarAtividadeAvaliativaDto("Atividade Avaliativa criada com sucesso", true));
        }

        private async Task CopiarAtividadeAvaliativa(AtividadeAvaliativaDto atividadeAvaliativaDto, string usuarioRf, bool ehCJ,
                                                     IEnumerable<RetornoCopiarAtividadeAvaliativaDto> mensagens)
        {
            await ValidarCopias(atividadeAvaliativaDto, usuarioRf, ehCJ, mensagens);

            if (mensagens.Count() > 1)
                return;

            if (atividadeAvaliativaDto.TurmasParaCopiar != null && atividadeAvaliativaDto.TurmasParaCopiar.Any())
            {
                foreach (var turma in atividadeAvaliativaDto.TurmasParaCopiar)
                {
                    atividadeAvaliativaDto.TurmaId = turma.TurmaId;
                    atividadeAvaliativaDto.DataAvaliacao = turma.DataAtividadeAvaliativa;

                    try
                    {
                        await Validar(MapearDtoParaFiltroValidacao(atividadeAvaliativaDto));
                        var atividadeParaCopiar = MapearDtoParaEntidade(new AtividadeAvaliativa(), atividadeAvaliativaDto, usuarioRf);
                        await Salvar(atividadeParaCopiar, atividadeAvaliativaDto, mensagens, true);

                        mensagens.ToList().Add(new RetornoCopiarAtividadeAvaliativaDto($"Atividade copiada para a turma: '{turma.TurmaId}' na data '{turma.DataAtividadeAvaliativa.ToString("dd/MM/yyyy")}'.", true));
                    }
                    catch (NegocioException nex)
                    {
                        mensagens.ToList().Add(new RetornoCopiarAtividadeAvaliativaDto($"Erro ao copiar para a turma: '{turma.TurmaId}' na data '{turma.DataAtividadeAvaliativa.ToString("dd/MM/yyyy")}'. {nex.Message}"));
                    }
                }
            }
        }

        private FiltroAtividadeAvaliativaDto MapearDtoParaFiltroValidacao(AtividadeAvaliativaDto atividadeAvaliativaDto)
        {
            return new FiltroAtividadeAvaliativaDto()
            {
                DataAvaliacao = atividadeAvaliativaDto.DataAvaliacao,
                DisciplinaContidaRegenciaId = atividadeAvaliativaDto.DisciplinaContidaRegenciaId,
                DisciplinaId = atividadeAvaliativaDto.DisciplinaId.ToString(),
                DreId = atividadeAvaliativaDto.DreId,
                Nome = atividadeAvaliativaDto.Nome,
                TipoAvaliacaoId = (int)atividadeAvaliativaDto.TipoAvaliacaoId,
                TurmaId = atividadeAvaliativaDto.TurmaId,
                UeID = atividadeAvaliativaDto.UeId
            };
        }

        public async Task Validar(FiltroAtividadeAvaliativaDto filtro)
        {
            if (string.IsNullOrEmpty(filtro.DisciplinaId))
                throw new NegocioException("É necessário informar a disciplina");
            var disciplina = ObterDisciplina(Convert.ToInt32(filtro.DisciplinaId));
            var usuario = await servicoUsuario.ObterUsuarioLogado();
            DateTime dataAvaliacao = filtro.DataAvaliacao.Value.Date;
            var aula = await repositorioAula.ObterAulas(filtro.TurmaId, filtro.UeID, usuario.CodigoRf, dataAvaliacao, filtro.DisciplinaId);

            //verificar se tem para essa atividade
            if (!aula.Any())
                throw new NegocioException("Não existe aula cadastrada para esse data.");

            var tipoCalendarioId = aula.FirstOrDefault().TipoCalendarioId;
            var perioEscolar = repositorioPeriodoEscolar.ObterPorTipoCalendarioData(tipoCalendarioId, dataAvaliacao);
            if (perioEscolar == null)
                throw new NegocioException("Não foi encontrado nenhum período escolar para essa data.");

            //verificar se já existe atividade com o mesmo nome no mesmo bimestre
            if (await repositorioAtividadeAvaliativa.VerificarSeJaExisteAvaliacaoComMesmoNome(filtro.Nome, filtro.DreId, filtro.UeID, filtro.TurmaId, filtro.DisciplinaId, usuario.CodigoRf, perioEscolar.PeriodoInicio, perioEscolar.PeriodoFim, filtro.Id))
            {
                throw new NegocioException("Já existe atividade avaliativa cadastrada com esse nome para esse bimestre.");
            }

            if (disciplina.Regencia)
            {
                if (await repositorioAtividadeAvaliativa.VerificarSeJaExisteAvaliacaoRegencia(dataAvaliacao, filtro.DreId, filtro.UeID, filtro.TurmaId, filtro.DisciplinaId, filtro.DisciplinaContidaRegenciaId, usuario.CodigoRf, filtro.Id))
                {
                    throw new NegocioException("Já existe atividade avaliativa cadastrada para essa data e disciplina.");
                }
            }
            else
            {
                if (await repositorioAtividadeAvaliativa.VerificarSeJaExisteAvaliacaoNaoRegencia(dataAvaliacao, filtro.DreId, filtro.UeID, filtro.TurmaId, filtro.DisciplinaId, usuario.CodigoRf, filtro.Id))
                {
                    throw new NegocioException("Já existe atividade avaliativa cadastrada para essa data e disciplina.");
                }
            }
        }

        private AtividadeAvaliativa MapearDtoParaEntidade(AtividadeAvaliativaDto dto, long id, string usuarioRf, bool ehRegencia)
        {
            AtividadeAvaliativa atividadeAvaliativa = new AtividadeAvaliativa();
            if (id > 0L)
            {
                atividadeAvaliativa = repositorioAtividadeAvaliativa.ObterPorId(id);
            }
            if (string.IsNullOrEmpty(atividadeAvaliativa.ProfessorRf))
            {
                atividadeAvaliativa.ProfessorRf = usuarioRf;
            }
            atividadeAvaliativa.UeId = dto.UeId;
            atividadeAvaliativa.DreId = dto.DreId;
            atividadeAvaliativa.TurmaId = dto.TurmaId;
            atividadeAvaliativa.Categoria = dto.CategoriaId;
            atividadeAvaliativa.DisciplinaId = dto.DisciplinaId;
            atividadeAvaliativa.TipoAvaliacaoId = dto.TipoAvaliacaoId;
            atividadeAvaliativa.NomeAvaliacao = dto.Nome;
            atividadeAvaliativa.DescricaoAvaliacao = dto.Descricao;
            atividadeAvaliativa.DataAvaliacao = dto.DataAvaliacao;
            atividadeAvaliativa.EhRegencia = ehRegencia;
            return atividadeAvaliativa;
        }

        private AtividadeAvaliativa MapearDtoParaEntidade(AtividadeAvaliativa atividadeAvaliativa, AtividadeAvaliativaDto dto, string usuarioRf)
        {
            atividadeAvaliativa.ProfessorRf = usuarioRf;
            atividadeAvaliativa.UeId = dto.UeId;
            atividadeAvaliativa.DreId = dto.DreId;
            atividadeAvaliativa.TurmaId = dto.TurmaId;
            atividadeAvaliativa.Categoria = dto.CategoriaId;
            atividadeAvaliativa.DisciplinaId = dto.DisciplinaId;
            atividadeAvaliativa.TipoAvaliacaoId = dto.TipoAvaliacaoId;
            atividadeAvaliativa.NomeAvaliacao = dto.Nome;
            atividadeAvaliativa.DescricaoAvaliacao = dto.Descricao;
            atividadeAvaliativa.DataAvaliacao = dto.DataAvaliacao;
            atividadeAvaliativa.EhRegencia = dto.EhRegencia;
            return atividadeAvaliativa;
        }

        private DisciplinaDto ObterDisciplina(long idDisciplina)
        {
            long[] disciplinaId = { idDisciplina };
            var disciplina = servicoEOL.ObterDisciplinasPorIds(disciplinaId);
            if (!disciplina.Any())
                throw new NegocioException("Disciplina não encontrada no EOL.");
            return disciplina.FirstOrDefault();
        }

        private async Task ValidarCopias(AtividadeAvaliativaDto atividadeAvaliativaDto, string codigoRf, bool ehProfessorCj,
                                         IEnumerable<RetornoCopiarAtividadeAvaliativaDto> mensagens)
        {
            var turmasAtribuidasAoProfessor = consultasProfessor.Listar(codigoRf);
            var idsTurmasSelecionadas = atividadeAvaliativaDto.TurmasParaCopiar.Select(x => x.TurmaId).ToList();

           await ValidaTurmasProfessor(ehProfessorCj, atividadeAvaliativaDto.UeId,
                                  atividadeAvaliativaDto.DisciplinaId.ToString(),
                                  codigoRf,
                                  turmasAtribuidasAoProfessor,
                                  idsTurmasSelecionadas, mensagens);

            ValidaTurmasAno(ehProfessorCj, turmasAtribuidasAoProfessor, idsTurmasSelecionadas, mensagens);
        }

        private void ValidaTurmasAno(bool ehProfessorCJ, IEnumerable<ProfessorTurmaDto> turmasAtribuidasAoProfessor,
                                     IEnumerable<string> idsTurmasSelecionadas, IEnumerable<RetornoCopiarAtividadeAvaliativaDto> mensagens)
        {
            if (!ehProfessorCJ)
            {
                var turmasAtribuidasSelecionadas = turmasAtribuidasAoProfessor.Where(t => idsTurmasSelecionadas.Contains(t.CodTurma.ToString()));
                var anoTurma = turmasAtribuidasSelecionadas.First().Ano;

                if (!turmasAtribuidasSelecionadas.All(x => x.Ano == anoTurma))
                {
                    mensagens.ToList().Add(new RetornoCopiarAtividadeAvaliativaDto(
                        "Somente é possível migrar o plano de aula para turmas dentro do mesmo ano"));
                }
            }
        }

        private async Task ValidaTurmasProfessor(bool ehProfessorCJ, string ueId, string disciplinaId, string codigoRf,
                                                   IEnumerable<ProfessorTurmaDto> turmasAtribuidasAoProfessor,
                                                   IEnumerable<string> idsTurmasSelecionadas,
                                                   IEnumerable<RetornoCopiarAtividadeAvaliativaDto> mensagens)
        {

            var idsTurmasProfessor = turmasAtribuidasAoProfessor?.Select(c => c.CodTurma).ToList();

            IEnumerable<AtribuicaoCJ> lstTurmasCJ = await
                         repositorioAtribuicaoCJ.ObterPorFiltros(null, null, ueId, Convert.ToInt64(disciplinaId), codigoRf, null, null);

            if (
                    (
                        ehProfessorCJ &&
                        (
                            lstTurmasCJ == null ||
                            idsTurmasSelecionadas.Any(c => !lstTurmasCJ.Select(tcj => tcj.TurmaId).Contains(c))
                        )
                    ) ||
                    (
                        idsTurmasProfessor == null ||
                        idsTurmasSelecionadas.Any(c => !idsTurmasProfessor.Contains(Convert.ToInt32(c)))
                    )

               )
                mensagens.ToList().Add(new RetornoCopiarAtividadeAvaliativaDto("Somente é possível migrar o plano de aula para turmas atribuidas ao professor"));

        }
    }
}