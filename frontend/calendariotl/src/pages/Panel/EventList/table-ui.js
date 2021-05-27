import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Alert from "@material-ui/lab/Alert";

import "./styles.css";

import api from "../../../services/api";

const columns = [
  { id: "code", label: "Código" },
  { id: "description", label: "Descrição" },
  { id: "dateStart", label: "Data Início" },
  { id: "hourStart", label: "Hora Início" },
  { id: "dateEnd", label: "Data Término" },
  { id: "hourEnd", label: "Hora Término" },
  { id: "eventEdit", label: "Editar" },
  { id: "eventDelete", label: "Deletar" },
];

export default function StickyHeadTable(props) {
  const [Event, setEvent] = useState([]);
  const [user] = useState(props.data);
  const [event_description, setDescription] = useState();
  const [event_dateStart, setDateStart] = useState();
  const [event_dateEnd, setDateEnd] = useState();
  const [event_startHour, setStartHour] = useState();
  const [event_endHour, setEndHour] = useState();
  const [event_id, setEventId] = useState();

  //Função de formatação da data
  function formatDate(input) {
    if (input) {
      let datePart = input.match(/\d+/g),
        year = datePart[0].substring(2), // get only two digits
        month = datePart[1],
        day = datePart[2];

      return day + "/" + month + "/" + year;
    } else {
      return;
    }
  }

  useEffect(() => {
    (async () => {
      let result = await api.get("/events", config);
      //Arrumando as datas para visualização
      for (let i = 0; i < result.data.length; i++) {
        result.data[i].event_dateStart = formatDate(
          result.data[i].event_dateStart
        );
        result.data[i].event_dateEnd = formatDate(result.data[i].event_dateEnd);
      }
      setEvent(result.data);
    })();
  }, []);

  //Cria os dados da tabela, alterar o link para endereço correto da API
  function createData(
    code,
    description,
    dateStart,
    hourStart,
    dateEnd,
    hourEnd,
    user_id
  ) {
    let eventEdit = "";
    let eventDelete = "";

    if (user_id === user.user_id) {
      eventEdit = "/events/" + code;
      eventDelete = "/events/" + code;
    }

    return {
      code,
      description,
      dateStart,
      hourStart,
      dateEnd,
      hourEnd,
      eventEdit,
      eventDelete,
    };
  }

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
    },
    container: {
      maxHeight: 600,
    },
    alert: {
      width: "100%",
      "& > * + *": {
        marginTop: theme.spacing(2),
      },
      display: "none",
      marginBottom: "10px",
    }
  }));

  const rows = [];
  if (Event.length)
    //Jogando os dados para a tabela
    Event.forEach((element) => {
      rows.push(
        createData(
          element.event_id,
          element.event_description,
          element.event_dateStart,
          element.event_startHour,
          element.event_dateEnd,
          element.event_endHour,
          element.user_id
        )
      );
    });

  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  //Configuração para requisição
  const config = {
    headers: {
      Authorization: `Bearer ${props.data.user_token}`,
      user: props.data.user_id,
    },
  };

  return (
    <div>
      <div id="div-table-events">
        <h1>Eventos</h1>
        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.code}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          if (
                            column.id === "eventEdit" &&
                            row.eventEdit !== ""
                          ) {
                            return (
                              <TableCell
                                numeric
                                component="a"
                                style={{ cursor: "pointer" }}
                                onClick={() => getEvent(row.code)}
                              >
                                Editar
                              </TableCell>
                            );
                          }
                          if (
                            column.id === "eventDelete" &&
                            row.eventDelete !== ""
                          ) {
                            return (
                              <TableCell
                                numeric
                                component="a"
                                style={{ cursor: "pointer" }}
                                onClick={() => deleteEvent(row.code)}
                              >
                                Deletar
                              </TableCell>
                            );
                          }

                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
      {/* div de edição de eventos */}
      <div>
        <div id="edit-event">
          <h1>Editar Evento</h1>
          <div className={classes.alert} id="alert-data">
            <Alert
              severity="error"
              variant="filled"
              onClose={() => {
                let alerta = document.getElementById("alert-data");
                alerta.style.display = "none";
              }}
            >
              Dados incorretos
            </Alert>
          </div>
          <div id="container">
            <TextField
              value={event_description}
              label="Descrição"
              onChange={(event) => setDescription(event.target.value)}
            />
            <div className="linha-2-itens">
              <div className="label-input">
                <InputLabel style={{ marginTop: 16 }}>Data Inicio</InputLabel>
                <TextField
                  id="date"
                  type="date"
                  value={event_dateStart}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(event) => setDateStart(event.target.value)}
                />
              </div>
              <div className="label-input">
                <InputLabel style={{ marginTop: 16 }}>
                  Horario de Inicio
                </InputLabel>
                <TextField
                  id="time"
                  type="time"
                  value={event_startHour}
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
                  value={event_dateEnd}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(event) => setDateEnd(event.target.value)}
                />
              </div>
              <div className="label-input">
                <InputLabel style={{ marginTop: 16 }}>
                  Horario Término
                </InputLabel>
                <TextField
                  id="time"
                  type="time"
                  value={event_endHour}
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

            <button id="btn-salvar" onClick={() => updateEvent()}>
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  async function deleteEvent(event_id) {
    try {
      const res = await api.delete("/events/" + event_id, config);
      alert(res.data);

      //Requisição para atualizar tabela
      let result = await api.get("/events", config);
      //Arrumando as datas para visualização
      for (let i = 0; i < result.data.length; i++) {
        result.data[i].event_dateStart = formatDate(
          result.data[i].event_dateStart
        );
        result.data[i].event_dateEnd = formatDate(result.data[i].event_dateEnd);
      }
      setEvent(result.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function getEvent(event_id) {
    await api.get("events/" + event_id, config).then(
      async (response) => {
        await setDescription(response.data[0].event_description);
        await setDateStart(response.data[0].event_dateStart.slice(0, 10));
        await setStartHour(response.data[0].event_startHour);
        await setDateEnd(response.data[0].event_dateEnd.slice(0, 10));
        await setEndHour(response.data[0].event_endHour);
        await setEventId(event_id);

        let edit = document.querySelector("#edit-event");
        edit.style.display = "block";
      },
      (error) => {
        alert(error.response.data);
      }
    );
  }

  async function updateEvent() {
    await api
      .put(
        "events/" + event_id,
        {
          event_description,
          event_dateStart,
          event_dateEnd,
          event_startHour,
          event_endHour,
        },
        config
      )
      .then(
        async (response) => {
          if (response.data.message) {
            alert(response.data.message);
          } else {
            //Validação de datas e horários
            if (event_dateEnd < event_dateStart) {
              document.getElementById("alert-data").style.display = "block";
            } else if (parseInt(event_endHour) < parseInt(event_startHour)) {
              document.getElementById("alert-data").style.display = "block";
            }else if(event_description === undefined || event_description === ''){
              document.getElementById("alert-data").style.display = "block";
            } else {
              let edit = document.querySelector("#edit-event");
              edit.style.display = "none";
              //Requisição para atualizar tabela
              let result = await api.get("/events", config);
              //Arrumando as datas para visualização
              for (let i = 0; i < result.data.length; i++) {
                result.data[i].event_dateStart = formatDate(
                  result.data[i].event_dateStart
                );
                result.data[i].event_dateEnd = formatDate(
                  result.data[i].event_dateEnd
                );
              }
              setEvent(result.data);
            }
          }
        },
        (error) => {
          document.getElementById("alert-data").style.display = "block";
        }
      );
  }
}
