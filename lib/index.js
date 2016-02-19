"use strict";

var React = require("react");

function valueFrom(thing) {
  if(typeof thing === "function") return thing();
  return thing;
}

module.exports = React.createClass({

  displayName: "PromiseComponent",

  propTypes: {
    promise: PropTypes.oneOfType([ PropTypes.object, PropTypes.func ]),
    children: PropTypes.func.isRequired,
    loader: PropTypes.object
  },

  componentDidMount: function componentDidMount() {
    this.startPromise();
  },

  componentDidUpdate: function componentDidUpdate(prevProps) {
    if(this.props.promise !== prevProps.promise) this.startPromise();
  },

  startPromise: function startPromise() {
    var promise = this.promise();
    promise.then(

      function onSuccess(value) {

        this.verifyPromise(promise, function onPromiseVerified() {
          this.setState({ success: true, value });
        }.bind(this));

      }.bind(this),

      function onFailure(error) {

        this.verifyPromise(promise, function onPromiseVerified() {
          this.setState({ success: false, error });
        }.bind(this));

      }.bind(this)

    );
  },

  verifyPromise: function verifyPromise(p, cb) {
    if(p === this.promise()) cb();
  },

  promise: function promise() {
    if(this.state.promise) return this.state.promise;

    this.setState({ promise: valueFrom(this.props.promise) });

    return this.state.promise;
  },

  render: function render(){
    if(this.state.success === true) {
      return this.props.children(null, this.state.value);
    }

    if(this.state.success === false) {
      return this.props.children(this.state.error);
    }

    if(this.props.loader) {
      return valueFrom(this.props.loader);
    }

    return React.DOM.noscript();
  }

});
