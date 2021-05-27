import React, { useEffect, useState } from "react";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Alert from "@material-ui/lab/Alert";

import logo from "../../assets/tklab_logo.png";
import api from "../../services/api";

import { useHistory } from "react-router";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  logo: {
    paddingBottom: "15px",
    width: "300px",
  },
  alert: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
    display: "none",
  },
}));

export default function Login() {
  const classes = useStyles();
  const [user_email, setEmail] = useState("");
  const [user_password, setPassword] = useState("");
  const history = useHistory();
  document.title = "Sistema de Calendário";

  useEffect(() => {
    document.body.style.backgroundColor = "#81BDEA";
  });

  return (
    <Container component="main" maxWidth="sm">
      <div className={classes.paper}>
        <img src={logo} className={classes.logo} alt="logo" />
        <Typography component="h1" variant="h5">
          Sistema de Calendário
        </Typography>
        <div className={classes.alert} id="alert-user">
          <Alert severity="error" variant="filled" onClose={() => {
            let alerta = document.getElementById("alert-user");
            alerta.style.display = "none";
          }}>
            Usuário não encontrado
          </Alert>
        </div>
        <div className={classes.alert} id="alert-password">
          <Alert severity="error" variant="filled" onClose={() => {
            let alerta = document.getElementById("alert-password");
            alerta.style.display = "none";
          }}>
            Senha Incorreta
          </Alert>
        </div>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="E-mail"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => handleLogin()}
          >
            Entrar
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Ainda não é registrado? Faça seu cadastro"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );

  async function handleLogin() {
    await api.post("/session", { user_email, user_password }).then(
      (response) => {
        if (response.data.message) {
          if(document.getElementById("alert-user").style.display === "block")
          document.getElementById("alert-user").style.display = "none";
          let alertaSenha = document.getElementById("alert-password");
          alertaSenha.style.display = "block";
        } else {
          history.push({
            pathname: "/panel",
            state: {
              user: response.data,
            },
          });
        }
      },
      (error) => {
        //alert(error.response.data);
        console.log(error.response.data);
          if(document.getElementById("alert-password").style.display === "block")
          document.getElementById("alert-password").style.display = "none";
          let alerta = document.getElementById("alert-user");
          alerta.style.display = "block";
      }
    );
  }
}
