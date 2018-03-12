
import firebase from 'firebase'
var config = {
  apiKey: "AIzaSyBJsiDQapDc0jiJZuDEck7T3O_jqIiQL2Q",
  authDomain: "bero-react-console-c2d3b.firebaseapp.com",
  databaseURL: "https://bero-react-console-c2d3b.firebaseio.com",
  projectId: "bero-react-console-c2d3b",
  storageBucket: "bero-react-console-c2d3b.appspot.com",
  messagingSenderId: "761895550361"
};
var fire = firebase.initializeApp(config);
export default fire;