import React, { useEffect, useState } from "react";
import "./styles.css";

import api from "../../../services/api";

import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";

import { useHistory } from "react-router";


export default function CreateEvent(props) {
  const [event_description, setDescription] = useState();
  const [event_dateStart, setDateStart] = useState();
  const [event_dateEnd, setDateEnd] = useState();
  const [event_startHour, setStartHour] = useState();
  const [event_endHour, setEndHour] = useState();
  const history = useHistory();

  const config = {
    headers: {
      Authorization: `Bearer ${props.data.user_token}`,
      user: props.data.user_id,
    },
  };

  useEffect(async () => {}, []);

  return (
    <div>
      <h1>Criar Evento</h1>

      <div id="container">
        <TextField
          label="Descrição"
          onChange={(event) => setDescription(event.target.value)}
        />

        <div className="linha-2-itens">
          <div className="label-input">
            <InputLabel style={{ marginTop: 16 }}>Data Inicio</InputLabel>
            <TextField
              id="date"
              type="date"
              minDate= "0"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) => setDateStart(event.target.value)}
            />
          </div>
          <div className="label-input">
            <InputLabel style={{ marginTop: 16 }}>Horario de Inicio</InputLabel>
            <TextField
              id="time"
              type="time"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
              onChange={(event) => setStartHour(event.target.value)}
            />
          </div>
        </div>

        <div className="linha-2-itens">
          <div className="label-input">
            <InputLabel style={{ marginTop: 16 }}>Data Término</InputLabel>
            <TextField
              id="date"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) => setDateEnd(event.target.value)}
            />
          </div>
          <div className="label-input">
            <InputLabel style={{ marginTop: 16 }}>Horario Término</InputLabel>
            <TextField
              id="time"
              type="time"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
              onChange={(event) => setEndHour(event.target.value)}
            />
          </div>
        </div>

        <button id="btn-salvar" onClick={() => createEvent()}>
          Criar
        </button>
      </div>
    </div>
  );

  async function createEvent() {

    const event = {
      event_description: event_description, 
      event_startHour: event_startHour, 
      event_endHour: event_endHour, 
      event_dateStart: event_dateStart, 
      event_dateEnd: event_dateEnd, 
    }

    if(event_dateEnd < event_dateStart){
      alert('Datas incorretas!');
    }else if(parseInt(event_endHour) < parseInt(event_startHour)){
      alert('Horarios incorretos!')
    }else{
      await api.post("/events", event, config).then(async (response) => {
        await setDescription();
        await setStartHour();
        await setEndHour();
        await setDateStart();
        await setDateEnd();

        alert('Evento criado com sucesso!');
      }, (error) => {
        alert(error.response.data)
      })
    }
  }
}
