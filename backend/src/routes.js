const express = require('express');
const routes = express.Router();
const authMiddleware = require('./middleware/auth');

const UserController = require('./controllers/UserController');
const UserSessionController = require('./controllers/UserSessionController');
const EventController = require('./controllers/EventController');

//Rotas de usuário
routes.post("/users", UserController.create);

//Rota de sessão de usuário
routes.post("/session", UserSessionController.create);

//Rotas de eventos
routes.post("/events", authMiddleware, EventController.create);
routes.get("/events", authMiddleware, EventController.indexAll);
routes.get("/events/:id", authMiddleware, EventController.indexSingle);
routes.put("/events/:id", authMiddleware, EventController.update);
routes.delete("/events/:id", authMiddleware, EventController.delete);


module.exports = routes;