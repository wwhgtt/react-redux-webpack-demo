const React = require('react');
const connect = require('react-redux').connect;
const classnames = require('classnames');
const takeoutAction = require('../../action/order-detail/takeout-detail.js');
const commonHelper = require('../../helper/common-helper.js');
const dateUtility = require('../../helper/common-helper.js').dateUtility;

require('../../asset/style/style.scss');

const DishDetail = require('../../component/order-detail-uncheck/dish-detail.jsx');
const shopLogoDefault = require('../../asset/images/logo_default.svg');

require('../../component/order-detail/dish-detail.scss');
require('../../component/order-detail/common.scss');
require('./application.scss');

const shopId = commonHelper.getUrlParam('shopId');
const listEntry = commonHelper.getUrlParam('listEntry');

const TakeoutDetailApplication = React.createClass({
  displayName: 'TakeoutDetailApplication',
  propTypes: {
    getTakeoutDetail: React.PropTypes.func,
    takeoutDetail: React.PropTypes.object,
  },

  getInitialState() {
    return {
      countDown: 0,
      isCouponBigShow: false,
      isCounponSmallShow: false,
    };
  },

  componentWillMount() {
    this.props.getTakeoutDetail();
  },

  componentWillReceiveProps(nextProps) {
    const { takeoutDetail } = nextProps;
    if (takeoutDetail.dateTime) {
      const countDownOri = 900000 - (parseInt(new Date().getTime(), 10) - parseInt(takeoutDetail.dateTime, 10));
      if (countDownOri > 0 && countDownOri <= 900000 && takeoutDetail.status === '订单待支付') {
        this.setState({ countDown: countDownOri });
      }
    }

    if (listEntry) {
      this.setState({ isCounponSmallShow : true });
    } else {
      if (!this.isCouponShow) {
        this.setState({ isCouponBigShow: true });
        this.isCouponShow = true;
      }
    }
  },

  componentDidUpdate(prevProps, prevState) {
    const { takeoutDetail } = this.props;
    const { countDown } = this.state;

    if (takeoutDetail.status === '订单待支付') {
      clearInterval(this.countDownInteval);
      if (countDown > 1000 && countDown <= 900000) {
        this.countDownInteval = setInterval(() => {
          this.setState({ countDown: countDown - 1000 });
        }, 1000);
      } else {
        clearInterval(this.countDownInteval);
        if (!this.isReGetInfo) {
          this.props.getTakeoutDetail();
          this.isReGetInfo = true;
        }
      }
    } else {
      clearInterval(this.countDownInteval);
    }
  },

  // 支付方式
  getPayMethod() {
    const payMethodStr = this.props.takeoutDetail.tradePayForm;
    let payMethod = '';
    if (payMethodStr === 'OFFLINE') {
      payMethod = '线下支付';
    } else if (payMethodStr === 'ONLINE') {
      payMethod = '在线支付';
    }

    return payMethod;
  },

  // 性别
  getSex() {
    const sexStr = String(this.props.takeoutDetail.sex);
    let sex = '';
    if (sexStr === '0') {
      sex = '女士';
    } else if (sexStr === '1') {
      sex = '先生';
    }
    return sex;
  },

  getOriginPrice() {
    const { takeoutDetail } = this.props;
    const privalegePrice = Math.abs(takeoutDetail.tradePrivilegeAmount) * 100 || 0;
    const totalPrice = Math.abs(takeoutDetail.tradeAmount) * 100 || 0;
    const originPrice = (totalPrice + privalegePrice) / 100 || 0;
    return originPrice;
  },

  formatCuntDown(countDown) {
    let countDownStr = '';
    const countDownMinut = Math.floor(countDown / 60000);
    const countDownSecond = Math.floor((countDown % 60000) / 1000);
    countDownStr = `${countDownMinut}分${countDownSecond}秒`;
    return countDownStr;
  },

  // 关闭直发券
  handleCloseCounpon(event) {
    event.preventDefault();
    this.setState({ isCounponSmallShow: true, isCouponBigShow: false });
  },

  render() {
    const { takeoutDetail } = this.props;
    const { isCounponSmallShow, isCouponBigShow } = this.state;
    return (
      <div className="application takeout-page">
        <div className="flex-columns">
          <div className="flex-rest detail-content">
            <div className="order-status">
              <span className="order-status-title ellipsis">{takeoutDetail.status}</span>
              {
                takeoutDetail.tradeFailReason &&
                  <span className="order-status-detail ellipsis">{takeoutDetail.tradeFailReason}</span>
              }
              {takeoutDetail.status === '订单待支付' &&
                <span className="order-status-detail ellipsis">
                  {this.formatCuntDown(this.state.countDown)}后订单自动取消
                </span>
              }
            </div>
            <div className="options-group takeout-head">
              <div className="option">
                <a className="shop-info" href={`http://${location.host}/takeaway/selectDish?shopId=${shopId}&type=WM`}>
                  <img className="shop-info-logo" role="presentation" src={takeoutDetail.shopLogo || shopLogoDefault} />
                  <span className="shop-info-name ellipsis">{takeoutDetail.shopName}</span>
                </a>
              </div>
              {
                takeoutDetail.serialNo &&
                  <div className="option">
                    <span className="takeout-head-title takeout-head-no">流水号</span>
                    <span className="takeout-head-content">{takeoutDetail.serialNo}</span>
                  </div>
              }
              <div className="option option-no-padding">
                <span className="takeout-head-title">送达时间</span>
                <span className="takeout-head-content">{takeoutDetail.expectTime}</span>
              </div>
              <div className="option clearfix">
                <span className="takeout-head-title fl">收货信息</span>
                <div className="fl takeout-head-content">
                  <p>{takeoutDetail.address}</p>
                  <p>{takeoutDetail.name}{this.getSex()} {takeoutDetail.mobile}</p>
                </div>
              </div>
            </div>
            <div className="options-group option-min">
            {
              takeoutDetail.dishItems &&
                takeoutDetail.dishItems.map((item, index) =>
                  <DishDetail mainDish={item} key={index} />
              )
            }
            </div>
            {takeoutDetail.extraFee && takeoutDetail.extraFee.length > 0 &&
              <div className="options-group option-min option-extra">
                {
                  takeoutDetail.extraFee && takeoutDetail.extraFee.map((item, index) =>
                    <div className="option" key={index}>
                      <span>{item.privilegeName}</span>
                      <div className="fr">{item.privilegeAmount < 0 ? '-' : ''}<span className="price">{Math.abs(item.privilegeAmount)}</span></div>
                    </div>
                  )
                }
              </div>
            }
            {takeoutDetail.tradePrivileges && takeoutDetail.tradePrivileges.length > 0 &&
              <div className="list-default option-privilege">
                {
                  takeoutDetail.tradePrivileges && takeoutDetail.tradePrivileges.map((item, index) =>
                    <div className="list-item flex-row" key={index}>
                      <span className={`icon-privilege icon-${Math.abs(item.privilegeType)}`}>{item.privilegeName}</span>
                      {item.privilegeValue && <span className="list-privilege-value">-{Math.abs(item.privilegeValue)}</span>}
                      <div className="fr list-privilege">-<span className="price">{Math.abs(item.privilegeAmount)}</span></div>
                    </div>
                  )
                }
                {
                  Boolean(takeoutDetail.carryRuleAmount) && (
                    <div className="list-item flex-row">
                      <span className="icon-privilege icon-carry">自动抹零</span>
                      <div className="fr list-privilege">
                        {takeoutDetail.carryRuleAmount < 0 ? '-' : ''}<span className="price">{Math.abs(takeoutDetail.carryRuleAmount)}</span>
                      </div>
                    </div>
                  )
                }
              </div>
            }
            <div className="list-statictis clearfix">
              <div className="list-statictis-item">
                <span className="list-statictis-title">原价</span>
                <span className="price ellipsis list-statictis-origin">{this.getOriginPrice()}</span>
              </div>
              <div className="list-statictis-item">
                <span className="list-statictis-title">共优惠</span>
                <span className="price ellipsis list-statictis-privilage">{Math.abs(takeoutDetail.tradePrivilegeAmount || 0)}</span>
              </div>
              <div className="list-statictis-item">
                <span className="list-statictis-title">总计：</span>
                <span className="price ellipsis list-statictis-total">{takeoutDetail.tradeAmount}</span>
              </div>
            </div>
            <p className="list-other">其他信息</p>
            <div className="option-group">
              <div className="list-default">
                <div className="list-item">
                  <span className="list-item-title">下单时间</span>
                  <span className="list-item-content">{dateUtility.format(new Date(takeoutDetail.dateTime || 0), 'yyyy/MM/dd HH:mm')}</span>
                </div>
                <div className="list-item">
                  <span className="list-item-title">订单编号</span>
                  <span className="list-item-content ellipsis">{takeoutDetail.orderNumber}</span>
                </div>
                <div className="list-item">
                  <span className="list-item-title">支付方式</span>
                  <span className="list-item-content">{this.getPayMethod()}</span>
                </div>
                {
                  takeoutDetail.memo &&
                    <div className="list-item list-memo clearfix">
                      <span className="list-item-title fl">备注</span>
                      <span className="list-item-content fl">{takeoutDetail.memo}</span>
                    </div>
                }
                {
                  takeoutDetail.invoiceTitle &&
                    <div className="list-item list-memo clearfix">
                      <span className="list-item-title fl">发票抬头</span>
                      <span className="list-item-content fl">{takeoutDetail.invoiceTitle}</span>
                    </div>
                }
              </div>
            </div>
          </div>
          <div className="btn-oparate flex-none clearfix">
            <a
              className={
                classnames('btn-oparate-more fl',
                { 'width-full': !(takeoutDetail.status === '订单待支付' || takeoutDetail.status === '订单支付失败') })
              }
              href={`http://${location.host}/takeaway/selectDish?shopId=${shopId}&type=WM`}
            >再来一单</a>
            {(takeoutDetail.status === '订单待支付' || takeoutDetail.status === '订单支付失败') &&
              <a
                className="btn-oparate-count fl"
                href={`http://${location.host}/shop/payDetail?shopId=${shopId}&orderId=${takeoutDetail.orderId}&orderType=WM`}
              >结账</a>
            }
          </div>
        </div>
        {isCounponSmallShow && takeoutDetail.url &&
          <a className="coupon-content-small" href={takeoutDetail.url}></a>
        }
        {isCouponBigShow && takeoutDetail.url &&
          <div className="coupon-bg">
            <a className="coupon-content-close" onTouchTap={this.handleCloseCounpon}></a>
            <div className="coupon-content">
              <div className="coupon-img coupon-content-big"></div>
              <div className="coupon-content-tips">
                <span>客观！是你的优惠券~</span>
                <a className="coupon-content-btn " href={takeoutDetail.url}></a>
              </div>
            </div>
          </div>
        }
      </div>
    );
  },
});

module.exports = connect(state => state, takeoutAction)(TakeoutDetailApplication);
