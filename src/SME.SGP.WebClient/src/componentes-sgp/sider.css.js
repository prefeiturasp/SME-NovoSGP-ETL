import { Base } from '../componentes/colors';
import styled from 'styled-components';

export const MenuBody = styled.div`
position: fixed;
`;

export const DivFooter = styled.div`
display: flex;
justify-content: center;
flex-direction: row;
align-items: center;
color: ${Base.Branco};
background: ${Base.Roxo};
text-align: center;
width:300px;
vertical-align: bottom;
position: absolute;
bottom: 0;
margin-bottom: 40px;

.ant-layout-footer{
  color: ${Base.Branco};
  background: ${Base.Roxo};
}
.descricao{
  font-size:9px;
}
.logo-secretaria{
  width: 140px;
  padding-bottom: 10px;
}
`;

export const Topo = styled.div`
  width:100%;

  .conteudo{
    height: 20px;
  }
  .arrow{
    float: right;
  }

  .arrow i{
    margin: 8px 12px 0px 0px;
  }

  .perfil{
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    height: 150px;
    color: ${Base.Branco};
    width: 100%;
  }

  .perfil-retraido{
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    height: 100px;
    color: ${Base.Branco};
    width: 100%;
    margin-bottom: 50px;
  }

  .circulo-perfil img {
    border: 2px solid ${Base.Branco};
    border-radius: 50%;
    bottom: 0;
    width: 100%;
    width: 70px;
    height: 70px;
    margin-bottom: 10px;
  }

  .nome{
    width: 100%;
    border-radius: 15px;
    border: 1px solid ${Base.Branco};
    color: white;
    padding: 5px 15px;
    font-size: 12px;
  }

  .perfil-edit{
    font-size: 10px !important;
  }

  .perfil-edit i{
    margin-right: 4px;
  }
`;

export const MenuScope = styled.div`
/*----MENU EXPANDIDO----*/
  .menu-scope{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center
  }

  .icons{
    font-style: normal !important;
    margin-right: 12px;
    height: 18px;
    width: 13.5px;
  }

  .ant-menu{
    background: ${Base.Roxo};
    width: 242px;
  }

  .ant-menu-submenu-title, .ant-menu-item{
    height: 35px !important;
  }

  .ant-menu-item, .ant-menu-submenu-open {    
    background: ${Base.Branco} !important;
  }

  .ant-menu-submenu-title:first-child, .ant-menu-submenu-open{
    border-radius:4px;
  }

  .ant-menu-submenu-title{
    margin-top:3px !important;
    padding-left: 15px !important;
    font-size: 14px !important;
    font-weight: bold;
  }

  .ant-menu-item:last-child, .ant-menu-inline.ant-menu-sub:last-child{
    border-bottom-right-radius:4px !important;
    border-bottom-left-radius:4px !important;
  }


  .ant-menu-item {
    padding-left: 34px !important;
    font-size: 12px !important;
    padding-left: 40px !important;
  }

  .ant-menu-item-selected{
    background: ${Base.CinzaMenu} !important;
    border-bottom-width: 8px;
    padding-left: 32px !important;
    border-left: solid ${Base.RoxoClaro} 8px !important;
  }

  .ant-menu-dark:not(:disabled), .ant-menu-submenu-arrow{
    color: ${Base.Branco};
    opacity: initial !important;
  }

 .ant-menu-submenu-title:hover .ant-menu-submenu-arrow::before {
    background: ${Base.Roxo} !important;
  }

  .ant-menu-submenu-title:hover  .ant-menu-submenu-arrow::after {
    color: ${Base.Branco} !important;
    background: ${Base.Roxo} !important;
  }

  .ant-menu-submenu-open > div > i::before {
    background: ${Base.Roxo} !important;
  }
  .ant-menu-submenu-open > div > i::after {
    background: ${Base.Roxo} !important;
  }

  .menuItem{
    color: ${Base.CinzaMenuItem} !important;
  }

  .ant-menu-submenu-title:hover:not(:disabled), .ant-menu-inline.ant-menu-sub, .ant-menu-submenu-open{
    background: ${Base.Branco};
    color: ${Base.Roxo};
  }

  .ant-menu-dark> .ant-menu-submenu-disabled > .ant-menu-submenu-title{
    opacity: initial;
    background: ${Base.Roxo};
    color:  ${Base.CinzaDesabilitado};
  }

  .ant-menu-dark> .ant-menu-submenu-open{
    color:  ${Base.Roxo};    
  }

  .ant-menu-inline.ant-menu-sub{    
    background: ${Base.Branco} !important;
  }

  .menu-scope{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center
  }

  /*----MENU RETRAÍDO----*/
  .ant-menu-vertical{
    width:100px;    
  }

   
  .ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open{
    color: ${Base.Roxo};
  }

  .ant-menu-vertical> .ant-menu-submenu{
    height: 80px !important;
    border-radius: 0 !important; 

    .ant-menu-submenu-title{
      border-radius: 0 !important; 
      height: 80px !important;
      .item-menu-retraido{
        margin-top: 10px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        margin-bottom: 50px;
        font-weight:normal;
        font-size: 12px;
      }
    }
  }

  .icons-retraido{
    font-size: 30px;
    margin-top: 0px !important;
  }

  .ant-menu-submenu .ant-menu-submenu-popup .ant-menu-dark .ant-menu-submenu-placement-rightTop  .ant-menu-submenu-hidden::after{
    color: red !important;
  }
  `;


