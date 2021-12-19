import React from 'react';
import { BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import Companies from '../pages/companies';
import Home from '../pages/home';
import Invoices from '../pages/invoices';
import Users from '../pages/users';
import Unauthorized from '../pages/unauthorized';
import ProtectedRoute from '../components/ProtectedRoute';
import Quotations from '../pages/quotations';
import QuotationDetails from '../pages/quotation-details';
import Plans from '../pages/plans';
import Products from '../pages/products';
import Sellers from '../pages/sellers';

const AppRoutes: React.FC = () => {
    return(
        <BrowserRouter>
            <Switch>
                <ProtectedRoute path="/" exact component={Home} />
                <ProtectedRoute path="/plans" exact component={Plans} roles={['ADMIN']}/>
                <ProtectedRoute path="/companies" exact component={Companies} roles={['ADMIN']}/>
                <ProtectedRoute path="/users" exact component={Users} roles={['ADMIN']}/>
                <ProtectedRoute path="/products" exact component={Products} roles={['ADMIN']}/>
                <ProtectedRoute path="/sellers" exact component={Sellers} roles={['ADMIN']}/>
                <ProtectedRoute path="/invoices" exact component={Invoices} roles={['ADMIN']}/>
                <ProtectedRoute path="/quotations" exact component={Quotations} roles={['ADMIN']}/>
                <ProtectedRoute path="/quotations/:id" exact component={QuotationDetails} roles={['ADMIN']}/>
                <Route path="/unauthorized" exact component={Unauthorized}/>
                <Redirect to="/" />
            </Switch>
        </BrowserRouter>
    )
}

export default AppRoutes;