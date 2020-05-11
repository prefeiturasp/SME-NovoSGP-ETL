import api from '~/servicos/api';

const urlPadrao = 'v1/relatorios/pap/semestral';

class ServicoRelatorioSemestral {
  obterListaAlunos = (turmaCodigo, anoLetivo, semestreConsulta) => {
    const url = `v1/fechamentos/turmas/${turmaCodigo}/alunos/anos/${anoLetivo}/semestres/${semestreConsulta}`;
    return api.get(url);
  };

  obterFrequenciaAluno = (alunoCodigo, turmaCodigo) => {
    const url = `v1/calendarios/frequencias/alunos/${alunoCodigo}/turmas/${turmaCodigo}/geral`;
    return api.get(url);
  };

  salvarServicoRelatorioSemestral = (
    turmaCodigo,
    semestreConsulta,
    alunoCodigo,
    params
  ) => {
    const url = `${urlPadrao}/turmas/${turmaCodigo}/semestres/${semestreConsulta}/alunos/${alunoCodigo}`;
    return api.post(url, params);
  };

  obterListaSemestres = () => {
    return api.get(`${urlPadrao}/semestres`);
  };

  obterDadosCamposDescritivos = (
    alunoCodigo,
    turmaCodigo,
    semestreConsulta
  ) => {
    const url = `${urlPadrao}/turmas/${turmaCodigo}/semestres/${semestreConsulta}/alunos/${alunoCodigo}`;
    return api.get(url);
  };
}

export default new ServicoRelatorioSemestral();
