import React, { Component } from 'react';
import fire from '../../fire';
import '../../css/bero.css';
import { compose, withProps, lifecycle } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import { connect } from "react-redux"


var positionFirst = {
    lat: 13.719349,
    lng: 100.781223
};
const MyMapComponent = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyCTYHNPsOIlGpD30J91XzKH-NDzqpUA71M&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `400px` }} />,
        mapElement: <div style={{ height: `100%`, width: '500px' }} />,
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



class FirstPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            users: []
        }; // <- set up react state
    }


    componentWillMount() {
        /* Create reference to messages in Firebase Database */
        let messagesRef = fire.database().ref('messages').orderByKey().limitToLast(100);
        messagesRef.on('child_added', snapshot => {
            /* Update React state when message is added at Firebase Database */
            let message = { text: snapshot.val(), id: snapshot.key };
            this.setState({ messages: [message].concat(this.state.messages) });
        });

        var usersRef = fire.database().ref('users');

        usersRef.on('child_added', snap => {
            let user = { id: snap.key, data: snap.val() }
            this.setState({ users: [user].concat(this.state.users) });
            // console.log(snap.val());
        });
        this.props.changePosition(positionFirst);
        // console.log(this.props)
    }
    addMessage(e) {
        e.preventDefault(); // <- prevent form submit from reloading the page
        /* Send the message to Firebase */
        console.log(this.inputEl)
        fire.database().ref('messages').push(this.inputEl.value);
        this.inputEl.value = ''; // <- clear the input
    }

    writeUserData(e) {
        fire.database().ref('messages').push({
            username: this.inputName.value,
            email: this.inputEmail.value
        });
    }

    render() {
        return (
            <div>
                {/* <form onSubmit={this.writeUserData.bind(this)}>
                    <input type="text" ref={el => this.inputName = el} />
                    <input type="text" ref={email => this.inputEmail = email} />
                    <input type="submit" />
                </form>
                {JSON.stringify(this.props.markerPosition)}
                <MyMapComponent isMarkerShown mapProps={this.props} /> */}




                {/* <MyMapComponent isMarkerShown />// Map with a Marker
                <MyMapComponent isMarkerShown={false} />// Just only Map */}



                {/* <ul>
                    { 
                        this.state.messages.map(message => <li key={message.id}>{message.id} {JSON.stringify(message.text)}</li>)
                    }
                </ul>

                <ul>
                    {
                        this.state.users.map(user => <li key={user.id}>{user.id}<br /> {JSON.stringify(user.data)}</li>)
                    }
                </ul>
                <TestAdd testsend={this.state.users} /> */}


            </div>
        );
    }
}

function TestAdd(params) {
    var user = params.testsend;
    var users = [];
    for (let index = 0; index < user.length; index++) {
        users.push(<h1 key={user[index].id}>Test {user[index].data.Profile.displayName}</h1>)

    }
    return users;

}

const mapStateToProps = (state) => {

    // console.log(state)
    return {
        markerPosition: state.positionReducer
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        changePosition: (position) => {
            dispatch({
                type: "CHANGE_LOCATION",
                payload: position
            })
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(FirstPage);
