const React = require('react');
const orderListAction = require('../../action/order-list/order-list.js');
const connect = require('react-redux').connect;
const IScroll = require('iscroll/build/iscroll-probe');
const classnames = require('classnames');

require('../../asset/style/style.scss');
require('../../component/mine/common.scss');

const Load = require('../../component/mui/loading.jsx');
const Toast = require('../../component/mui/toast.jsx');
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
    setErrorMsg: React.PropTypes.func,

    childView: React.PropTypes.string,
    orderList: React.PropTypes.object,
    takeOutList: React.PropTypes.array,
    bookList: React.PropTypes.array,
    queueList: React.PropTypes.array,
    loadStatus: React.PropTypes.bool,
    errorMessage: React.PropTypes.string,
  },

  getInitialState() {
    return {
      activeItem: '',
      showSection: '',
      dinnerListArr: [],
      takeOutListArr: [],
      bookListArr: [],
      queueListArr: [],
    };
  },

  componentWillMount() {
    const { getOrderList } = this.props;

    window.addEventListener('hashchange', this.setChildViewAccordingToHash);
    window.addEventListener('load', this.setChildViewAccordingToHash);
    getOrderList(1);
    // getTakeOutList(1);
    // getBookList(1);
    // getQueueList(1);
  },

  componentDidMount() {
    const options = {
      mouseWheel: true,
      click: true,
      // probeType: 3,
      // bounce: true,
    };
    const wapper = document.getElementById('myScroll');
    this.myScroll = new IScroll(wapper, options);
    this.myScroll.on('scrollEnd', this.onScrollEnd);
  },

  componentWillReceiveProps(nextProps) {
    const { orderList, takeOutList, bookList, queueList } = nextProps;
    const { dinnerListArr, takeOutListArr, bookListArr, queueListArr } = this.state;

    if (JSON.stringify(this.props.orderList.list) !== JSON.stringify(orderList.list)) {
      this.setState({ dinnerListArr: this.mergeList(dinnerListArr, orderList.list) });
    } else {
      if (dinnerListArr && dinnerListArr.length === 0) {
        this.setState({ dinnerListArr: orderList.list });
      }
    }
    if (JSON.stringify(this.props.takeOutList) !== JSON.stringify(takeOutList)) {
      this.setState({ takeOutListArr: this.mergeList(takeOutListArr, takeOutList) });
    } else {
      if (takeOutListArr && takeOutListArr.length === 0) {
        this.setState({ takeOutListArr: takeOutList });
      }
    }
    if (JSON.stringify(this.props.bookList) !== JSON.stringify(bookList)) {
      this.setState({ bookListArr: this.mergeList(bookListArr, bookList) });
    } else {
      if (bookListArr && bookListArr.length === 0) {
        this.setState({ bookListArr: bookList });
      }
    }
    if (JSON.stringify(this.props.queueList) !== JSON.stringify(queueList)) {
      this.setState({ queueListArr: this.mergeList(queueListArr, queueList) });
    } else {
      if (queueListArr && queueListArr.length === 0) {
        this.setState({ queueListArr: queueList });
      }
    }
  },

  componentDidUpdate(prevProps, prevState) {
    setTimeout(() => {
      this.myScroll.refresh();
    }, 0);
  },

  onScrollEnd() {
    const { getOrderList, getTakeOutList, getBookList, getQueueList } = this.props;
    const { dinnerListArr, takeOutListArr, bookListArr, queueListArr } = this.state;
    if (this.myScroll.y === this.myScroll.maxScrollY) {
      if (location.hash === '#dinner') {
        getOrderList(Math.ceil(dinnerListArr.length / 20) + 1);
      }
      if (location.hash === '#quick') {
        getTakeOutList(Math.ceil(takeOutListArr.length / 20) + 1);
        // alert(Math.ceil(takeOutListArr.length / 20));
      }
      if (location.hash === '#book') {
        getBookList(Math.ceil(bookListArr.length / 20) + 1);
      }
      if (location.hash === '#queue') {
        getQueueList(Math.ceil(queueListArr.length / 20) + 1);
      }
    }
  },

  // 获得页面hash并发送action
  setChildViewAccordingToHash() {
    const { setChildView, getOrderList, getTakeOutList, getBookList, getQueueList } = this.props;
    const hash = location.hash;
    setChildView(hash);

    if (hash === '#dinner') {
      this.setState({
        activeItem: '堂食',
        showSection: 'TS',
        takeOutListArr: [],
        bookListArr: [],
        queueListArr: [],
      });
      getOrderList(1);
    } else if (hash === '#quick') {
      this.setState({
        activeItem: '外卖',
        showSection: 'WM',
        dinnerListArr: [],
        bookListArr: [],
        queueListArr: [],
      });
      getTakeOutList(1);
    } else if (hash === '#book') {
      this.setState({
        activeItem: '预订',
        showSection: 'BK',
        dinnerListArr: [],
        takeOutListArr: [],
        queueListArr: [],
      });
      getBookList(1);
    } else if (hash === '#queue') {
      this.setState({
        activeItem: '排队',
        showSection: 'QE',
        dinnerListArr: [],
        takeOutListArr: [],
        bookListArr: [],
      });
      getQueueList(1);
    }
  },

  // 堂食、外卖订单列表
  getOrderDinner(orderList, orderType) {
    return orderList && orderList.map((item, index) =>
      <OrderDinner orderList={item} key={index} orderType={orderType} onLoad={this.handleOnLoad} />
    );
  },

  // 预订订单列表
  getOrderBook(bookList) {
    return bookList && bookList.map((item, index) =>
      <OrderBook bookList={item} key={index} />
    );
  },

  // 排队订单列表
  getOrderQueue(queueList) {
    return queueList && queueList.map((item, index) =>
      <OrderQueue queueList={item} key={index} />
    );
  },

  // 获取tab标签数组
  getTabs() {
    const { orderList } = this.props;
    const tabArray = orderList.supportBusinessTypes || [];
    let tabArrayStr = [];
    if (tabArray && tabArray.length > 0) {
      tabArray.forEach(item => {
        switch (item) {
          case 'TS':
            tabArrayStr.push('堂食');
            break;
          case 'WM':
            tabArrayStr.push('外卖');
            break;
          case 'YD':
            tabArrayStr.push('预订');
            break;
          case 'PD':
            tabArrayStr.push('排队');
            break;
          default:
            break;
        }
      });
    }

    return tabArrayStr;
  },

  handleClearErrorMsg() {
    this.props.setErrorMsg('');
  },

  // tabs切换
  handleGetIndex(index, item) {
    const { setChildView } = this.props;
    const hash = location.hash;
    if (item === '堂食' && hash !== '#dinner') {
      location.hash = '#dinner'; // 堂食
      setChildView('#dinner');
    } else if (item === '外卖' && hash !== '#quick') {
      location.hash = '#quick'; // 外卖
      setChildView('#quick');
    } else if (item === '预订' && hash !== '#book') {
      location.hash = '#book';  // 预订
      setChildView('#book');
    } else if (item === '排队' && hash !== '#queue') {
      location.hash = '#queue'; // 排队
      setChildView('#queue');
    }
  },

  mergeList(list, newList) {
    const existedOrders = {};
    const result = [];

    (list || []).forEach(item => {
      existedOrders[item.orderId] = true;
      result.push(item);
    });

    (newList || []).forEach(item => {
      if (!existedOrders[item.orderId]) {
        result.push(item);
      }
    });
    return result;
  },

  render() {
    const {
      showSection,
      dinnerListArr,
      takeOutListArr,
      bookListArr,
      queueListArr,
      activeItem,
    } = this.state;

    const { loadStatus, errorMessage } = this.props;
    const { orderList } = this.props;
    const tabArray = orderList.supportBusinessTypes || [];
    if (!location.hash && tabArray[0]) {
      switch (tabArray[0]) {
        case 'TS':
          location.hash = '#dinner';
          break;
        case 'WM':
          location.hash = '#quick';
          break;
        case 'YD':
          location.hash = '#book';
          break;
        case 'PD':
          location.hash = '#queue';
          break;
        default:
          break;
      }
    }
    return (
      <div className="order-page application">
      {this.getTabs() && this.getTabs().length > 1 &&
        <SwitchNavi
          navis={this.getTabs()}
          getIndex={this.handleGetIndex}
          activeTab={activeItem}
        />
      }
        <div id="myScroll" className={classnames('order-conent', { 'order-conent-full': tabArray.length < 2 })}>
          <div className="records">
            {showSection === 'TS' && this.getOrderDinner(dinnerListArr, 'TS')}
            {showSection === 'WM' && this.getOrderDinner(takeOutListArr, 'WM')}
            {showSection === 'BK' && this.getOrderBook(bookListArr)}
            {showSection === 'QE' && this.getOrderQueue(queueListArr)}
          </div>
        </div>
        {
          // <div className="copyright"></div>
          loadStatus && <Load word="加载中" />
        }
        {
          errorMessage && <Toast errorMessage={errorMessage} clearErrorMsg={this.handleClearErrorMsg} />
        }
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
    loadStatus: state.loadStatus,
    errorMessage: state.errorMessage,
  });
};

module.exports = connect(mapStateToProps, orderListAction)(OrderListApplication);
