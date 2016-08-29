const React = require('react');
// const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
const connect = require('react-redux').connect;
const actions = require('../../action/place-order/place-order');
// const helper = require('../../helper/place-order-helper');
// const ActiveSelect = require('../../component/mui/select/active-select.jsx');
// const TableSelect = require('../../component/order/select/table-select.jsx');
// const TimeSelect = require('../../component/order/select/time-select.jsx');
require('../../asset/style/style.scss');
require('./application.scss');

const PlaceOrderApplication = React.createClass({
  displayName:'PlaceOrderApplication',
  propTypes:{
    // MapedActionsToProps
    fetchCommercialProps:React.propTypes.func.isRequired,
    // MapedStatesToProps
    commercialProps:React.propTypes.object.isRequired,
  },
  getInitialState() {
    return {

    };
  },
  componentWillMount() {
    const { fetchCommercialProps } = this.props;
    fetchCommercialProps();
  },
  render() {
    return false;
  },
});

module.exports = connect(state => state, actions)(PlaceOrderApplication);
