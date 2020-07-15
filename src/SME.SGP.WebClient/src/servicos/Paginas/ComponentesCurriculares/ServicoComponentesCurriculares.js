import api from '~/servicos/api';

const urlPadrao = `v1/componentes-curriculares`;

class ServicoComponentesCurriculares {
  obterComponetensCuriculares = (modalidade, anoLetivo, anosEscolares) => {
    const url = `${urlPadrao}/modalidades/${modalidade}/anos/${anoLetivo}/anos-escolares?anosEscolares=${anosEscolares.join(
      '&anosEscolares=',
      anosEscolares
    )}`;
    return api.get(url);
  };
}

export default new ServicoComponentesCurriculares();
