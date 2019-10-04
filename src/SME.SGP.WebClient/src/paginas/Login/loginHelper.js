import LoginService from '~/servicos/Paginas/LoginServices';
import { salvarDadosLogin } from '~/redux/modulos/usuario/actions';
import history from '~/servicos/history';
import { URL_HOME, URL_MODIFICARSENHA } from '~/constantes/url';

class LoginHelper {
  constructor(dispatch, redirect) {
    this.dispatch = dispatch;
    this.redirect = redirect;
  }

  acessar = async login => {
    const autenticacao = await LoginService.autenticar(login);

    if (!autenticacao.sucesso) return autenticacao;

    const rf = Number.isInteger(login.usuario * 1) ? login.usuario : '';

    this.dispatch(
      salvarDadosLogin({
        token: autenticacao.dados.token,
        rf,
        perfisUsuario: autenticacao.dados.PerfisUsuario,
      })
    );

    if (autenticacao.dados.modificarSenha) {
      history.push('/redefinir-senha');
      console.log(history);
      return { sucesso: false, erroGeral: '' };
    }

    if (this.redirect) history.push(atob(this.redirect));
    else history.push(URL_HOME);

    console.log(history);
    console.log(autenticacao);

    return autenticacao;
  };
}

export default LoginHelper;
