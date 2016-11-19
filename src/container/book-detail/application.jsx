const React = require('react');
const connect = require('react-redux').connect;
const bookDetailAction = require('../../action/order-detail/book-detail.js');
const dateUtility = require('../../helper/common-helper.js').dateUtility;
const getUrlParam = require('../../helper/common-helper.js').getUrlParam;
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
const BookInfoHover = require('../../component/book/book-info-hover.jsx');
const shopLogoDefault = require('../../asset/images/logo_default.svg');
const Loading = require('../../component/mui/loading.jsx');
const Toast = require('../../component/mui/toast.jsx');
const config = require('../../config');


require('../../asset/style/style.scss');
require('../../component/order-detail/common.scss');
require('./application.scss');

const BookDetailApplication = React.createClass({
  displayName: 'BookDetailApplication',
  propTypes: {
    // from reducer
    load:React.PropTypes.object,
    errorMessage:React.PropTypes.string,
    bookDetail: React.PropTypes.object,
    bookInfo: React.PropTypes.object,
    // from actions
    getBookDetail: React.PropTypes.func.isRequired,
    getBookInfo: React.PropTypes.func.isRequired,
    clearBookInfo: React.PropTypes.func.isRequired,
    clearErrorMsg:React.PropTypes.func,
  },
  getInitialState() {
    return { showBill:false, shopLogo:shopLogoDefault };
  },
  componentWillMount() {
    const { getBookDetail } = this.props;
    getBookDetail();
  },
  componentWillReceiveProps(nextProps) {
    const { bookDetail } = this.props;
    if (nextProps.bookDetail !== bookDetail) {
      this.setState({ shopLogo:nextProps.bookDetail.shopLogo });
    }
  },
  getHoverState() {
    this.setState({ showBill:false });
  },
  checkBill() {
    this.setState({ showBill:true });
  },
  goToBook() {
    const getMoreTSDishesURL = `${config.getMoreTSDishesURL}?shopId=${getUrlParam('shopId')}&type=YD`;
    location.href = getMoreTSDishesURL;
  },
  orderInfoFormat(bookDetail) {
    const sex = String(bookDetail.sex);
    const orderStatus = String(bookDetail.orderStatus);
    const orderInfoFormat = {};
    let sexStr = '';
    let orderStatusStyle = '';
    const currentTime = new Date().getTime();
    const orderTime = bookDetail.orderTime;

    if (sex === '1') {
      sexStr = '先生';
    } else if (sex === '0') {
      sexStr = '女士';
    }

    if (orderStatus === '-4') {
      if (orderTime < currentTime) {
        orderStatusStyle = 'book-not-arrival'; // 未到店
      } else {
        orderStatusStyle = 'book-success'; // 预订成功
      }
    } else if (orderStatus === '-3') {
      orderStatusStyle = 'book-faild'; // 预订失败
    } else if (orderStatus === '-2') {
      if (orderTime < currentTime) {
        orderStatusStyle = 'book-faild'; // 预订失败
      } else {
        orderStatusStyle = 'book-confirming'; // 确认中
      }
    } else if (orderStatus === '-1') {
      if (orderTime < currentTime) {
        orderStatusStyle = 'book-not-arrival'; // 未到店
      } else {
        orderStatusStyle = 'book-success'; // 预订成功
      }
    } else if (orderStatus === '2') {
      orderStatusStyle = 'book-success'; // 预订成功
    } else if (orderStatus === '9') {
      orderStatusStyle = 'book-cancel'; // 取消预订
    } else if (orderStatus === '1') {
      orderStatusStyle = 'book-arrivaled'; // 已到店
    }

    orderInfoFormat.sex = sexStr;
    orderInfoFormat.orderStatus = orderStatusStyle;
    return orderInfoFormat;
  },
  picError() {
    this.setState({ shopLogo:shopLogoDefault });
  },
  checkBookList(orderMenu, isOrder, orderStatus) {
    if (isOrder) {
      return <div className="btn-row btn-row-sure btn-row-mt" onTouchTap={this.checkBill}>查看菜单</div>;
    } else if (orderMenu && orderStatus) {
      return <div className="btn-row btn-row-sure btn-row-mt" onTouchTap={this.goToBook}>预点菜</div>;
    }
    return false;
  },
  render() {
    const { load, errorMessage, clearErrorMsg, bookDetail, bookInfo, getBookInfo, clearBookInfo } = this.props;
    const { showBill } = this.state;
    const orderMenu = bookDetail.orderMenu === 0; // 是否已开通预定预点菜
    const isOrder = bookDetail.isOrder === 1; // 1 已点菜 0 未点菜
    const orderStatus = bookDetail.orderStatus === -1; // 可以预点菜

    const checkBookList = this.checkBookList(orderMenu, isOrder, orderStatus);
    return (
      <div className="book-page bg-orange application">
        <div className="book-content content-fillet">
          <div className="box-head">
            <img className="box-head-logo" role="presentation" src={bookDetail.shopLogo || shopLogoDefault} onError={this.picError} />
            <div className="ellipsis box-head-title">{bookDetail.shopName}</div>
          </div>
          <div className="divide-line">
            <div className="divide-line-title divide-line-four">预订信息</div>
          </div>
          <div className="book-info">
            <div className={`book-status ${this.orderInfoFormat(bookDetail).orderStatus}`}></div>
            <div className="list-default">
              <div className="list-item">
                <span className="list-item-title">订单编号</span>
                <span className="list-item-content">{bookDetail.orderId}</span>
              </div>
              <div className="list-item">
                <span className="list-item-title">预订时间</span>
                <span className="list-item-content">{dateUtility.format(new Date(bookDetail.orderTime), 'yyyy/MM/dd HH:mm')}</span>
              </div>
              <div className="list-item">
                <span className="list-item-title">桌台类型</span>
                <span className="list-item-content">{bookDetail.tableType}</span>
              </div>
              <div className="list-item">
                <span className="list-item-title">预订人数</span>
                <span className="list-item-content">{bookDetail.orderNumber}人</span>
              </div>
              <div className="list-item">
                <span className="list-item-title">联&nbsp;&nbsp;系&nbsp;人</span>
                <span className="list-item-content">{bookDetail.name}{this.orderInfoFormat(bookDetail).sex}</span>
              </div>
              <div className="list-item">
                <span className="list-item-title">联系方式</span>
                <span className="list-item-content">{bookDetail.mobile}</span>
              </div>
              {
                bookDetail.memo && <div className="list-item list-memo clearfix">
                  <span className="list-item-title">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注</span>
                  <span className="list-item-content">{bookDetail.memo}</span>
                </div>
              }
            </div>
          </div>
          {checkBookList}
        </div>
        <ReactCSSTransitionGroup transitionName="slideuphover" transitionEnterTimeout={600} transitionLeaveTimeout={600}>
        {
          showBill && (
            <BookInfoHover
              bookQueueItemList={bookInfo.dishItems}
              bookQueueMemo={bookInfo.memo}
              setHoverState={this.getHoverState}
              getBookQueueInfo={getBookInfo}
              clearBookQueueInfo={clearBookInfo}
            />
          )
        }
        </ReactCSSTransitionGroup>
        {
          load.status && <Loading word={load.word} />
        }
        {
        errorMessage && <Toast clearErrorMsg={clearErrorMsg} errorMessage={errorMessage} />
        }
      </div>
    );
  },
});


module.exports = connect(state => state, bookDetailAction)(BookDetailApplication);
