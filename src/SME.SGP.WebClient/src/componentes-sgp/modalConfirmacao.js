import { Modal } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import shortid from 'shortid';
import styled from 'styled-components';

import Button from '../componentes/button';
import { Colors } from '../componentes/colors';
import { alertaFechar } from '../redux/modulos/alertas/actions';

const ContainerModal = styled.div`
  .ant-modal-footer {
    border-top: 0px !important;
  }
`;

const ContainerBotoes = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ModalConfirmacao = () => {
  const dispatch = useDispatch();
  const confirmacao = useSelector(state => state.alertas.confirmacao);

  const fecharConfirmacao = resultado => {
    if (confirmacao) confirmacao.resolve(resultado);
    dispatch(alertaFechar());
  };

  return (
    <ContainerModal>
      <Modal
        title={confirmacao.titulo}
        visible={confirmacao.visivel}
        onOk={() => fecharConfirmacao(true)}
        onCancel={() => fecharConfirmacao(false)}
        footer={[
          <ContainerBotoes key={shortid.generate()}>
            <Button
              key={shortid.generate()}
              onClick={() => fecharConfirmacao(true)}
              S
              label={confirmacao.textoOk}
              color={Colors.Azul}
              border
            />
            <Button
              key={shortid.generate()}
              onClick={() => fecharConfirmacao(false)}
              label={confirmacao.textoCancelar}
              type="primary"
              color={Colors.Azul}
            />
          </ContainerBotoes>,
        ]}
      >
        {confirmacao.texto && Array.isArray(confirmacao.texto)
          ? confirmacao.texto.map(item => (
              <div key={shortid.generate()}>{item}</div>
            ))
          : confirmacao.texto}
        {confirmacao.texto ? <br /> : ''}
        <b>{confirmacao.textoNegrito}</b>
      </Modal>
    </ContainerModal>
  );
};

export default ModalConfirmacao;
