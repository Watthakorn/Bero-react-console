import React, { Component } from 'react';
import fire from '../../fire';
import '../../css/bero.css';
import { connect } from "react-redux";


class Report extends Component {

    componentWillMount() {

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

                <div className="card-columns">
                    <ReportCards allReport={reports} />
                </div>
                {/* <ReportModals allReport={reports} onSubmit={(e) => this._handleSave(e)} /> */}
            </div>
        );
    }
}

function ReportCards(props) {
    var reportcards = [];
    var allReport = props.allReport;
    allReport.sort(function (a, b) { return (b.data.status > a.data.status) ? 1 : ((a.data.status > b.data.status) ? -1 : 0); });
    if (allReport) {
        for (let index = 0; index < allReport.length; index++) {
            let report = allReport[index];
            reportcards.push(<ReportCard key={report.id} report={report} reportNo={index + 1} target={"#" + report.id} />);
        }
    }
    return reportcards;
}

function ReportCard(props) {
    return (
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



export default connect(mapStateToProps)(Report);
