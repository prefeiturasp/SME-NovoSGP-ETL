import produce from 'immer';

const inicial = {
  dadosAlunoObjectCard: {},
  alunosConselhoClasse: [],
  recomendacaoAluno: '',
  recomendacaoFamilia: '',
  anotacoesPedagogicas: '',
  anotacoesAluno: [],
  bimestreAtual: { valor: '' },
  conselhoClasseEmEdicao: false,
  dadosAnotacoesRecomendacoes: {},
  auditoriaAnotacaoRecomendacao: null,
  dentroPeriodo: true,
};

export default function ConselhoClasse(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@conselhoClasse/setDadosAlunoObjectCard': {
        return {
          ...draft,
          dadosAlunoObjectCard: action.payload,
        };
      }
      case '@conselhoClasse/setAlunosConselhoClasse': {
        return {
          ...draft,
          alunosConselhoClasse: action.payload,
        };
      }
      case '@conselhoClasse/setRecomendacaoAluno': {
        return {
          ...draft,
          recomendacaoAluno: action.payload,
        };
      }
      case '@conselhoClasse/setRecomendacaoFamilia': {
        return {
          ...draft,
          recomendacaoFamilia: action.payload,
        };
      }
      case '@conselhoClasse/setAnotacoesPedagogicas': {
        return {
          ...draft,
          anotacoesPedagogicas: action.payload,
        };
      }
      case '@conselhoClasse/setAnotacoesAluno': {
        return {
          ...draft,
          anotacoesAluno: action.payload,
        };
      }
      case '@conselhoClasse/setBimestreAtual': {
        return {
          ...draft,
          bimestreAtual: { valor: action.payload },
        };
      }
      case '@conselhoClasse/limparDadosConselhoClasse': {
        return {
          ...draft,
          dadosAlunoObjectCard: {},
          recomendacaoAluno: '',
          recomendacaoFamilia: '',
          anotacoesPedagogicas: '',
          anotacoesAluno: [],
          bimestreAtual: { valor: '' },
          conselhoClasseEmEdicao: false,
          dadosAnotacoesRecomendacoes: {},
          auditoriaAnotacaoRecomendacao: null,
          dentroPeriodo: true,
        };
      }
      case '@conselhoClasse/setConselhoClasseEmEdicao': {
        return {
          ...draft,
          conselhoClasseEmEdicao: action.payload,
        };
      }
      case '@conselhoClasse/setDadosAnotacoesRecomendacoes': {
        return {
          ...draft,
          dadosAnotacoesRecomendacoes: action.payload,
        };
      }
      case '@conselhoClasse/setAuditoriaAnotacaoRecomendacao': {
        return {
          ...draft,
          auditoriaAnotacaoRecomendacao: action.payload,
        };
      }
      case '@conselhoClasse/setDentroPeriodo': {
        return {
          ...draft,
          dentroPeriodo: action.payload,
        };
      }

      default:
        return draft;
    }
  });
}
