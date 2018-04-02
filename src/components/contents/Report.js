import React, { Component } from 'react';
import fire from '../../fire';
import '../../css/bero.css';
import { connect } from "react-redux";

// var allReport = [0, 1, 2, 3, 4, 5, 6, 7, 8];

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

class Report extends Component {

    componentWillMount() {

        // var allReport = [];
        // var reportsRef = fire.database().ref('reports');
        // reportsRef.on('child_added', snap => {
        //     let report = { id: snap.key, data: snap.val() }
        // // this.setState({ users: [user].concat(this.state.users) });
        // // console.log(snap.val());
        //     allReport.push(report);
        // });
        // console.log(allReport);
        this.props.addUsers(allUser);
        this.props.addReport(allReport);
        // console.log(this.props.users.users)

    }


    _handleSave(e) {
        console.log(e.target.value);
        console.log("hey wake up!");
    }

    render() {
        const props = this.props;
        const reports = props.reports.reports;
        // console.log(reports);

        return (
            <div>
                <div className="d-flex justify-content-end">
                    <h1 className="page-title"><i className="fa fa-file-text-o"></i> Report</h1>
                </div>

                <div className="card-columns">
                    <ReportCards allReport={reports} />
                </div>
                <ReportModals allReport={reports} onClick={(e) => this._handleSave(e)} />
            </div>
        );
    }
}

function ReportCards(props) {
    var reportcards = [];
    var allReport = props.allReport;

    for (let index = 0; index < allReport.length; index++) {
        let report = allReport[index];
        reportcards.push(<ReportCard key={report.id} report={report} reportNo={index + 1} target={"#" + report.id} />);
    }
    return reportcards;
}

function ReportCard(props) {
    return (
        <div className="card text-right">
            <div className="card-header">{props.report.data.title}</div>
            <div className="card-body">
                <p className="card-text">{props.report.data.detail}</p>
                <a href="#" className="btn btn-primary" data-toggle="modal" data-target={props.target}><i className="fa fa-info-circle" /> detail</a>
            </div>
        </div>
    );
}


function ReportModals(props) {
    var reportmodals = [];
    var allReport = props.allReport;
    for (let index = 0; index < allReport.length; index++) {
        let report = allReport[index];
        reportmodals.push(<ReportModal key={report.id} report={report} reportNo={index + 1} target={report.id} onClick={props.onClick} />);
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
                    <div className="modal-body">
                        <div className="col-12 row">
                            ID: {props.report.id}
                        </div>
                        <br />
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
                        {/* <button type="button"
                            value={props.report.id}
                            onClick={props.onClick}
                            className="btn btn-primary">Save changes</button> */}
                    </div>
                </div>
            </div>
        </div>
    );

}


const mapStateToProps = (state) => {
    return {
        reports: state.reportsReducer,
        users: state.usersReducer
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



export default connect(mapStateToProps, mapDispatchToProps)(Report);
