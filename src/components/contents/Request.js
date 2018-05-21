import React, { Component } from 'react';
import fire from '../../fire';
import '../../css/bero.css';
import { connect } from "react-redux"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Sector } from "recharts"


var allRequest = [];
var requestsRef = fire.database().ref('requests');
requestsRef.on('child_added', snap => {
    let request = { id: snap.key, data: snap.val() }
    if (request.data.requestType === 'Event') {
    } else {
        allRequest.push(request)
    }
});

var requestMustBe, requestType, requestDaily, requestWeekly, requestMonthly;
var totalRequest = 0;


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
        }
        requestDaily.reverse();
        requestWeekly.reverse();
        requestMonthly.reverse();
        this.setState({
            dataChart: requestDaily,
        })


        requestsRef.on('child_changed', snap => {
            let request = { id: snap.key, data: snap.val() }
            if (request.data.requestType === "Event") {
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



        this.props.addRequest(allRequest);

    }

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




const mapStateToProps = (state) => {

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
