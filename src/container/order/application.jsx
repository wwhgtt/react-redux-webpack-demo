const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/order/order');
require('../../asset/style/style.scss');
require('./application.scss');

const OrderApplication = React.createClass({
  displayName: 'OrderApplication',
  propTypes: {
    // MapedActionsToProps
    // MapedStatesToProps
  },
  componentDidMount() {
  },
  componentDidUpdate() {
  },
  render() {
    return (
      <div className="application">
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(OrderApplication);
