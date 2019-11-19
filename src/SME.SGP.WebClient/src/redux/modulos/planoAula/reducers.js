import produce from 'immer';

const inicial = {
  objetivosAprendizagem:[
    {
      id: 1,
      selected: false,
      codigo: 'EF45644',
      descricao: 'Teste de descrição'
    },
    {
      id: 2,
      selected: true,
      codigo: 'EF45645',
      descricao: 'Teste de descrição, teste teste teste teste teste teste teste teste teste teste teste teste teste teste teste'
    },
  ]
};

export default function planoAula(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@planoAula/objetivosAprendizagem':
        draft.objetivosAprendizagem = action.payload;
        break;
      default:
        break;
    }
  });
}
