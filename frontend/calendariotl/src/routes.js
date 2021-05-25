import { BrowserRouter, Route, Switch } from 'react-router-dom';
import React from 'react';


import Register from './pages/Register';
import Login from './pages/Login';
import Panel from './pages/Panel';

export default function Routes(){
    return(
        <BrowserRouter>
        <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/panel" component={Panel} />
        </Switch>
        </BrowserRouter>
    )
}