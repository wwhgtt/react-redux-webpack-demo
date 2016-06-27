const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/order/order');
require('../../asset/style/style.scss');
require('./application.scss');

const OrderApplication = React.createClass({
  displayName: 'OrderApplication',
  propTypes: {
    // MapedActionsToProps
    orderFetchData:React.PropTypes.func.isRequired,
    // MapedStatesToProps
  },
  componentDidMount() {
    this.props.orderFetchData();
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
