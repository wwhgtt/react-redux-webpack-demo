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

  getInitialState() {
    return {
      activeNum: 0,
    };
  },

  componentWillMount() {
    const { getOrderList, getTakeOutList, getBookList, getQueueList } = this.props;
    window.addEventListener('hashchange', this.setChildViewAccordingToHash);
    window.addEventListener('load', this.setChildViewAccordingToHash);
    getOrderList(1);
    getTakeOutList(1);
    getBookList(1);
    getQueueList(1);
    if (!location.hash) {
      location.hash = '#dinner';
    }

    // if (hash === '#dinner') {
    //   getOrderList(1);
    // } else if (hash === '#quick') {
    //   getTakeOutList(1);
    // } else if (hash === '#book') {
    //   getBookList(1);
    // } else if (hash === 'queue') {
    //   getQueueList(1);
    // }
  },

  // 获得页面hash并发送action
  setChildViewAccordingToHash() {
    const { setChildView } = this.props;
    const hash = location.hash;
    setChildView(hash);

    if (hash === '#dinner') {
      this.setState({ activeNum: 0 });
    } else if (hash === '#quick') {
      this.setState({ activeNum: 1 });
    } else if (hash === '#book') {
      this.setState({ activeNum: 2 });
    } else if (hash === '#queue') {
      this.setState({ activeNum: 3 });
    }
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
    const hash = location.hash;
    if (index === 0 && hash !== '#dinner') {
      location.hash = '#dinner'; // 堂食
      setChildView('#dinner');
    } else if (index === 1 && hash !== '#quick') {
      location.hash = '#quick'; // 外卖
      setChildView('#quick');
    } else if (index === 2 && hash !== '#book') {
      location.hash = '#book';  // 预订
      setChildView('#book');
    } else if (index === 3 && hash !== '#queue') {
      location.hash = '#queue'; // 排队
      setChildView('#queue');
    }
  },

  render() {
    const { childView } = this.props;

    return (
      <div className="order-page application">
        <SwitchNavi
          navis={['堂食', '外卖', '预订', '排队']}
          getIndex={this.handleGetIndex}
          activeTab={this.state.activeNum}
        />
        <div className="order-conent">
          {this.getListSection(childView)}
        </div>
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
