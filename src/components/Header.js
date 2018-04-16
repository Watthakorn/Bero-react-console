import React, { Component } from 'react';
import { Link } from "react-router-dom";
import fire from "../fire"
import { connect } from "react-redux";

var allReport = [];
var reportsRef = fire.database().ref('reports');
reportsRef.on('child_added', snap => {
    let report = { id: snap.key, data: snap.val() }
    // this.setState({ users: [user].concat(this.state.users) });
    // console.log(snap.val());
    allReport.push(report);
});
var allUser = [];
var usersRef = fire.database().ref('users');
usersRef.on('child_added', snap => {
    let user = { id: snap.key, data: snap.val() }
    // this.setState({ users: [user].concat(this.state.users) });
    // console.log(snap.val());
    allUser.push(user);
});

class Header extends Component {

    componentWillMount() {

        this.props.addUsers(allUser);
        this.props.addReport(allReport);

    }

    _handleSave(e) {
        e.preventDefault();
        // console.log(e.target.id);
        fire.database().ref('reports/' + e.target.id).update({
            status: "done",
        });
        // console.log("hey wake up!");
        e.target.submitBtn.disabled = "disabled";
    }

    render() {
        const props = this.props;
        const user = props.user.user;
        const reports = props.reports.reports;

        return (
            <div>
                <div className="container-fluid fixed-top">
                    <div className="row">
                        <div className="navbar col-4 col-sm-3  col-md-2 navbar-light bg-info">
                            <Link id="beroConsole" className="navbar-brand text-light" to="/">Bero console</Link>
                        </div>

                        <div className="navbar col-2 col-sm-2 col-md-3 top-title bg-light">
                            <a id="topTitle" className="navbar-brand text-dark"></a>
                        </div>

                        <div className="nav col-6 col-sm-7 col-md-7 top-title bg-light d-flex justify-content-end">
                            <div className="d-flex align-items-center">
                                <div className="col-12">
                                    {user ? user.type === "Admin" ?
                                        <NotiBell reports={reports} />
                                        : '' : ''
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <ReportModals allReport={reports} onSubmit={(e) => this._handleSave(e)} />
            </div>
        );
    }
}

function NotiBell(props) {
    var reports = props.reports;
    var reportLength = 0;

    for (let index = 0; index < reports.length; index++) {
        let report = reports[index];
        if (report.data.status === "inprogress") {
            reportLength += 1;
        }
    }
    return (
        <div className="btn-group">
            <button className="btn btn-outline-dark btn-sm dropdown-toggle" data-toggle="dropdown"><i className="fa fa-bell"></i>
                {reportLength === 0 ? '' : <a>{reportLength}</a>}
            </button>
            <div className="dropdown-menu dropdown-menu-right">
                <ReportNoti allReport={reports} />
                <Link style={{ "textAlign": "center", "color": "blue" }} className="dropdown-item" to="/report"> All report</Link>
            </div>
        </div>
    )

}

function ReportNoti(props) {
    var reportcards = [];
    var allReport = props.allReport;
    if (allReport) {
        for (let index = 0; index < allReport.length; index++) {
            let report = allReport[index];
            if (report.data.status === "inprogress") {
                reportcards.push(<div key={report.id}>
                    <button className="dropdown-item" type="button" data-toggle="modal" data-target={"#" + report.id}><i className="fa fa-info-circle" /> {report.data.title}</button>
                    <div className="dropdown-divider"></div>
                </div>);
            }
        }
    }
    return reportcards;
}


function ReportModals(props) {
    var reportmodals = [];
    var allReport = props.allReport;
    if (allReport) {
        for (let index = 0; index < allReport.length; index++) {
            let report = allReport[index];
            reportmodals.push(<ReportModal key={report.id} report={report} reportNo={index + 1} target={report.id} onClick={props.onClick} onSubmit={props.onSubmit} />);
        }
    }
    return reportmodals;

}
function ReportModal(props) {
    return (
        <div className="modal fade" id={props.target} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">Report: {props.report.data.title}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form id={props.report.id} onSubmit={props.onSubmit}>
                        <div className="modal-body">
                            {/* <div className="col-12 row">
                            ID: {props.report.id}
                        </div>
                        <br /> */}
                            <div className="col-12 row d-flex align-items-center">
                                <div className="col-6">Title: <input className="form-control" value={props.report.data.title} disabled="disabled" /></div>
                                <div className="col-6">Owner: <input className="form-control" value={props.report.data.owner} disabled="disabled" /></div>
                            </div>
                            {props.report.data.target &&
                                <div>
                                    <br />
                                    <div className="col-12 row d-flex align-items-center">
                                        <div className="col-6"></div>
                                        <div className="col-6">Target: <input className="form-control" value={props.report.data.target} disabled="disabled" /></div>
                                    </div>
                                </div>}
                            <br />
                            <div className="col-12 row d-flex align-items-center">
                                <div className="col-12">Detail: <textarea className="form-control" value={props.report.data.title} disabled="disabled" /></div>
                            </div>
                            <br />
                            {/* <div className="col-12 row d-flex align-items-center">
                            <div className="col-6">Status: {props.report.data.status}</div>
                        </div> */}

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            {props.report.data.status === "inprogress" ?
                                <button type="submit"
                                    value={props.report.id}
                                    // onClick={props.onClick}
                                    name="submitBtn"
                                    className="btn btn-primary"
                                    disabled={props.report.data.status === "inprogress" ? "" : "disabled"}>
                                    Done</button>
                                : ''}

                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

}

const mapStateToProps = (state) => {
    return {
        reports: state.reportsReducer,
        users: state.usersReducer,
        user: state.userReducer
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        addReport: (reports) => {
            if (reports) {
                dispatch({
                    type: "REPORTS_FETCH",
                    payload: reports
                })
            }
        },
        addUsers: (users) => {
            if (users) {
                dispatch({
                    type: "USERS_PROFILE_FETCH",
                    payload: users
                })
            }
        }
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(Header);
