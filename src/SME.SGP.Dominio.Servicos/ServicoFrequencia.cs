﻿using SME.SGP.Aplicacao;
using SME.SGP.Aplicacao.Integracoes;
using SME.SGP.Dominio.Interfaces;
using SME.SGP.Infra;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.SGP.Dominio.Servicos
{
    public class ServicoFrequencia : IServicoFrequencia
    {
        private readonly IConsultasDisciplina consultasDisciplina;
        private readonly IRepositorioAula repositorioAula;
        private readonly IRepositorioFrequencia repositorioFrequencia;
        private readonly IRepositorioRegistroAusenciaAluno repositorioRegistroAusenciaAluno;
        private readonly IRepositorioTurma repositorioTurma;
        private readonly IRepositorioUE repositorioUE;
        private readonly IServicoEOL servicoEOL;
        private readonly IServicoUsuario servicoUsuario;
        private readonly IUnitOfWork unitOfWork;

        public ServicoFrequencia(IRepositorioFrequencia repositorioFrequencia,
                                 IRepositorioRegistroAusenciaAluno repositorioRegistroAusenciaAluno,
                                 IRepositorioAula repositorioAula,
                                 IServicoUsuario servicoUsuario,
                                 IUnitOfWork unitOfWork,
                                 IServicoEOL servicoEOL,
                                 IRepositorioUE repositorioUE,
                                 IRepositorioTurma repositorioTurma,
                                 IConsultasDisciplina consultasDisciplina)
        {
            this.repositorioFrequencia = repositorioFrequencia ?? throw new System.ArgumentNullException(nameof(repositorioFrequencia));
            this.repositorioRegistroAusenciaAluno = repositorioRegistroAusenciaAluno ?? throw new System.ArgumentNullException(nameof(repositorioRegistroAusenciaAluno));
            this.repositorioAula = repositorioAula ?? throw new System.ArgumentNullException(nameof(repositorioAula));
            this.servicoUsuario = servicoUsuario ?? throw new System.ArgumentNullException(nameof(servicoUsuario));
            this.unitOfWork = unitOfWork ?? throw new System.ArgumentNullException(nameof(unitOfWork));
            this.servicoEOL = servicoEOL ?? throw new System.ArgumentNullException(nameof(servicoEOL));
            this.repositorioUE = repositorioUE ?? throw new System.ArgumentNullException(nameof(repositorioUE));
            this.repositorioTurma = repositorioTurma ?? throw new System.ArgumentNullException(nameof(repositorioTurma));
            this.consultasDisciplina = consultasDisciplina ?? throw new System.ArgumentNullException(nameof(consultasDisciplina));
        }

        public async Task<IEnumerable<DisciplinaDto>> ObterDisciplinasLecionadasPeloProfessorPorTurma(string turmaId)
        {
            if (string.IsNullOrWhiteSpace(turmaId))
                throw new NegocioException("O id da turma é obrigatório.");

            var turma = repositorioTurma.ObterPorId(turmaId);
            if (turma == null)
                throw new NegocioException("Não foi encontrada uma turma com o id informado. Verifique se você possui abrangência para essa turma.");

            var deveAdicionarComponenteCurricularEMEBS = false;
            deveAdicionarComponenteCurricularEMEBS = DeveAdicionarComponenteParaEMEBS(turmaId, turma, deveAdicionarComponenteCurricularEMEBS);

            var disciplinas = await consultasDisciplina.ObterDisciplinasPorProfessorETurma(turmaId);
            AdicionarComponenteParaEMEBS(deveAdicionarComponenteCurricularEMEBS, disciplinas);
            return disciplinas;
        }

        public IEnumerable<RegistroAusenciaAluno> ObterListaAusenciasPorAula(long aulaId)
        {
            return repositorioFrequencia.ObterListaFrequenciaPorAula(aulaId);
        }

        public RegistroFrequencia ObterRegistroFrequenciaPorAulaId(long aulaId)
        {
            return repositorioFrequencia.ObterRegistroFrequenciaPorAulaId(aulaId);
        }

        public async Task Registrar(long aulaId, IEnumerable<RegistroAusenciaAluno> registroAusenciaAlunos)
        {
            var aula = ObterAula(aulaId);

            await ValidaSeUsuarioPodeCriarAula(aula);
            var alunos = await ObterAlunos(aula);

            var registroFrequencia = repositorioFrequencia.ObterRegistroFrequenciaPorAulaId(aulaId);

            unitOfWork.IniciarTransacao();

            registroFrequencia = RegistraFrequenciaTurma(aula, registroFrequencia);

            RegistraAusenciaAlunos(registroAusenciaAlunos, alunos, registroFrequencia, aula.Quantidade);

            unitOfWork.PersistirTransacao();
        }

        private static void AdicionarComponenteParaEMEBS(bool deveAdicionarComponenteCurricularEMEBS, List<Infra.DisciplinaDto> disciplinas)
        {
            if (disciplinas != null && disciplinas.Any() && deveAdicionarComponenteCurricularEMEBS)
            {
                if (disciplinas.Any(c => c.CodigoComponenteCurricular == 218) && !disciplinas.Any(c => c.CodigoComponenteCurricular == 138))
                {
                    disciplinas.Add(new Infra.DisciplinaDto
                    {
                        CodigoComponenteCurricular = 138,
                        Nome = "Português",
                    });
                }
                else
                {
                    if (disciplinas.Any(c => c.CodigoComponenteCurricular == 138) && !disciplinas.Any(c => c.CodigoComponenteCurricular == 218))
                    {
                        disciplinas.Add(new Infra.DisciplinaDto
                        {
                            CodigoComponenteCurricular = 218,
                            Nome = "Libras",
                        });
                    }
                }
            }
        }

        private bool DeveAdicionarComponenteParaEMEBS(string turmaId, Turma turma, bool deveAdicionarComponenteCurricularEMEBS)
        {
            if (turma.Modalidade == Modalidade.Fundamental || turma.Modalidade == Modalidade.Medio)
            {
                var ue = repositorioUE.ObterUEPorTurma(turmaId);
                if (ue == null)
                    throw new NegocioException("Não foi encontrada uma UE com a turma informada. Verifique se você possui abrangência para essa UE.");

                if (ue.Tipo == TipoEscola.EMEBS)
                {
                    deveAdicionarComponenteCurricularEMEBS = true;
                }
            }

            return deveAdicionarComponenteCurricularEMEBS;
        }

        private async Task<IEnumerable<Aplicacao.Integracoes.Respostas.AlunoPorTurmaResposta>> ObterAlunos(Aula aula)
        {
            var alunos = await servicoEOL.ObterAlunosPorTurma(aula.TurmaId);
            if (alunos == null || !alunos.Any())
            {
                throw new NegocioException("Não foram encontrados alunos para a turma informada.");
            }

            return alunos;
        }

        private Aula ObterAula(long aulaId)
        {
            var aula = repositorioAula.ObterPorId(aulaId);
            if (aula == null)
            {
                throw new NegocioException("A aula informada não foi encontrada.");
            }

            return aula;
        }

        private void RegistraAusenciaAlunos(IEnumerable<RegistroAusenciaAluno> registroAusenciaAlunos, IEnumerable<Aplicacao.Integracoes.Respostas.AlunoPorTurmaResposta> alunos, RegistroFrequencia registroFrequencia, int quantidadeAulas)
        {
            foreach (var ausencia in registroAusenciaAlunos)
            {
                if (ausencia.NumeroAula > quantidadeAulas)
                {
                    throw new NegocioException($"O número de aula informado: Aula {ausencia.NumeroAula} não foi encontrado.");
                }
                var aluno = alunos.FirstOrDefault(c => c.CodigoAluno == ausencia.CodigoAluno);
                if (aluno == null)
                {
                    throw new NegocioException("O aluno informado na frequência não pertence a essa turma.");
                }
                if (aluno.EstaInativo())
                {
                    throw new NegocioException($"Não foi possível registrar a frequência pois o aluno: '{aluno.NomeAluno}' está com a situação: '{aluno.SituacaoMatricula}'.");
                }
                ausencia.RegistroFrequenciaId = registroFrequencia.Id;
                repositorioRegistroAusenciaAluno.Salvar(ausencia);
            }
        }

        private RegistroFrequencia RegistraFrequenciaTurma(Aula aula, RegistroFrequencia registroFrequencia)
        {
            if (registroFrequencia == null)
            {
                registroFrequencia = new RegistroFrequencia(aula);
                repositorioFrequencia.Salvar(registroFrequencia);
            }
            else
                repositorioRegistroAusenciaAluno.MarcarRegistrosAusenciaAlunoComoExcluidoPorRegistroFrequenciaId(registroFrequencia.Id);
            return registroFrequencia;
        }

        private async Task ValidaSeUsuarioPodeCriarAula(Aula aula)
        {
            var usuario = await servicoUsuario.ObterUsuarioLogado();
            if (!usuario.PodeRegistrarFrequencia(aula))
            {
                throw new NegocioException("Você não pode registrar frequência para a aula/turma informada.");
            }
        }
    }
}