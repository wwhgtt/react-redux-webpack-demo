const React = require('react');
const orderListAction = require('../../action/order-detail/order-list.js');
const connect = require('react-redux').connect;

const OrderListApplication = React.createClass({
  displayName: 'OrderListApplication',
  propTypes: {

  },

  render() {
    return (
      <div>fasdf</div>
    );
  },
});

const mapStateToProps = function (state) {
  return ({
    orderList: state.orderList,
  });
};

module.exports = connect(mapStateToProps, orderListAction)(OrderListApplication);
