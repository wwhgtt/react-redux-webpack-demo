const React = require('react');
const orderListAction = require('../../action/order-list/order-list.js');
const connect = require('react-redux').connect;

require('../../asset/style/style.scss');

const SwitchNavi = require('../../component/mui/switch-navi.jsx');
const OrderDinner = require('../../component/order-list/order-dinner.jsx');
const OrderBook = require('../../component/order-list/order-book.jsx');
const OrderQueue = require('../../component/order-list/order-queue.jsx');

require('./application.scss');

const OrderListApplication = React.createClass({
  displayName: 'OrderListApplication',
  propTypes: {
    getOrderList: React.PropTypes.func,
    setChildView: React.PropTypes.func,
    getTakeOutList: React.PropTypes.func,
    getBookList: React.PropTypes.func,
    getQueueList: React.PropTypes.func,

    childView: React.PropTypes.string,
    orderList: React.PropTypes.array,
    takeOutList: React.PropTypes.array,
    bookList: React.PropTypes.array,
    queueList: React.PropTypes.array,
  },

  componentWillMount() {
    const { getOrderList, getTakeOutList, getBookList, getQueueList } = this.props;
    window.addEventListener('hashchange', this.setChildViewAccordingToHash);
    window.addEventListener('load', this.setChildViewAccordingToHash);
    getOrderList(1);
    getTakeOutList(1);
    getBookList(1);
    getQueueList(1);
  },

  // 获得页面hash并发送action
  setChildViewAccordingToHash() {
    const { setChildView } = this.props;
    const hash = location.hash;
    setChildView(hash);
  },

  // 堂食、外卖订单列表
  getOrderDinner(orderList, orderType) {
    return orderList && orderList.map((item, index) =>
      <OrderDinner orderList={item} key={index} orderType={orderType} />
    );
  },

  // 预订订单列表
  getOrderBook() {
    const { bookList } = this.props;
    return bookList && bookList.map((item, index) =>
      <OrderBook bookList={item} key={index} />
    );
  },

  // 排队订单列表
  getOrderQueue() {
    const { queueList } = this.props;
    return queueList && queueList.map((item, index) =>
      <OrderQueue queueList={item} key={index} />
    );
  },

  // 列表展示
  getListSection(childView) {
    const { orderList, takeOutList } = this.props;
    let listSection = '';
    if (childView === '#dinner') {
      listSection = this.getOrderDinner(orderList, 'TS');
    } else if (childView === '#quick') {
      listSection = this.getOrderDinner(takeOutList, 'WM');
    } else if (childView === '#book') {
      listSection = this.getOrderBook();
    } else if (childView === '#queue') {
      listSection = this.getOrderQueue();
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
      location.hash = '#quick'; // 外卖
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
        <SwitchNavi navis={['堂食', '外卖', '预订', '排队']} getIndex={this.handleGetIndex} />
        {this.getListSection(childView)}
      </div>
    );
  },
});

const mapStateToProps = function (state) {
  return ({
    orderList: state.orderList,
    childView: state.childView,
    takeOutList: state.takeOutList,
    bookList: state.bookList,
    queueList: state.queueList,
  });
};

module.exports = connect(mapStateToProps, orderListAction)(OrderListApplication);
