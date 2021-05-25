import React, { useEffect, useState } from "react";
import "./styles.css";

import { useHistory } from "react-router";

import CreateEvent from "./CreateEvent/index";
import ListEvents from "./EventList/index";

import logo from "../../assets/tklab_logo.png";

import { FaUserCircle, FaPlus } from "react-icons/fa";
import { CgMenuBoxed } from "react-icons/cg";

export default function Panel(props) {
  const [seletorTela, setSeletor] = useState(0);
  const [user, setUser] = useState("");
  const history = useHistory();
  document.title = "Painel de Eventos";
  useEffect(() => {
    setUser(props.location.state.user);
  }, []);
  
  function ManageScreen(escolha) {
    switch (escolha) {
      case 0:
        return <CreateEvent data={user} />;
      case 1:
        return <ListEvents data={user} />;
    }
  }

  return (
    <div className="container">
      <div className="header-dashboard">
        <img className="img-header" src={logo} alt="" />
        <div className="div-header">
          <p className="p-header">{user.user_name}</p>
          <FaUserCircle className="icon" />
        </div>
      </div>
      <div className="sub-container">
        <div className="col-esq">
          <div className="botoes-col-esq" onClick={() => selecionarBotao(0)}>
            <FaPlus /> <h3 className="h3-botao">Criar Evento</h3>
          </div>
          <div className="botoes-col-esq" onClick={() => selecionarBotao(1)}>
            <CgMenuBoxed /> <h3 className="h3-botao">Listar Eventos</h3>
          </div>

          <a className="botoes-col-esq-sair">
            <div className="div-texto" onClick={() => handleSair()}>
              Sair
            </div>
          </a>
        </div>
        <div className="col-centro">{ManageScreen(seletorTela)}</div>
      </div>
    </div>
  );

  function selecionarBotao(opt) {
    setSeletor(opt);

    let botoesEsq = document.querySelector(".col-esq");
    for (let aux = 0; aux < botoesEsq.children.length; aux++)
      botoesEsq.children[aux].classList.remove("botao-negrito");
    botoesEsq.children[opt].classList.add("botao-negrito");
  }

  function handleSair() {
    history.push("/");
  }
}
