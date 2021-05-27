import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import logo from "../../assets/tklab_logo.png";
import api from "../../services/api";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
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

export default function Register() {
  const classes = useStyles();
  const [user_firstName, setName] = useState();
  const [user_surName, setSurName] = useState();
  const [user_email, setEmail] = useState();
  const [user_password, setPassword] = useState();
  const history = useHistory();
  document.title = "Registro";

  useEffect(() => {
    document.body.style.backgroundColor = "#81BDEA";
  });

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <img src={logo} alt="logo" className={classes.logo}></img>
        <Typography component="h1" variant="h5">
          Registro de usuário
        </Typography>
        <div className={classes.alert} id="alert-data">
          <Alert
            severity="error"
            variant="filled"
            onClose={() => {
              let alerta = document.getElementById("alert-data");
              alerta.style.display = "none";
            }}
          >
            Dados Incorretos!
          </Alert>
        </div>
        <div className={classes.alert} id="alert-user">
          <Alert
            severity="error"
            variant="filled"
            onClose={() => {
              let alerta = document.getElementById("alert-user");
              alerta.style.display = "none";
            }}
          >
            Usuário já cadastrado
          </Alert>
        </div>
        <form className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="Primeiro Nome"
                autoFocus
                onChange={(event) => setName(event.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Sobrenome"
                name="lastName"
                autoComplete="lname"
                onChange={(event) => setSurName(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="E-mail"
                name="email"
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Senha"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            // type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => handleRegister()}
          >
            Registrar
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/" variant="body2">
                Já poussi uma conta? Faça login
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );

  async function handleRegister() {
    const user_name = user_firstName + " " + user_surName;
    await api.post("/users", { user_name, user_email, user_password }).then(
      (response) => {
        // alert("Usuário cadastrado com sucesso!");
        history.push("/");
      },
      (error) => {
        if (error.response.data === "Usuário já cadastrado") {
          if (document.getElementById("alert-data").style.display === "block")
            document.getElementById("alert-data").style.display = "none";
          document.getElementById("alert-user").style.display = "block";
        } else if (error.response.data === "Dados Incorretos") {
          if (document.getElementById("alert-user").style.display === "block")
            document.getElementById("alert-user").style.display = "none";
          document.getElementById("alert-data").style.display = "block";
        }
      }
    );
  }
}
