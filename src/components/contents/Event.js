import React, { Component } from 'react';
import '../../css/bero.css';

class Event extends Component {
    render() {
        return (
            <div>
                <div className="d-flex justify-content-end">
                    <div className="pt-2">
                        <button className="btn btn-info rounded-circle text-center font-weight-bold" data-toggle="modal" data-target="#createEventModal">+</button>
                    </div>
                    . .
                    <h1 className="page-title"><i className="fa fa-gears"></i> Manage</h1>
                </div>
                <div w3-include-html="event.html"></div>
            </div>
        );
    }
}


export default Event;
