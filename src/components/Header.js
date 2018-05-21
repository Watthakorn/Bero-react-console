import React, { Component } from 'react';
import { Link } from "react-router-dom";
import fire from "../fire"
import { connect } from "react-redux";

var allReport = [];
var reportsRef = fire.database().ref('reports');

var allUser = [];
var usersRef = fire.database().ref('users');
usersRef.on('child_added', snap => {
    let user = { id: snap.key, data: snap.val() }
    allUser.push(user);
});

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unreadId: [],
            rLength: 0,
        };
    }

    componentWillMount() {
        reportsRef.on('child_added', snap => {
            let report = { id: snap.key, data: snap.val() }
            allReport.push(report);
            this.props.addReport(allReport);
            if (report.data.status === "inprogress" && !(report.data.read)) {
                this.setState({ rLength: this.state.rLength + 1 })
                this.setState({ unreadId: [...this.state.unreadId, report.id] })
            }
        });

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
        fire.database().ref('reports/' + e.target.id).update({
            status: "done",
        });
        e.target.submitBtn.disabled = "disabled";
    }


    _handleEnter(e) {
        var readId = e.target.value
        var unread = [...this.state.unreadId]
        var index = unread.indexOf(readId);
        if (e.target.value && index !== -1) {
            fire.database().ref('reports/' + readId).update({
                read: 1,
            });
            unread.splice(index, 1);
            this.setState({ rLength: this.state.rLength - 1 })
            this.setState({ unreadId: unread });
        }
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
                        </div>

                        <div className="nav col-6 col-sm-7 col-md-7 top-title bg-light d-flex justify-content-end">
                            <div className="d-flex align-items-center">
                                <div className="col-12">
                                    {user ? user.type === "Admin" ?
                                        <NotiBell reports={reports} reportLength={this.state.rLength} onMouseEnter={(e) => this._handleEnter(e)} />
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
    var reportLength = props.reportLength;
    return (
        <div className="btn-group" >
            <button className="btn btn-outline-dark btn-sm dropdown-toggle" data-toggle="dropdown"><i className="fa fa-bell"></i>
                {reportLength === 0 ? '' : <a className="badge badge-danger text-light">{reportLength}</a>}
            </button>
            <div className="dropdown-menu dropdown-menu-right">
                <ReportNoti allReport={reports} onMouseEnter={props.onMouseEnter} />
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
            if (report.data.status === "inprogress" && !(report.data.read)) {
                reportcards.push(<div key={report.id}>
                    <button className="dropdown-item noti-overflow" style={{ backgroundColor: "#f3f3f3" }} type="button" onMouseEnter={props.onMouseEnter} value={report.id} data-toggle="modal" data-target={"#" + report.id}><i className="fa fa-file-text-o" /> {report.data.title}
                        <div className="col-12 font-weight-light d-flex justify-content-end" style={{ paddingTop: "1px", fontSize: "12px" }}>
                            {Math.floor((Date.now() - report.data.when) / 3600000) + ' hr ' +
                                Math.floor((((Date.now() - report.data.when) / 3600000) % 1) * 60) + ' min ago'}
                        </div>
                    </button>
                    <div className="dropdown-divider"></div>
                </div>);
            } else if (report.data.status === "inprogress") {
                reportcards.push(<div key={report.id}>
                    <button className="dropdown-item noti-overflow" type="button" data-toggle="modal" data-target={"#" + report.id}><i className="fa fa-file-text-o" /> {report.data.title}
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
    var owner = [];
    if (props.report.data.owner) {
        var ownerRef = fire.database().ref('users/' + props.report.data.owner);
        ownerRef.on('value', function (snapshot) {
            owner = snapshot.val();
        });
    }

    var reportDate = new Date(props.report.data.when);
    return (
        <div className="modal fade" id={props.target} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">Report ID: {props.report.id}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form id={props.report.id} onSubmit={props.onSubmit}>
                        <div className="modal-body">

                            <div className="col-12 row d-flex align-items-center">
                                <div className="col-6">Title: <input className="form-control" value={props.report.data.title} disabled="disabled" /></div>
                                {owner.Profile ?
                                    <div className="col-6">
                                        Owner: <input className="form-control" value={owner.Profile.displayName} disabled="disabled" />
                                    </div>
                                    : ''}
                            </div>
                            {owner.Profile ?
                                <div>
                                    <br />
                                    <div className="col-12 row d-flex align-items-center">
                                        <div className="col-6"></div>
                                        <div className="col-6">Facebook ID: <input className="form-control" value={owner.Profile.facebookUid} disabled="disabled" /></div>
                                    </div>
                                </div> : ''}
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

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            {props.report.data.status === "inprogress" ?
                                <button type="submit"
                                    value={props.report.id}
                                    name="submitBtn"
                                    className="btn btn-success"
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
