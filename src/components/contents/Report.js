import React, { Component } from 'react';
import fire from '../../fire';
import '../../css/bero.css';
import { connect } from "react-redux";


class Report extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pagenumber: 1,
            itemperpage: 10
        };
    }

    componentWillMount() {


    }

    _handlePagination(e) {
        e.preventDefault();
        this.setState({
            pagenumber: e.target.value,
        })
    }

    _handleSave(e) {
        e.preventDefault();
        console.log(e.target.id);
        fire.database().ref('reports/' + e.target.id).update({
            status: "done",
        });
        e.target.submitBtn.disabled = "disabled";
    }

    render() {
        const props = this.props;
        const reports = props.reports.reports;

        return (
            <div>
                <div className="d-flex justify-content-end">
                    <h1 className="page-title"><i className="fa fa-file-text-o"></i> Report</h1>
                </div>
                <ul className="pagination">
                    <Page page={Math.ceil(reports.length / this.state.itemperpage)} pagenumber={this.state.pagenumber} onClick={(e) => this._handlePagination(e)} />
                </ul>

                <div className="table-responsive">
                    <table className="table table-striped table-sm">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Date</th>
                                <th>Title</th>
                                <th>Sender</th>
                                <th>More</th>
                            </tr>
                        </thead>
                        <tbody>
                            <ReportRows allReport={reports} pagenumber={this.state.pagenumber} itemperpage={this.state.itemperpage} />
                        </tbody>
                    </table>
                </div>

                {0 ? <div className="card-deck">
                    <ReportCards allReport={reports} pagenumber={this.state.pagenumber} itemperpage={this.state.itemperpage} />
                </div>
                    : ''}

                {/* <ReportModals allReport={reports} onSubmit={(e) => this._handleSave(e)} /> */}
            </div>
        );
    }
}

function Page(props) {
    var pages = [];
    if (props.page) {
        for (let index = 0; index < props.page; index++) {
            pages.push(<li key={index} className="page-item"><button onClick={props.onClick}
                className="page-link" value={index + 1}>{index + 1}</button></li>)
        }
    }

    return pages;
}

function ReportRows(props) {
    var reportrows = [];
    var allReport = props.allReport;
    var itemperpage = props.itemperpage;
    var reportlength = allReport.length;
    var page = props.pagenumber;
    var lastpage = Math.ceil(reportlength / itemperpage);

    allReport.sort(function (a, b) { return (b.data.when > a.data.when) ? 1 : ((a.data.when > b.data.when) ? -1 : 0); });
    allReport.sort(function (a, b) { return (b.data.status > a.data.status) ? 1 : ((a.data.status > b.data.status) ? -1 : 0); });

    if (allReport) {
        if (page >= lastpage && reportlength % itemperpage !== 0) {
            for (let index = 0; index < reportlength % itemperpage; index++) {
                let report = allReport[index + (itemperpage * (page - 1))];
                reportrows.push(<ReportRow key={report.id} report={report} reportNo={index + (itemperpage * (page - 1)) + 1} target={"#" + report.id} />);
            }
        } else {
            for (let index = 0; index < itemperpage; index++) {
                let report = allReport[index + (itemperpage * (page - 1))];
                reportrows.push(<ReportRow key={report.id} report={report} reportNo={index + (itemperpage * (page - 1)) + 1} target={"#" + report.id} />);
            }
        }
    }

    return reportrows;

}
function ReportRow(props) {
    var owner = [];
    var reportDate = new Date(props.report.data.when);
    if (props.report.data.owner) {
        var ownerRef = fire.database().ref('users/' + props.report.data.owner);
        ownerRef.on('value', function (snapshot) {
            owner = snapshot.val();
        });
    }
    return (
        <tr>
            <td>{props.reportNo}</td>
            <td>{reportDate.toDateString() + " " + reportDate.toLocaleTimeString()}</td>
            <td>{props.report.data.title}</td>
            <td>{owner.Profile.displayName}</td>
            <td>
                {props.report.data.status === "done" ?
                    <a href="" className="btn btn-success" data-toggle="modal" data-target={props.target}><i className="fa fa-check-square-o" /> Done</a>
                    : <a href="" className="btn btn-warning" data-toggle="modal" data-target={props.target}><i className="fa fa-info" /> Inprogress</a>
                }
            </td>
        </tr>
    );
}











function ReportCards(props) {
    var reportcards = [];
    var allReport = props.allReport;
    var itemperpage = props.itemperpage;
    var reportlength = allReport.length;
    var page = props.pagenumber;
    var lastpage = Math.ceil(reportlength / itemperpage);
    console.log(itemperpage)


    if (allReport) {
        if (page >= lastpage && reportlength % itemperpage !== 0) {
            for (let index = 0; index < reportlength % itemperpage; index++) {
                let report = allReport[index + (itemperpage * (page - 1))];
                reportcards.push(<ReportCard key={report.id} report={report} reportNo={index + (itemperpage * (page - 1)) + 1} target={"#" + report.id} />);
            }
        } else {
            for (let index = 0; index < itemperpage; index++) {
                let report = allReport[index + (itemperpage * (page - 1))];
                reportcards.push(<ReportCard key={report.id} report={report} reportNo={index + (itemperpage * (page - 1)) + 1} target={"#" + report.id} />);
            }
        }
    }
    return reportcards;
}

function ReportCard(props) {
    return (
        <div className="col-sm-4">
            <div className="card text-right">
                <div className={props.report.data.status === "done" ? "card-header bg-success text-white topic-overflow" : "card-header bg-warning topic-overflow"}>
                    <i className={props.report.data.status === "done" ? "fa fa-envelope-open" : "fa fa-envelope-o"} /> {props.report.data.title}
                </div>
                <div className="card-body">
                    <p className="card-text bero-report-detail">{props.report.data.detail}</p>
                    {props.report.data.status === "done" ?
                        <a href="" className="btn btn-success" data-toggle="modal" data-target={props.target}><i className="fa fa-check-square-o" /> Done</a>
                        : <a href="" className="btn btn-warning" data-toggle="modal" data-target={props.target}><i className="fa fa-info" /> Inprogress</a>
                    }
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