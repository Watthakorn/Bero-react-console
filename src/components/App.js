import React, { Component } from 'react';
import Header from './Header';
import Middle from './Middle'
import Footer from './Footer'
// import { connect } from 'react-redux';

class App extends Component {
  render() {
    return (
      <div>
        <Header />

        <Middle />

        <Footer />
        {/* <User result={this.props.first.result} result2={this.props.second.result2} />
        <button type="button" className="btn btn-large btn-block btn-default" onClick={() => this.props.setAdd()}>button</button> */}
      </div>
    );
  }
}

export default App

// const mapStateToProps = (state) => {
//   return {
//     first: state.firstReducer,
//     second: state.secondReducer
//   }
// }
// const mapDispatchToProps = (dispatch) => {
//   return {
//     setAdd: () => {
//       dispatch({
//         type: "ADD",
//         payload: 15000
//       })
//     }
//   }
// }
// export default connect(mapStateToProps, mapDispatchToProps)(App);
