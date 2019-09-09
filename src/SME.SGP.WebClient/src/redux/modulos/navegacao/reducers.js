import produce from 'immer';
import Principal from '../../../paginas/Principal/principal';
import PlanoCiclo from '../../../paginas/Planejamento/PlanoCiclo/planoCiclo';
import PlanoAnual from '../../../paginas/Planejamento/PlanoAnual/planoAnual';

const rotas = new Map();
rotas.set('/', {
  breadcrumbName: 'Home',
  parent: null,
  component: Principal,
  exact: true
});
rotas.set('/planejamento/plano-ciclo', {
  breadcrumbName: 'Plano de Ciclo',
  menu: 'Planejamento',
  parent: '/',
  component: PlanoCiclo,
  exact: true
});
rotas.set('/planejamento/plano-anual', {
  breadcrumbName: 'Plano Anual',
  menu: 'Planejamento',
  parent: '/',
  component: PlanoAnual,
  exact: false
});

const inicial = {
  collapsed: false,
  activeRoute: '/',
  rotas
};

export default function navegacao(state = inicial, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@navegacao/collapsed':
        draft.collapsed = action.payload;
        break
      case '@navegacao/activeRoute':
        draft.activeRoute = action.payload;
        break
      case '@navegacao/rotas':
        draft.rotas.set(action.payload.path, action.payload);
        break
      default:
        break;
    }
  });
}
