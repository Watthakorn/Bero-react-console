import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../css/bero.css';

class Sidebar extends Component {
    render() {
        return (
            <div className="col-4 col-sm-3 col-md-2 sidebar-fixed" >
                <div className="col-4 col-sm-3 col-md-2 bg-light sidebar" id="sticky-sidebar">

                    {/* <!-- Profile --> */}
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex">
                                <i className="fa fa-address-card-o" />
                                mini proflie
                                </div>

                        </div>
                    </div>

                    <ul className="navbar-nav flex-column">
                        {/* <!-- ADMIN Sidebar --> */}
                        <li className="menu-title">Admin</li>
                        <li className="nav-item btn-light">
                            <Link className="nav-link" to="/report"><i className="fa fa-file-text-o"></i> Report</Link>
                        </li>
                        <li className="nav-item btn-light">
                            <Link className="nav-link" to="/information"><i className="fa fa-building-o"></i> Infomation</Link>
                        </li>
                        <li className="nav-item btn-light">
                            <Link className="nav-link" to="/user"><i className="fa fa-users"></i> User</Link>
                        </li>
                    </ul>

                    {/* <!-- EVENT Sidebar --> */}
                    <ul className="navbar-nav flex-column">
                        <li className="menu-title">Event</li>
                        <li className="nav-item btn-light">
                            <Link className="nav-link" to="Event"><i className="fa fa-gears"></i> Manage</Link>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}
export default Sidebar;
