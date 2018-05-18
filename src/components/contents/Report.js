import React, { Component } from 'react';
import fire from '../../fire';
import '../../css/bero.css';
import { connect } from "react-redux";

var allReport = [];
var reportsRef = fire.database().ref('reports');
reportsRef.on('child_added', snap => {
    let report = { id: snap.key, data: snap.val() }
    allReport.push(report);
});

class Report extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pagenumber: 1,
            itemperpage: 10
        };
    }

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

    }

    _handlePagination(e) {
        e.preventDefault();
        this.setState({
            pagenumber: e.target.value,
        })
        // console.log(e.target.value)
    }

    _handleSave(e) {
        e.preventDefault();
        console.log(e.target.id);
        fire.database().ref('reports/' + e.target.id).update({
            status: "done",
        });
        // console.log("hey wake up!");
        e.target.submitBtn.disabled = "disabled";
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


// function ReportModals(props) {
//     var reportmodals = [];
//     var allReport = props.allReport;
//     if (allReport) {
//         for (let index = 0; index < allReport.length; index++) {
//             let report = allReport[index];
//             reportmodals.push(<ReportModal key={report.id} report={report} reportNo={index + 1} target={report.id} onClick={props.onClick} onSubmit={props.onSubmit} />);
//         }
//     }
//     return reportmodals;

// }
// function ReportModal(props) {
//     var target = [];
//     var owner = [];
//     if (props.report.data.target) {
//         fire.database().ref('users/' + props.report.data.target).once('value').then(function (snapshot) {
//             // var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
//             target = snapshot.val();
//             // console.log(snapshot.val())
//             console.log(target.Profile);
//         });
//     }
//     return (
//         <div className="modal fade" id={props.target} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
//             <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
//                 <div className="modal-content">
//                     <div className="modal-header">
//                         <h5 className="modal-title" id="exampleModalLongTitle">Report: {props.report.data.title}</h5>
//                         <button type="button" className="close" data-dismiss="modal" aria-label="Close">
//                             <span aria-hidden="true">&times;</span>
//                         </button>
//                     </div>
//                     <form id={props.report.id} onSubmit={props.onSubmit}>
//                         <div className="modal-body">
//                             {/* <div className="col-12 row">
//                             ID: {props.report.id}
//                         </div>
//                         <br /> */}
//                             <div className="col-12 row d-flex align-items-center">
//                                 <div className="col-6">Title: <input className="form-control" value={props.report.data.title} disabled="disabled" /></div>
//                                 <div className="col-6">Owner: <input className="form-control" value={props.report.data.owner} disabled="disabled" /></div>
//                             </div>
//                             {target.Profile ?
//                                 <div>
//                                     <br />
//                                     <div className="col-12 row d-flex align-items-center">
//                                         <div className="col-6"></div>
//                                         <div className="col-6">Target: <input className="form-control" value={target.Profile.displayName} disabled="disabled" /></div>
//                                     </div>
//                                 </div> : ''}
//                             <br />
//                             <div className="col-12 row d-flex align-items-center">
//                                 <div className="col-12">Detail: <textarea className="form-control" value={props.report.data.title} disabled="disabled" /></div>
//                             </div>
//                             <br />
//                             {/* <div className="col-12 row d-flex align-items-center">
//                             <div className="col-6">Status: {props.report.data.status}</div>
//                         </div> */}

//                         </div>
//                         <div className="modal-footer">
//                             <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
//                             {props.report.data.status === "inprogress" ?
//                                 <button type="submit"
//                                     value={props.report.id}
//                                     // onClick={props.onClick}
//                                     name="submitBtn"
//                                     className="btn btn-primary"
//                                     disabled={props.report.data.status === "inprogress" ? "" : "disabled"}>
//                                     Done</button>
//                                 : ''}

//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );

// }


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
