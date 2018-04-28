import React, { Component } from 'react';
import { Link } from "react-router-dom";
import fire from "../fire"
import { connect } from "react-redux";

// var allReportKey = []
var allReport = [];
var reportsRef = fire.database().ref('reports');
reportsRef.on('child_added', snap => {
    let report = { id: snap.key, data: snap.val() }
    // this.setState({ users: [user].concat(this.state.users) });
    // console.log(snap.val());
    // allReportKey.push(report.id)
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

        reportsRef.on('child_changed', snap => {
            let report = { id: snap.key, data: snap.val() }
            for (let i in allReport) {
                if (allReport[i].id === report.id) {
                    allReport[i].data = report.data;
                    break;
                }
            }
            this.props.addReport(allReport);
        });
        reportsRef.on('child_removed', snap => {
            let remove = snap.key;
            for (let i in allReport) {
                if (allReport[i].id === remove) {
                    allReport.splice(i, 1)
                    break;
                }
            }
            this.props.addReport(allReport);
        });


        this.props.addReport(allReport);
        this.props.addUsers(allUser);

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
                            {/* <a id="topTitle" className="navbar-brand text-dark"></a> */}
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
                {reportLength === 0 ? '' : <a className="badge badge-danger text-light">{reportLength}</a>}
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
    allReport.sort(function (a, b) { return (b.data.when > a.data.when) ? 1 : ((a.data.when > b.data.when) ? -1 : 0); });
    allReport.sort(function (a, b) { return (b.data.status > a.data.status) ? 1 : ((a.data.status > b.data.status) ? -1 : 0); });
    if (allReport) {
        for (let index = 0; index < allReport.length; index++) {
            let report = allReport[index];
            if (report.data.status === "inprogress") {
                reportcards.push(<div key={report.id}>
                    <button className="dropdown-item" type="button" data-toggle="modal" data-target={"#" + report.id}><i className="fa fa-file-text-o" /> {report.data.title}
                        <div className="col-12 font-weight-light d-flex justify-content-end" style={{ paddingTop: "1px", fontSize: "12px" }}>
                            {Math.floor((Date.now() - report.data.when) / 3600000) + ' hr ' +
                                Math.floor((((Date.now() - report.data.when) / 3600000) % 1) * 60) + ' min ago'}
                        </div>
                    </button>
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
    // var target = [];
    var owner = [];
    if (props.report.data.owner) {
        var ownerRef = fire.database().ref('users/' + props.report.data.owner);
        ownerRef.on('value', function (snapshot) {
            owner = snapshot.val();
        });
    }
    // if (props.report.data.target) {
    //     var targetRef = fire.database().ref('users/' + props.report.data.target);
    //     targetRef.on('value', function (snapshot) {
    //         target = snapshot.val();
    //     });
    // }
    // console.log(target)

    var reportDate = new Date(props.report.data.when);
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
                                {owner.Profile ?
                                    <div className="col-6">
                                        Owner: <input className="form-control" value={owner.Profile.displayName} disabled="disabled" />
                                    </div>
                                    : ''}
                            </div>
                            {/* {target.Profile ?
                                <div>
                                    <br />
                                    <div className="col-12 row d-flex align-items-center">
                                        <div className="col-6"></div>
                                        <div className="col-6">Target: <input className="form-control" value={target.Profile.displayName} disabled="disabled" /></div>
                                    </div>
                                </div> : ''} */}
                            <br />
                            <div className="col-12 row d-flex align-items-center">
                                <div className="col-12">Detail:
                                <textarea className="form-control"
                                        value={props.report.data.detail}
                                        disabled="disabled"
                                        style={{ minHeight: "310px", resize: "none" }}
                                    />
                                </div>
                            </div>

                            <div className="col-12 font-weight-light">
                                {reportDate.toString()}
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
