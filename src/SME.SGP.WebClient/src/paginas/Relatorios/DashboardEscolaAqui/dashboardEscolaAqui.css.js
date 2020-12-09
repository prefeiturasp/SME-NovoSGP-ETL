import styled from 'styled-components';
import { Base } from '~/componentes/colors';

export const ContainerTabsDashboardEscolaAqui = styled.div`
  .ant-tabs-nav {
    width: 33.33% !important;
  }

  .scrolling-chart {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;

    ::-webkit-scrollbar-track {
      background-color: #f4f4f4 !important;
    }

    ::-webkit-scrollbar {
      width: 4px !important;
      background-color: rgba(229, 237, 244, 0.71) !important;
      border-radius: 2.5px !important;
    }

    ::-webkit-scrollbar-thumb {
      background: #a8a8a8 !important;
      border-radius: 3px !important;
    }
  }
`;

export const ContainerDataUltimaAtualizacao = styled.span`
  background-color: ${Base.Roxo};
  border: solid 0.5px ${Base.Roxo};
  border-radius: 3px;
  color: ${Base.Branco};
  font-weight: bold;
  padding: 0px 5px 0px 5px;
`;

export const TituloGrafico = styled.div`
  text-align: center;
  font-size: 24px;
  color: #000000;
  font-weight: 700;
  margin: 10px;
`;

export const ContainerGraficoBarras = styled.div`
  height: 80vh;
  width: 80vw;
`;