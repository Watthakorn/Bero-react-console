import React, { Component } from 'react';
import fire from '../../fire';
import '../../css/bero.css';
import { compose, withProps, lifecycle, withStateHandlers } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps"
import { connect } from "react-redux"


// var allInfo = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

var positionFirst = {
    lat: 13.719349,
    lng: 100.781223
};
var allInfo = [];
var infoRef = fire.database().ref('informations');
infoRef.on('child_added', snap => {
    let info = { id: snap.key, data: snap.val() }
    // this.setState({ users: [user].concat(this.state.users) });
    // console.log(snap.val());
    allInfo.push(info);
});

class Information extends Component {

    constructor(props) {
        super(props);
        this.state = {
            infoName: '',
            infoType: '',
            detail: '',
            contact: '',
            progressBar: '',
            disabled: false,
            showCreate: true
        };
    }

    componentWillMount() {
        // var allInfo = [];
        // var infoRef = fire.database().ref('informations');
        // infoRef.on('child_added', snap => {
        //     let info = { id: snap.key, data: snap.val() }
        //     // this.setState({ users: [user].concat(this.state.users) });
        //     // console.log(snap.val());
        //     allInfo.push(info);
        // });

        this.props.addInformations(allInfo);
        // console.log(this.props);
    }


    _handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
        // console.log((new Date('2018-02-01')).getDate())
        // console.log(this.state.startDate)
        // console.log(this.state[name]);
        // console.log(this.props);
    }




    _handleSubmit(e) {
        e.preventDefault();
        // console.log(e.target);


        // TODO: do something with -> this.state.file
        var state = this.state;
        var props = this.props;
        var markerPosition = props.markerPosition;
        var databaseRef = fire.database().ref('informations');

        // console.log(downloadURL);
        // console.log(markerPosition);



        //database push HERE
        databaseRef.push({
            title: state.infoName,
            type: state.infoType,
            mark_position: {
                latitude: markerPosition.lat,
                longitude: markerPosition.lng
            },
            detail: state.detail,
            contact: state.contact,

        })


        this.setState({
            progressBar: "100%"
        });

        this.setState({
            disabled: true
        })

        this.setState({
            showCreate: false
        })



        // console.log(markerPosition);
        // console.log('handle uploading-', state.file);
        // console.log(state);


    }

    _handleOnClear(e) {
        e.preventDefault();

        this.setState({
            infoName: '',
            infoType: '',
            detail: '',
            contact: '',
            progressBar: '',
            disabled: false,
            showCreate: true
        })

    }




    render() {

        const props = this.props;
        const allInfo = props.informations.informations;
        // console.log(allInfo);

        return (
            <div>
                <div className="d-flex justify-content-end">
                    <h1 className="page-title"><i className="fa fa-building-o"></i> Information</h1>
                </div>
                <div className="row">
                    <div className="col-12 col-xl-6">
                        <InformationsMap isMarkerShown />
                    </div>
                    <div className="col-12 col-xl-6">
                        <div className="row">
                            <div className="col-8">
                                <h2>Infomation table</h2>
                            </div>
                            <div className="col-4">
                                <div className="d-flex justify-content-end">
                                    <a href="#" className="btn btn-primary" data-toggle="modal" data-target="#createInfoModal"><i className="fa fa-plus-square"></i> create</a>
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-striped table-sm">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>More</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <InfoRows informations={allInfo} />
                                </tbody>
                            </table>
                        </div>

                        <InfoModals informations={allInfo} />

                        <div className="modal fade" id="createInfoModal" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLongTitle">Create Infomation</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>



                                    {/* <!-- Form --> */}
                                    <form onSubmit={(e) => this._handleSubmit(e)} >
                                        <div className="modal-body">
                                            <div className="form-row">
                                                {/* <!-- Form Input --> */}
                                                <div className="form-group col-lg-6">
                                                    {/* eventName & paticipant */}
                                                    <div className="form-row">
                                                        <div className="form-group col-sm-6">
                                                            <label htmlFor="infoName">Information Name</label>
                                                            <input type="text"
                                                                className="form-control"
                                                                name="infoName"
                                                                value={this.state.infoName}
                                                                onChange={(e) => this._handleInputChange(e)}
                                                                disabled={(this.state.disabled) ? "disabled" : ""}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="form-group col-sm-6">
                                                            <label htmlFor="infoType">Type</label>
                                                            <select className="form-control"
                                                                name="infoType"
                                                                value={this.state.infoType}
                                                                onChange={(e) => this._handleInputChange(e)}
                                                                disabled={(this.state.disabled) ? "disabled" : ""}
                                                                required
                                                            >
                                                                <option value="" defaultValue disabled>Choose here</option>
                                                                <option>Police_Station</option>
                                                                <option>Hospital</option>
                                                                <option>Fire_Station</option>
                                                                <option>Etc.</option>
                                                            </select>
                                                        </div>
                                                    </div>





                                                    <div className="form-group">
                                                        <label htmlFor="contact">Contact</label>
                                                        <textarea className="form-control"
                                                            name="contact"
                                                            value={this.state.contact}
                                                            onChange={(e) => this._handleInputChange(e)}
                                                            disabled={(this.state.disabled) ? "disabled" : ""}
                                                            required
                                                        />
                                                    </div>



                                                    {/* detail */}
                                                    <div className="form-group">
                                                        <label htmlFor="detail">Detail</label>
                                                        <textarea className="form-control"
                                                            name="detail"
                                                            value={this.state.detail}
                                                            onChange={(e) => this._handleInputChange(e)}
                                                            disabled={(this.state.disabled) ? "disabled" : ""}
                                                            required
                                                        />
                                                    </div>
                                                </div>


                                                {/* <!-- Form map --> */}
                                                <div className="form-group col-lg-6">
                                                    <label htmlFor="mapEvent">Position</label>
                                                    <SelectPositionMap isMarkerShown mapProps={this.props} />
                                                </div>


                                                {/* progress bar */}
                                                <div className="progress col-12">
                                                    <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: this.state.progressBar }} />
                                                </div>
                                            </div>
                                        </div>


                                        {/* footer button */}
                                        {this.state.showCreate ?
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                                <button type="submit" className="btn btn-primary"> Create</button>
                                            </div>
                                            :
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-primary" onClick={(e) => this._handleOnClear(e)}> Clear</button>
                                                <button type="button" className="btn btn-success" data-dismiss="modal"> Done</button>
                                            </div>}
                                    </form>
                                    {/* <!-- End Form Event --> */}

                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        );
    }
}

