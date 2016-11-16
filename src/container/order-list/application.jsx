const React = require('react');
const orderListAction = require('../../action/order-list/order-list.js');
const connect = require('react-redux').connect;
const IScroll = require('iscroll/build/iscroll-probe');

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

    if (!location.hash) {
      location.hash = '#dinner';
    }
  },

  componentDidMount() {
    const options = {
      preventDefault: false,
      click: true,
      tap: true,
      mouseWheel: true,
      probeType: 3,
      bounce: true,
    };
    const wapper = document.getElementById('myScroll');
    this.myScroll = new IScroll(wapper, options);
    this.myScroll.on('scroll', this.onScroll);
    this.myScroll.on('scrollEnd', this.onScrollEnd);
  },

  componentWillReceiveProps(nextProps) {
    const { orderList, takeOutList, bookList, queueList } = nextProps;
    const { dinnerListArr, takeOutListArr, bookListArr, queueListArr } = this.state;

    if (JSON.stringify(this.props.orderList) !== JSON.stringify(orderList)) {
      this.setState({ dinnerListArr: dinnerListArr.concat(orderList) });
    }
    if (JSON.stringify(this.props.takeOutList) !== JSON.stringify(takeOutList)) {
      this.setState({ takeOutListArr: takeOutListArr.concat(takeOutList) });
    }
    if (JSON.stringify(this.props.bookList) !== JSON.stringify(bookList)) {
      this.setState({ bookListArr: bookListArr.concat(bookList) });
    }
    if (JSON.stringify(this.props.queueList) !== JSON.stringify(queueList)) {
      this.setState({ queueListArr: queueListArr.concat(queueList) });
    }
  },

  componentDidUpdate(prevProps, prevState) {
    setTimeout(() => {
      this.myScroll.refresh();
    }, 0);
  },

  onScroll() {
  },

  onScrollEnd() {
    const { getOrderList, getTakeOutList, getBookList, getQueueList } = this.props;
    const { dinnerListArr, takeOutListArr, bookListArr, queueListArr } = this.state;
    if (this.myScroll.y === this.myScroll.maxScrollY) {
      if (location.hash === '#dinner') {
        getOrderList(Math.ceil(dinnerListArr.length / 20));
      }
      if (location.hash === '#quick') {
        getTakeOutList(Math.ceil(takeOutListArr.length / 20));
        // alert(Math.ceil(takeOutListArr.length / 20));
      }
      if (location.hash === '#book') {
        getBookList(Math.ceil(bookListArr.length / 20));
      }
      if (location.hash === '#queue') {
        getQueueList(Math.ceil(queueListArr.length / 20));
      }
    }
  },

  // 获得页面hash并发送action
  setChildViewAccordingToHash() {
    const { setChildView, getOrderList, getTakeOutList, getBookList, getQueueList } = this.props;
    const hash = location.hash;
    setChildView(hash);

    if (hash === '#dinner') {
      this.setState({ activeNum: 0 });
      this.setState({ showSection: 'TS' });
      getOrderList(1);
    } else if (hash === '#quick') {
      this.setState({ activeNum: 1 });
      this.setState({ showSection: 'WM' });
      getTakeOutList(1);
    } else if (hash === '#book') {
      this.setState({ activeNum: 2 });
      this.setState({ showSection: 'BK' });
      getBookList(1);
    } else if (hash === '#queue') {
      this.setState({ activeNum: 3 });
      this.setState({ showSection: 'QE' });
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
    const { showSection, dinnerListArr, takeOutListArr, bookListArr, queueListArr } = this.state;
    return (
      <div className="order-page application">
        <SwitchNavi
          navis={['堂食', '外卖', '预订', '排队']}
          getIndex={this.handleGetIndex}
          activeTab={this.state.activeNum}
        />
        <div id="myScroll" className="order-conent">
          <div>
            {showSection === 'TS' && this.getOrderDinner(dinnerListArr, 'TS')}
            {showSection === 'WM' && this.getOrderDinner(takeOutListArr, 'WM')}
            {showSection === 'BK' && this.getOrderBook(bookListArr)}
            {showSection === 'QE' && this.getOrderQueue(queueListArr)}
          </div>
        </div>
        {
          // <div className="copyright"></div>
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
  });
};

module.exports = connect(mapStateToProps, orderListAction)(OrderListApplication);
