const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/order-inLine/order-inLine.js');
require('../../asset/style/style.scss');
require('./application.scss');

const OrderInlineApplication = React.createClass({
  displayName: 'OrderInlineApplication',
  propTypes: {
    // MapedActionsToProps
    fetchOrderInLineProps:React.PropTypes.func.isRequired,
    // MapedStatesToProps
    commercialProps:React.PropTypes.object.isRequired,
    customerProps:React.PropTypes.object.isRequired,
    queueList:React.PropTypes.any.isRequired,
  },
  componentDidMount() {
    const { fetchOrderInLineProps } = this.props;
    fetchOrderInLineProps();
  },
  render() {
    // const { commercialProps, customerProps, queueList } = this.props; // state
    // const {} = this.props;// actions
    return (
      <div className="application">
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(OrderInlineApplication);
