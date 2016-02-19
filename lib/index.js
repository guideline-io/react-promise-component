"use strict";

var React = require("react");

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

      function(value) {
        this.verifyPromise(promise, function onPromiseVerified() {
          this.setState({ success: true, value });
        }.bind(this));
      }.bind(this),

      function(error) {
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

    if(typeof this.props.promise === "function") {
      this.setState({ promise: this.props.promise() });
    } else {
      this.setState({ promise: this.props.promise });
    }

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
      return this.props.loader;
    }

    return React.DOM.noscript();
  }

});
