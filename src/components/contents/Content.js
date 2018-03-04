import React, { Component } from 'react';
import FirstPage from './FirstPage';
import Report from './Report';
import Informaiton from './Information';
import User from './User';
import Event from './Event';
import { Switch, Route } from 'react-router-dom';
import '../../css/bero.css';

class Content extends Component {
    render() {
        return (
            <div className="main-content col-8 col-sm-9 col-md-10 pt-3 px-4" id="main">

                <Switch>
                    <Route exact path='/' component={FirstPage} />
                    <Route path='/report' component={Report} />
                    <Route path='/information' component={Informaiton} />
                    <Route path='/user' component={User} />
                    <Route path='/event' component={Event} />
                </Switch>

            </div>
        );
    }
}


export default Content;
