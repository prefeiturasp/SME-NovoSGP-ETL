import { store } from '~/redux';
import { setDesabilitarCampos } from '~/redux/modulos/conselhoClasse/actions';

import {
  atualizaDadosRegistroAtual,
  limparDadosRegistroIndividual,
  setAuditoriaNovoRegistro,
  setExibirLoaderGeralRegistroIndividual,
  setRegistroIndividualEmEdicao,
} from '~/redux/modulos/registroIndividual/actions';

import {
  confirmar,
  erros,
  ServicoRegistroIndividual,
  sucesso,
} from '~/servicos';

class MetodosRegistroIndividual {
  dispatch = store.dispatch;

  obterDados = () => {
    const { registroIndividual, usuario } = store.getState();
    const { turmaSelecionada } = usuario;
    const turmaId = turmaSelecionada?.id || 0;

    return {
      registroIndividual,
      turmaId,
    };
  };

  escolheCadastrar = (mostrarMsg = true) => {
    const { registroIndividual, turmaId } = this.obterDados();
    const { id } = registroIndividual.dadosParaSalvarNovoRegistro;
    if (id) {
      this.editarRegistroIndividual(registroIndividual, turmaId, mostrarMsg);
      return;
    }
    this.cadastrarRegistroIndividual(registroIndividual, turmaId, mostrarMsg);
  };

  pergutarParaSalvar = () => {
    return confirmar(
      'Atenção',
      '',
      'Suas alterações não foram salvas, deseja salvar agora?'
    );
  };

  salvarRegistroIndividual = async () => {
    const confirmado = await this.pergutarParaSalvar();
    if (confirmado) {
      this.escolheCadastrar(false);
    }
    return true;
  };

  verificarSalvarRegistroIndividual = () => {
    const { registroIndividual } = this.obterDados();

    if (registroIndividual.registroIndividualEmEdicao) {
      this.escolheCadastrar(false);
    }
  };

  resetarInfomacoes = ehDataAnterior => {
    if (ehDataAnterior) {
      this.dispatch(limparDadosRegistroIndividual());
      return;
    }
    this.dispatch(setRegistroIndividualEmEdicao(false));
    this.dispatch(setDesabilitarCampos(false));
  };

  cadastrarRegistroIndividual = async (
    registroIndividual,
    turmaId,
    mostrarMsg
  ) => {
    this.dispatch(setExibirLoaderGeralRegistroIndividual(true));
    const {
      alunoCodigo,
      data,
      registro,
    } = registroIndividual.dadosParaSalvarNovoRegistro;

    const retorno = await ServicoRegistroIndividual.salvarRegistroIndividual({
      turmaId,
      componenteCurricularId:
        registroIndividual.componenteCurricularSelecionado,
      alunoCodigo,
      registro,
      data,
    })
      .catch(e => erros(e))
      .finally(() =>
        this.dispatch(setExibirLoaderGeralRegistroIndividual(false))
      );

    if (retorno?.status === 200) {
      if (mostrarMsg) {
        sucesso('Registro cadastrado com sucesso.');
      }
      const dataAtual = window.moment(window.moment().format('YYYY-MM-DD'));
      const ehDataAnterior = window.moment(dataAtual).isAfter(data);
      this.resetarInfomacoes(ehDataAnterior);
      if (!ehDataAnterior && mostrarMsg) {
        this.dispatch(setAuditoriaNovoRegistro(retorno.data));
        this.dispatch(
          atualizaDadosRegistroAtual({
            id: retorno.data.id,
            registro,
            alunoCodigo,
            data,
          })
        );
      }
    }
  };

  editarRegistroIndividual = async (
    registroIndividual,
    turmaId,
    mostrarMsg
  ) => {
    this.dispatch(setExibirLoaderGeralRegistroIndividual(true));

    const {
      id,
      alunoCodigo,
      data,
      registro,
    } = registroIndividual.dadosParaSalvarNovoRegistro;
    const retorno = await ServicoRegistroIndividual.editarRegistroIndividual({
      id,
      turmaId,
      componenteCurricularId:
        registroIndividual.componenteCurricularSelecionado,
      alunoCodigo,
      registro,
      data,
    })
      .catch(e => erros(e))
      .finally(() =>
        this.dispatch(setExibirLoaderGeralRegistroIndividual(false))
      );

    if (retorno?.status === 200) {
      if (mostrarMsg) {
        sucesso('Registro editado com sucesso.');
        this.dispatch(
          atualizaDadosRegistroAtual({
            id: retorno.data.id,
            registro,
            alunoCodigo,
            data,
          })
        );
      }
      this.dispatch(setAuditoriaNovoRegistro(retorno.data));
      const dataAtual = window.moment(window.moment().format('YYYY-MM-DD'));
      const ehDataAnterior = window.moment(dataAtual).isAfter(data);
      this.resetarInfomacoes(ehDataAnterior);
    }
  };
}
export default new MetodosRegistroIndividual();
