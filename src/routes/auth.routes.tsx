import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Login from '../pages/login';
import ForgotPassword from '../pages/forgot-password';
import Register from '../pages/register';

const AuthRoutes: React.FC = () => {
    return(
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Login} />
                <Route path="/forgetpassword" exact component={ForgotPassword} />
                <Route path="/register" exact component={Register} />
                <Redirect to="/" />
            </Switch>             
        </BrowserRouter>
    )
}

export default AuthRoutes;