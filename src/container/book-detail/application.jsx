const React = require('react');
const connect = require('react-redux').connect;
const bookDetailAction = require('../../action/order-detail/book-detail.js');
const dateUtility = require('../../helper/common-helper.js').dateUtility;

const shopLogoDefault = require('../../asset/images/logo_default.svg');

require('../../asset/style/style.scss');
require('../../component/order-detail/common.scss');
require('./application.scss');

const BookDetailApplication = React.createClass({
  displayName: 'BookDetailApplication',
  propTypes: {
    getBookDetail: React.PropTypes.func,
    bookDetail: React.PropTypes.object,
  },
  componentWillMount() {
    this.props.getBookDetail();
  },

  orderInfoFormat(bookDetail) {
    const sex = String(bookDetail.sex);
    const orderStatus = String(bookDetail.orderStatus);
    let orderInfoFormat = {};
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
        orderStatusStyle = 'book-success'; // 已到店
      }
    } else if (orderStatus === '2') {
      orderStatusStyle = 'book-success'; // 预订成功
    } else if (orderStatus === '9') {
      orderStatusStyle = 'book-cancel'; // 取消预订
    } else if (orderStatus === '1') {
      orderStatusStyle = 'book-success'; // 已到店
    }

    orderInfoFormat.sex = sexStr;
    orderInfoFormat.orderStatus = orderStatusStyle;
    return orderInfoFormat;
  },

  render() {
    const { bookDetail } = this.props;
    return (
      <div className="book-page bg-orange application">
        <div className="book-content content-fillet">
          <div className="box-head">
            <img className="box-head-logo" role="presentation" src={bookDetail.shopLogo || shopLogoDefault} />
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
        </div>
      </div>
    );
  },
});

const mapStateToProps = function (state) {
  return {
    bookDetail: state.bookDetail,
  };
};

module.exports = connect(mapStateToProps, bookDetailAction)(BookDetailApplication);
