import React, { Component } from 'react';
import fire from '../../fire';
import '../../css/bero.css';
// import { compose, withProps, withStateHandlers } from "recompose"
// import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps"
import { connect } from "react-redux"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Sector } from "recharts"
// import GeoFire from "geofire"


// var today = new Date();
// var todayDate = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1) + '-' + today.getDate();

// var allEvent = [];
var allRequest = [];
var requestsRef = fire.database().ref('requests');
requestsRef.on('child_added', snap => {
    let request = { id: snap.key, data: snap.val() }
    // this.setState({ users: [user].concat(this.state.users) });
    // console.log(snap.val());
    if (request.data.requestType === 'Event') {
        // allEvent.push(request);
    } else {
        allRequest.push(request)
    }
});

// var data01 = [
//     { name: 'Group A', value: 400 }, { name: 'Group B', value: 300 },
//     { name: 'Group C', value: 300 }, { name: 'Group D', value: 200 },
//     { name: 'Group E', value: 278 }, { name: 'Group F', value: 189 }
// ];

var requestMustBe, requestType, requestDaily, requestWeekly, requestMonthly;
var totalRequest = 0;
// const data = [
//     { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
//     { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
//     { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
//     { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
//     { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
//     { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
//     { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
// ];


class Request extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            mode: 1,
            pagenumber: 1,
            itemperpage: 6,
            activeIndex: 0,
            activeIndex2: 0,
            dataChart: [],
        };
    }



    componentWillMount() {
        var requestsProps = this.props.requests.requests
        // var must_be = ["Male", "Female", "all"]

        // var type = ["Mechanic", "Medic", "Language", "Computer", "Chef", "Strength", "Any"]

        totalRequest = requestsProps.length;
        var when = []
        var ftolMonth = [];
        var conMonth = [];
        var todate = new Date();
        var today = Date.parse(todate.toDateString());
        var toweek = today - (86400000 * todate.getDay());
        var tomonth = Date.parse(new Date((todate.getFullYear() + "-" + (todate.getMonth() + 1) + "-01")));
        var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]
        var dofm = [31, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30]
        var tempDay = (new Date(today)).getDay();
        var tempMonth = (new Date(today)).getMonth();
        requestMustBe = [
            { name: "Male", val: 0 },
            { name: "Female", val: 0 },
            { name: "all", val: 0 }
        ]
        requestType = [
            { name: "Mechanic", val: 0 }, { name: "Medic", val: 0 },
            { name: "Language", val: 0 }, { name: "Computer", val: 0 },
            { name: "Chef", val: 0 }, { name: "Strength", val: 0 },
            { name: "Any", val: 0 }
        ]
        requestDaily = [];
        requestWeekly = [];
        requestMonthly = [];
        // console.log(new Date((todate.getFullYear() + "-" + (todate.getMonth() + 1) + "-01")));

        requestDaily.push({ name: days[tempDay], val: 0 });
        for (let index = 0; index < 6; index++) {
            if (tempDay === 0) {
                tempDay = 6;
            } else {
                tempDay -= 1;
            }
            requestDaily.push({ name: days[tempDay], val: 0 })
        }

        requestWeekly.push({ name: "this week", val: 0 });
        for (let index = 1; index < 7; index++) {
            requestWeekly.push({ name: index + " week ago", val: 0 })
        }

        var tempDofm = dofm[tempMonth];
        requestMonthly.push({ name: months[tempMonth], val: 0, prevm: tempDofm });
        for (let index = 0; index < 11; index++) {
            if (tempMonth === 0) {
                tempMonth = 11;
            } else {
                tempMonth -= 1;
            }
            tempDofm += dofm[tempMonth];
            requestMonthly.push({ name: months[tempMonth], val: 0, prevm: tempDofm })
        }
        // console.log(new Date(tomonth - 86400000 * (requestMonthly[1].prevm)));


        for (let index = 0; index < totalRequest; index++) {
            const element = requestsProps[index];
            if (element.data.must_be === requestMustBe[0].name) {
                requestMustBe[0].val += 1;
            } else if (element.data.must_be === requestMustBe[1].name) {
                requestMustBe[1].val += 1;
            } else {
                requestMustBe[2].val += 1;
            }

            if (element.data.type === requestType[0].name) {
                requestType[0].val += 1;
            } else if (element.data.type === requestType[1].name) {
                requestType[1].val += 1;
            } else if (element.data.type === requestType[2].name) {
                requestType[2].val += 1;
            } else if (element.data.type === requestType[3].name) {
                requestType[3].val += 1;
            } else if (element.data.type === requestType[4].name) {
                requestType[4].val += 1;
            } else if (element.data.type === requestType[5].name) {
                requestType[5].val += 1;
            } else {
                requestType[6].val += 1;
            }

            if (element.data.when >= today) {
                requestDaily[0].val += 1;
            } else if (element.data.when >= today - 86400000) {
                requestDaily[1].val += 1;
            } else if (element.data.when >= today - (86400000 * 2)) {
                requestDaily[2].val += 1;
            } else if (element.data.when >= today - (86400000 * 3)) {
                requestDaily[3].val += 1;
            } else if (element.data.when >= today - (86400000 * 4)) {
                requestDaily[4].val += 1;
            } else if (element.data.when >= today - (86400000 * 5)) {
                requestDaily[5].val += 1;
            } else if (element.data.when >= today - (86400000 * 6)) {
                requestDaily[6].val += 1;
            }

            if (element.data.when >= toweek) {
                requestWeekly[0].val += 1;
            } else if (element.data.when >= toweek - (86400000 * 7)) {
                requestWeekly[1].val += 1;
            } else if (element.data.when >= toweek - (86400000 * 14)) {
                requestWeekly[2].val += 1;
            } else if (element.data.when >= toweek - (86400000 * 21)) {
                requestWeekly[3].val += 1;
            } else if (element.data.when >= toweek - (86400000 * 28)) {
                requestWeekly[4].val += 1;
            } else if (element.data.when >= toweek - (86400000 * 35)) {
                requestWeekly[5].val += 1;
            }

            if (element.data.when >= tomonth) {
                requestMonthly[0].val += 1;
            } else if (element.data.when >= tomonth - 86400000 * requestMonthly[0].prevm) {
                requestMonthly[1].val += 1;
            } else if (element.data.when >= tomonth - 86400000 * requestMonthly[1].prevm) {
                requestMonthly[2].val += 1;
            } else if (element.data.when >= tomonth - 86400000 * requestMonthly[2].prevm) {
                requestMonthly[3].val += 1;
            } else if (element.data.when >= tomonth - 86400000 * requestMonthly[3].prevm) {
                requestMonthly[4].val += 1;
            } else if (element.data.when >= tomonth - 86400000 * requestMonthly[4].prevm) {
                requestMonthly[5].val += 1;
            } else if (element.data.when >= tomonth - 86400000 * requestMonthly[5].prevm) {
                requestMonthly[6].val += 1;
            } else if (element.data.when >= tomonth - 86400000 * requestMonthly[6].prevm) {
                requestMonthly[7].val += 1;
            } else if (element.data.when >= tomonth - 86400000 * requestMonthly[7].prevm) {
                requestMonthly[8].val += 1;
            } else if (element.data.when >= tomonth - 86400000 * requestMonthly[8].prevm) {
                requestMonthly[9].val += 1;
            } else if (element.data.when >= tomonth - 86400000 * requestMonthly[9].prevm) {
                requestMonthly[10].val += 1;
            } else if (element.data.when >= tomonth - 86400000 * requestMonthly[10].prevm) {
                requestMonthly[11].val += 1;
            }


            let requestWhen = new Date(element.data.when);
            if (ftolMonth.includes((requestWhen.getMonth() + 1) + "," + requestWhen.getFullYear())) {
                conMonth[ftolMonth.indexOf((requestWhen.getMonth() + 1) + "," + requestWhen.getFullYear())] += 1
            } else {
                ftolMonth.push((requestWhen.getMonth() + 1) + "," + requestWhen.getFullYear())
                conMonth.push(1)
            }
            when.push(element.data.when)
            // console.log(new Date(element.data.when))

            // console.log((new Date(when[index]).toDateString()))
        }
        requestDaily.reverse();
        requestWeekly.reverse();
        requestMonthly.reverse();
        // console.log(todate.getDay())
        // console.log(new Date(today - 604800000 * 2))
        // console.log(new Date(today - 2629743000))
        // console.log(conMonth.reverse())
        // console.log(ftolMonth.reverse())
        // console.log(requestType[6].val)
        this.setState({
            dataChart: requestDaily,
        })


        requestsRef.on('child_changed', snap => {
            let request = { id: snap.key, data: snap.val() }
            if (request.data.requestType === "Event") {
                // for (let i in allEvent) {
                //     if (allEvent[i].id === request.id) {
                //         allEvent[i].data = request.data;
                //         break;
                //     }
                // }
                // this.props.addEvent(allEvent);
            } else {
                for (let i in allRequest) {
                    if (allRequest[i].id === request.id) {
                        allRequest[i].data = request.data;
                        break;
                    }
                }
                this.props.addRequest(allRequest);
            }
        });
        requestsRef.on('child_removed', snap => {
            let request = { id: snap.key, data: snap.val() }
            if (request.data.requestType === "Event") {
                // for (let i in allEvent) {
                //     if (allEvent[i].id === request.id) {
                //         allEvent.splice(i, 1)
                //         break;
                //     }
                // }
                // this.props.addEvent(allEvent);
            } else {
                for (let i in allRequest) {
                    if (allRequest[i].id === request.id) {
                        allRequest.splice(i, 1)
                        break;
                    }
                }
                this.props.addRequest(allRequest);
            }
        });



        // this.props.addEvent(allEvent);
        this.props.addRequest(allRequest);

        // console.log(this.props.events.events);

    }
    // _handleChangePage(e) {
    //     if (this.state.page === 1) {
    //         this.setState({
    //             page: 2,
    //         })
    //     } else {
    //         this.setState({
    //             page: 1,
    //         })
    //     }
    // }


    // _handlePagination(e) {
    //     e.preventDefault();
    //     this.setState({
    //         pagenumber: e.target.value,
    //     })
    //     // console.log(e.target.value)
    // }

    onPieEnter(data, index) {
        this.setState({
            activeIndex: index,
        })
    }
    onPieEnter2(data, index) {
        this.setState({
            activeIndex2: index,
        })
    }
    _todaily(e) {
        this.setState({
            dataChart: requestDaily,
        })
    }
    _toweekly(e) {
        this.setState({
            dataChart: requestWeekly,
        })
    }
    _tomonthly(e) {
        this.setState({
            dataChart: requestMonthly,
        })
    }
    _switchMode(e) {
        if (this.state.mode === 1) {
            this.setState({
                mode: 2,
            })
        } else {
            this.setState({
                mode: 1
            })
        }
    }

    render() {
        return (
            <div>
                <div className="d-flex justify-content-end">
                    <h1 className="page-title"><i className="fa fa-child"></i>Request</h1>
                </div>
                {/* <input type="text" value={this.state.value} onChange={this.handleChange} /> */}
                {/* {this.state.value} */}
                {/* slide */}
                {/* <Slide testvalue="Testtteetetetet" /> */}
                <div className="col-12">
                    <h4>Total {totalRequest} Requests</h4>
                    <button type="button" style={{ marginTop: "10px", marginLeft: "20px", marginBottom: "10px" }}
                        className="btn btn-outline-primary btn-sm" onClick={(e) => this._switchMode(e)}>Switch</button>
                </div>


                {this.state.mode === 1 ?
                    <div className="col-12">
                        <LineChart width={910} height={400} data={this.state.dataChart}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Legend verticalAlign="top" align="right" payload={[{ value: 'Requests ', type: "line", color: "#8884d8" }]} height={50} />
                            <Line type="monotone" dataKey="val" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                        {/* <button type="button" className="btn btn-outline-primary btn-sm">Primary</button> | <button type="button" className="btn btn-outline-primary btn-sm">Primary</button> | <button type="button" className="btn btn-outline-primary btn-sm">Primary</button> */}

                        <div className="btn-group btn-group-toggle" data-toggle="buttons">
                            <label className="btn btn-secondary" onClick={(e) => this._todaily(e)}>
                                <input type="radio" name="options" id="option1" autoComplete="off" />
                                Daily
                        </label>
                            <label className="btn btn-secondary" onClick={(e) => this._toweekly(e)}>
                                <input type="radio" name="options" id="option2" autoComplete="off" />
                                Weekly
                        </label>
                            <label className="btn btn-secondary" onClick={(e) => this._tomonthly(e)}>
                                <input type="radio" name="options" id="option3" autoComplete="off" />
                                Monthly
                        </label>
                        </div>

                    </div>
                    :
                    <div className="col-12">
                        <PieChart width={910} height={400}>
                            <Pie
                                activeIndex={this.state.activeIndex}
                                activeShape={renderActiveShape}
                                data={requestMustBe}
                                dataKey="val"
                                cx={200}
                                cy={200}
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                onMouseEnter={(data, index) => this.onPieEnter(data, index)}
                            />
                            <Pie
                                activeIndex={this.state.activeIndex2}
                                activeShape={renderActiveShape}
                                data={requestType}
                                dataKey="val"
                                cx={650}
                                cy={200}
                                innerRadius={60}
                                outerRadius={80}
                                fill="#00C49F"
                                onMouseEnter={(data, index) => this.onPieEnter2(data, index)}
                            />
                            <Legend verticalAlign="top" align="right" payload={[{ value: 'Gender ', type: "square", color: "#8884d8" },
                            { value: 'Skill ', type: "square", color: "#00C49F" }]} height={1}
                            />
                        </PieChart>
                    </div>
                }


                {/* <ul className="pagination">
                    <Page page={Math.ceil(allRequest.length / this.state.itemperpage)}
                        pagenumber={this.state.pagenumber} onClick={(e) => this._handlePagination(e)} />
                </ul> */}


                {/* <div className="row">
                    <RequestCards requests={allRequest} pagenumber={this.state.pagenumber} itemperpage={this.state.itemperpage} />
                </div>

                <RequestModals requests={allRequest} page={this.state.page}
                    pagenumber={this.state.pagenumber} itemperpage={this.state.itemperpage}
                    onPageClick={(e) => this._handleChangePage(e)} /> */}
            </div>
        );
    }
}




