const React = require('react');
const orderListAction = require('../../action/order-list/order-list.js');
const connect = require('react-redux').connect;

require('../../asset/style/style.scss');

const SwitchNavi = require('../../component/mui/switch-navi.jsx');
const OrderDinner = require('../../component/order-list/order-dinner.jsx');

require('./application.scss');

const OrderListApplication = React.createClass({
  displayName: 'OrderListApplication',
  propTypes: {
    getOrderList: React.PropTypes.func,
    orderList: React.PropTypes.array,
    setChildView: React.PropTypes.func,
    childView: React.PropTypes.string,
  },

  componentWillMount() {
    const { getOrderList } = this.props;
    window.addEventListener('hashchange', this.setChildViewAccordingToHash);
    window.addEventListener('load', this.setChildViewAccordingToHash);
    getOrderList(1);
  },

  // 获得页面hash并发送action
  setChildViewAccordingToHash() {
    const { setChildView } = this.props;
    const hash = location.hash;
    setChildView(hash);
  },

  // 堂食、外卖订单列表
  getOrderDinner(orderList) {
    return orderList && orderList.map((item, index) =>
      <OrderDinner orderList={item} key={index} />
    );
  },

  // 列表展示
  getListSection(childView) {
    const { orderList } = this.props;
    let listSection = '';
    if (childView === '#dinner') {
      listSection = this.getOrderDinner(orderList);
    } else if (childView === '#quick') {
      listSection = this.getOrderDinner(orderList);
    } else if (childView === '#book') {
      listSection = '预订';
    } else if (childView === '#queue') {
      listSection = '排队';
    }

    return listSection;
  },

  // tabs切换
  handleGetIndex(index) {
    const { setChildView } = this.props;
    if (index === 0) {
      location.hash = '#dinner'; // 堂食
      setChildView('#dinner');
    } else if (index === 1) {
      location.hash = '#quick'; // 快餐
      setChildView('#quick');
    } else if (index === 2) {
      location.hash = '#book';  // 预订
      setChildView('#book');
    } else if (index === 3) {
      location.hash = '#queue'; // 排队
      setChildView('#queue');
    }
  },

  render() {
    const { childView } = this.props;

    return (
      <div className="order-page application">
        <SwitchNavi navis={['堂食', '快餐', '预订', '排队']} getIndex={this.handleGetIndex} />
        {this.getListSection(childView)}
      </div>
    );
  },
});

const mapStateToProps = function (state) {
  return ({
    orderList: state.orderList,
    childView: state.childView,
  });
};

module.exports = connect(mapStateToProps, orderListAction)(OrderListApplication);
