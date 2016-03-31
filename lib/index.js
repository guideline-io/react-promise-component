"use strict";

var React = require("react");

function valueFrom() {
  var args = Array.prototype.slice.call(arguments);
  var thing = args.shift();
  if(typeof thing === "function") return thing.apply(null, args);
  return thing;
}

module.exports = React.createClass({

  displayName: "PromiseComponent",

  propTypes: {
    promise: React.PropTypes.oneOfType([
      React.PropTypes.instanceOf(Promise),
      React.PropTypes.func
    ]),
    children: React.PropTypes.func.isRequired,
    loader: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.func
    ])
  },

  getInitialState: function getInitialState() {
    return {};
  },

  componentDidMount: function componentDidMount() {
    this.startPromise();
  },

  componentDidUpdate: function componentDidUpdate(prevProps) {
    this.maybeRestartPromise(prevProps);
  },

  startPromise: function startPromise() {
    var promise = valueFrom(this.props.promise);
    promise.then(

      function success(value){

        if(this.checkPromise(promise)) {
          this.setState({ success: true, value: value, error: undefined });
        }

      }.bind(this),

      function error(error){

        if(this.checkPromise(promise)) {
          this.setState({ success: false, error: error, value: undefined });
        }

      }.bind(this)

    );

    this.setState({ promise: promise });
  },

  checkPromise: function checkPromise(p) {
    return this.props.promise === p;
  },

  maybeRestartPromise: function maybeRestartPromise(prevProps) {
    var oldPromise = valueFrom(prevProps.promise);
    var newPromise = valueFrom(this.props.promise);

    if(oldPromise !== newPromise) {
      this.startPromise();
    }
  },

  render: function(){
    if(this.state.success === true) {
      return this.props.children(null, this.state.value);
    }

    if(this.state.success === false) {
      return this.props.children(this.state.error);
    }

    if(this.props.loader) {
      return valueFrom(this.props.loader, this.props);
    }

    return React.DOM.noscript();
  }

});