const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
        fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value} Requests`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                {`(Rate ${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
};


// function Page(props) {
//     var pages = [];
//     if (props.page) {
//         for (let index = 0; index < props.page; index++) {
//             pages.push(<li key={index} className="page-item"><button onClick={props.onClick} className="page-link" value={index + 1}>{index + 1}</button></li>)
//         }
//     }
//     return pages;
// }

// function RequestCards(props) {

//     var eventcards = [];
//     var allRequest = props.requests;
//     // console.log(allEvent)
//     var requestlength = allRequest.length;
//     var page = props.pagenumber;
//     var itemperpage = props.itemperpage;
//     var lastpage = Math.ceil(requestlength / itemperpage);

//     allRequest.sort(function (a, b) { return (b.data.when - a.data.when) });

//     if (allRequest) {
//         if (page >= lastpage && requestlength % itemperpage !== 0) {
//             for (let index = 0; index < requestlength % itemperpage; index++) {
//                 let request = allRequest[index + (itemperpage * (page - 1))];
//                 if (request) {
//                     eventcards.push(<RequestCard key={request.id} request={request}
//                         requestNo={index + (itemperpage * (page - 1)) + 1} target={"#" + request.id} />);
//                 }
//             }
//         } else {
//             for (let index = 0; index < itemperpage; index++) {
//                 let request = allRequest[index + (itemperpage * (page - 1))];
//                 if (request) {
//                     eventcards.push(<RequestCard key={request.id} request={request}
//                         requestNo={index + (itemperpage * (page - 1)) + 1} target={"#" + request.id} />);
//                 }
//             }
//         }
//     }
//     // for (let index = 0; index < allRequest.length; index++) {
//     //     let request = allRequest[index];
//     //     eventcards.push(<RequestCard key={request.id} request={request} requestNo={index + 1} target={"#" + request.id} />);
//     // }
//     return eventcards;
// }

// function RequestCard(props) {
//     return (
//         <div className="col-md-6 col-xl-4 event-card">
//             <div className="card text-right">
//                 <div className="bero-eventpic">
//                     <img className="card-img-top" src={props.request.data.imageUrl} alt="requestImg" />
//                 </div>
//                 <div className="card-body">
//                     <h5 className="card-title">Request: {props.requestNo}</h5>
//                     <p className="card-text topic-overflow">{props.request.data.topic}</p>
//                     {props.request.data.status === "done" ?
//                         <a href="" className="btn btn-success" data-toggle="modal" data-target={props.target}><i className="fa fa-check-square-o" /> Done</a>
//                         : <a href="" className="btn btn-warning" data-toggle="modal" data-target={props.target}><i className="fa fa-info" /> Inprogress</a>
//                     }
//                 </div>
//             </div>
//         </div>
//     );

// }

// function RequestModals(props) {
//     var requestmodals = [];

//     var allRequest = props.requests;
//     // console.log(allEvent)
//     // console.log(props.events)
//     var requestlength = allRequest.length;
//     var page = props.pagenumber;
//     var itemperpage = props.itemperpage;
//     var lastpage = Math.ceil(requestlength / itemperpage);
//     if (allRequest) {
//         if (page >= lastpage && requestlength % itemperpage !== 0) {
//             for (let index = 0; index < requestlength % itemperpage; index++) {
//                 let request = allRequest[index + (itemperpage * (page - 1))];
//                 if (request) {
//                     requestmodals.push(<RequestModal key={request.id} request={request} requestNo={index + 1}
//                         target={request.id} onClick={props.onPageClick} page={props.page} />);
//                 }
//             }
//         } else {
//             for (let index = 0; index < itemperpage; index++) {
//                 let request = allRequest[index + (itemperpage * (page - 1))];
//                 if (request) {
//                     requestmodals.push(<RequestModal key={request.id} request={request} requestNo={index + 1}
//                         target={request.id} onClick={props.onPageClick} page={props.page} />);
//                 }
//             }
//         }
//     }


//     // for (let index = 0; index < allRequest.length; index++) {
//     //     let request = allRequest[index];
//     //     requestmodals.push(<RequestModal key={request.id} request={request} requestNo={index + 1} target={request.id} onClick={props.onPageClick} page={props.page} />);
//     // }
//     return requestmodals;

// }

// function RequestModal(props) {
//     var participantView = [];
//     // var ownerView = [];
//     var helpers = props.request.data.Helpers;
//     if (props.request.data.owneruid) {
//         var ownerRef = fire.database().ref('users/' + props.request.data.owneruid);
//         ownerRef.on('value', function (snapshot) {
//             participantView.push(
//                 <div key={snapshot.key}>
//                     <div className="row">
//                         <div className="col-3">
//                             <div className="col-12">
//                                 <img alt="profilePic" src={snapshot.val().Profile.profilePicture} style={{ "height": "75px", "width": "75px" }} className="border border-primary rounded" />
//                             </div>
//                         </div>
//                         <div className="col-9 container-fluid d-flex align-content-around flex-wrap justify-content-start">
//                             <div className="col-12">
//                                 <p className="font-weight-bold" style={{ "wordWrap": "break-word" }}>{snapshot.val().Profile.displayName} (Owner)</p>
//                             </div>
//                             <div className="col-12 font-weight-light mt-auto">
//                                 {snapshot.val().Profile.facebookUid}
//                             </div>
//                         </div>
//                     </div>
//                     <hr />
//                 </div>);
//         });
//     }
//     if (helpers) {
//         var participants = Object.keys(helpers);
//         for (let index = 0; index < participants.length; index++) {
//             let participant = participants[index];
//             // console.log(participant)
//             var participantRef = fire.database().ref('users/' + participant);
//             participantRef.on('value', function (snapshot) {
//                 // owner = snapshot.val();
//                 // console.log(snapshot.key)

//                 participantView.push(
//                     <div key={snapshot.key + "" + index}>
//                         <div className="row">
//                             <div className="col-3">
//                                 <div className="col-12">
//                                     <img alt="profilePic" src={snapshot.val().Profile.profilePicture} style={{ "height": "75px", "width": "75px" }} className="border border-primary rounded" />
//                                 </div>
//                             </div>
//                             <div className="col-9 container-fluid d-flex align-content-around flex-wrap">
//                                 <div className="col-12">
//                                     <p style={{ "wordWrap": "break-word" }}>{snapshot.val().Profile.displayName}</p>
//                                 </div>
//                                 <div className="col-12 font-weight-light mt-auto">
//                                     {snapshot.val().Profile.facebookUid}
//                                 </div>
//                             </div>
//                         </div>
//                         <hr />
//                     </div>);
//             });
//         }
//     }
//     return (
//         <div className="modal fade" id={props.target} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
//             <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
//                 <div className="modal-content">
//                     <div className="modal-header">
//                         <h5 className="modal-title" id="exampleModalLongTitle">Request: {props.requestNo}</h5>
//                         <button type="button" className="close" data-dismiss="modal" aria-label="Close">
//                             <span aria-hidden="true">&times;</span>
//                         </button>
//                     </div>

//                     <div className="modal-body">
//                         {props.page === 1 ?
//                             <div>
//                                 <button type="button" onClick={props.onClick}>View Participant</button>
//                                 <hr />
//                             </div>
//                             : <button type="button" onClick={props.onClick}>View Detail</button>
//                         }
//                         <br />
//                         {props.page === 1
//                             ?
//                             <div>
//                                 <div className="form-row">
//                                     <div className="form-group col-12">
//                                         <img id="img-upload"
//                                             src={props.request.data.imageUrl}
//                                             className="mx-auto d-block"
//                                             alt="requestImg"
//                                         // style={{ maxHeight: '300px' }}
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className="form-row">
//                                     {/* <!-- Form Input --> */}
//                                     <div className="form-group col-lg-6">
//                                         {/* eventName & participant */}
//                                         <div className="form-row">
//                                             <div className="form-group col-sm-8">
//                                                 <label htmlFor="eventName">Request Name</label>
//                                                 <input type="text"
//                                                     className="form-control"
//                                                     name="eventName"
//                                                     defaultValue={props.request.data.topic}
//                                                     disabled="disabled"
//                                                 />
//                                             </div>
//                                             <div className="form-group col-sm-4">
//                                                 <label htmlFor="participant">Participant</label>
//                                                 <input type="number"
//                                                     className="form-control"
//                                                     name="participant"
//                                                     defaultValue={props.request.data.hero}
//                                                     disabled="disabled"
//                                                 />
//                                             </div>
//                                         </div>


//                                         <div className="form-group">
//                                             <label htmlFor="timeRequest">RequestTime</label>
//                                             <input type="text"
//                                                 className="form-control"
//                                                 name="participant"
//                                                 defaultValue={(new Date(props.request.data.when)).toString()}
//                                                 disabled="disabled"
//                                             />
//                                         </div>


//                                         {/* detail */}
//                                         <div className="form-group">
//                                             <label htmlFor="detail">Detail</label>
//                                             <textarea className="form-control"
//                                                 name="detail"
//                                                 defaultValue={props.request.data.detail}
//                                                 style={{ minHeight: '275px' }}
//                                                 disabled="disabled"
//                                             />
//                                         </div>


//                                     </div>


//                                     <div className="form-group col-lg-6">
//                                         <div className="form-group">
//                                             <label htmlFor="mapEvent">Position</label>
//                                             <MyMapComponent3 information={props.request} />
//                                         </div>
//                                         <div className="form-group">
//                                             <label htmlFor="location">Location</label>
//                                             <textarea className="form-control"
//                                                 name="location"
//                                                 defaultValue={props.request.data.location}
//                                                 style={{ minHeight: '100px' }}
//                                                 disabled="disabled"
//                                             />
//                                         </div>
//                                     </div>

//                                 </div>
//                             </div>
//                             : <div>
//                                 <hr /> {participantView}
//                             </div>
//                         }

//                     </div>


//                     <div className="modal-footer">
//                         <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );

// }



// function testA() {
//     console.log("This form testA");
// }



// const MyMapComponent3 = compose(
//     withProps({
//         googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyCTYHNPsOIlGpD30J91XzKH-NDzqpUA71M&v=3.exp&libraries=geometry,drawing,places",
//         loadingElement: <div style={{ height: `100%` }} />,
//         containerElement: <div style={{ height: `300px` }} />,
//         mapElement: <div style={{ height: `100%`, width: '100%' }} />,
//     }),
//     withStateHandlers(() => ({
//         isOpen: true,
//     }), {
//             onToggleOpen: ({ isOpen }) => () => ({
//                 isOpen: !isOpen,
//             })
//         }),
//     withScriptjs,
//     withGoogleMap
// )((props) =>
//     <GoogleMap
//         defaultZoom={10}
//         defaultCenter={{ lat: props.information.data.mark_position.latitude, lng: props.information.data.mark_position.longitude }}
//     >
//         <Marker
//             position={{ lat: props.information.data.mark_position.latitude, lng: props.information.data.mark_position.longitude }}
//             onClick={props.onToggleOpen}
//         >
//             {props.isOpen && <InfoWindow onCloseClick={props.onToggleOpen}>
//                 <div style={{ maxWidth: "175px" }}>
//                     <div className="font-weight-bold">
//                         {props.information.data.topic}
//                     </div>
//                     <div>
//                         {props.information.data.location}
//                     </div>
//                 </div>
//             </InfoWindow>}
//         </Marker>

//     </GoogleMap>
// )


const mapStateToProps = (state) => {

    // console.log(state)
    return {
        markerPosition: state.positionReducer,
        events: state.eventsReducer,
        requests: state.requestsReducer,
        reports: state.reportsReducer,
        users: state.usersReducer,
        user: state.userReducer
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        changePosition: (position) => {
            dispatch({
                type: "CHANGE_LOCATION",
                payload: position
            })
        },
        addEvent: (events) => {
            dispatch({
                type: "EVENTS_FETCH",
                payload: events
            })
        },
        addRequest: (requests) => {
            dispatch({
                type: "REQUESTS_FETCH",
                payload: requests
            })
        }
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(Request);