function InfoRows(props) {
    var inforows = [];
    var allInfo = props.informations;

    for (let index = 0; index < allInfo.length; index++) {
        let info = allInfo[index];
        // console.log(info.id)
        inforows.push(<InfoRow key={info.id} infoNo={index + 1} info={info} target={"#" + info.id} />);
    }
    return inforows;

}
function InfoRow(props) {
    return (
        <tr>
            <td>{props.infoNo}</td>
            <td>{props.info.data.title}</td>
            <td>{props.info.data.type}</td>
            <td><a href="#" className="btn btn-primary" data-toggle="modal" data-target={props.target}><i className="fa fa-info-circle"></i> detail</a></td>
        </tr>
    );

}

function InfoModals(props) {
    var infomodals = [];
    var allInfo = props.informations;

    for (let index = 0; index < allInfo.length; index++) {
        let info = allInfo[index];
        infomodals.push(<InfoModal key={info.id} infoNo={index + 1} info={info} target={info.id} />);
    }
    return infomodals;

}
function InfoModal(props) {
    return (
        <div className="modal fade" id={props.target} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">Information: {props.infoNo}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">

                        <div className="modal-body">
                            <div className="col-12 row">
                                ID: {props.info.id}
                            </div>
                            <br />
                            <div className="col-12 row d-flex align-items-center">
                                <div className="col-6">Name: {props.info.data.title}</div>
                                <div className="col-6">Type: {props.info.data.type}</div>
                            </div>
                            <br />
                            <div className="col-12 row d-flex align-items-center">
                                <div className="col-6">Contact: {props.info.data.contact}</div>
                                <div className="col-6">Detail: {props.info.data.detail}</div>
                            </div>

                            <br />
                            <div className="col-12 row d-flex align-items-center">

                                <div className="col-6">Positions: {props.info.data.mark_position.latitude},
                                {props.info.data.mark_position.longitude} </div>

                                <div className="col-6">
                                    <button type="button" className="btn btn-primary">Go</button>
                                </div>
                            </div>


                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        {/* <button type="button" className="btn btn-primary">Save changes</button> */}
                    </div>
                </div>
            </div>
        </div>
    );

}



const SelectPositionMap = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyCTYHNPsOIlGpD30J91XzKH-NDzqpUA71M&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `300px` }} />,
        mapElement: <div style={{ height: `100%`, width: '100%' }} />,
    }),
    lifecycle({
        componentWillMount() {
            const refs = {}

            this.setState({
                position: null,
                onMarkerMounted: ref => {
                    refs.marker = ref;
                },

                onPositionChanged: () => {
                    const position = refs.marker.getPosition();
                    // console.log(position.toString());
                    positionFirst = {
                        lat: position.lat(),
                        lng: position.lng()
                    }

                    this.props.mapProps.changePosition(positionFirst);


                    // console.log(this.props.mapProps.markerPosition);
                    // console.log(positionFirst);
                }
            })

        },
    }),
    withScriptjs,
    withGoogleMap
)((props) =>
    <GoogleMap
        defaultZoom={8}
        defaultCenter={positionFirst}
    >
        {props.isMarkerShown &&
            <Marker position={positionFirst}
                draggable={true}
                ref={props.onMarkerMounted}
                onDragEnd={props.onPositionChanged}
            />}
    </GoogleMap>
)




const InformationsMap = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyCTYHNPsOIlGpD30J91XzKH-NDzqpUA71M&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `450px` }} />,
        mapElement: <div style={{ height: `100%`, width: '100%' }} />,
    }),
    withStateHandlers(() => ({
        isOpen: true,
    }), {
            onToggleOpen: ({ isOpen }) => () => ({
                isOpen: !isOpen,
            })
        }),
    withScriptjs,
    withGoogleMap
)((props) =>
    <GoogleMap
        defaultZoom={8}
        defaultCenter={positionFirst}
    >
        <Marker
            position={positionFirst}
            onClick={props.onToggleOpen}
        >
            {props.isOpen && <InfoWindow onCloseClick={props.onToggleOpen}>
                <div>
                    This is test info
                </div>
            </InfoWindow>}
        </Marker>

    </GoogleMap>
)













const mapStateToProps = (state) => {

    // console.log(state)
    return {
        markerPosition: state.positionReducer,
        informations: state.informationsReducer
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

        addInformations: (informations) => {
            if (informations) {
                dispatch({
                    type: "INFORMATIONS_FETCH",
                    payload: informations
                })
            }
        }
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(Information);
