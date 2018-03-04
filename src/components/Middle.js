import React, { Component } from 'react';
import '../css/bero.css';
import Sidebar from './Sidebar';
import Content from './contents/Content';
import { Route, Router, Link, browserHistory } from 'react-router';
class Middle extends Component {
    render() {
        return (

            <div className="container-fluid">
                <div className="row">

                    <Sidebar />


                    <Content />

                </div>
            </div>
        );
    }
}
export default Middle;
