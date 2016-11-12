const React = require('react');
const connect = require('react-redux').connect;
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

const TakeoutDetailApplication = React.createClass({
  displayName: 'TakeoutDetailApplication',
  propTypes: {
    getTakeoutDetail: React.PropTypes.func,
    takeoutDetail: React.PropTypes.object,
  },

  getInitialState() {
    return {
      countDown: 900000,
    };
  },

  componentWillMount() {
    this.props.getTakeoutDetail();
  },

  componentWillReceiveProps(nextProps) {
    const { takeoutDetail } = nextProps;
    if (takeoutDetail.dateTime) {
      const countDownOri = 900000 - (parseInt(new Date().getTime(), 10) - parseInt(takeoutDetail.dateTime, 10));
      this.setState({ countDown: countDownOri });
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
        this.props.getTakeoutDetail();
      }
    }
  },

  // 支付方式
  getPayMethod() {
    const payMethodStr = String(this.props.takeoutDetail.tradePayForm);
    let payMethod = '';
    if (payMethodStr === '1') {
      payMethod = '线下支付';
    } else if (payMethodStr === '3') {
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

  formatCuntDown(countDown) {
    let countDownStr = '';
    const countDownMinut = Math.floor(countDown / 60000);
    const countDownSecond = Math.floor((countDown % 60000) / 1000);
    countDownStr = `${countDownMinut}分${countDownSecond}秒`;
    return countDownStr;
  },

  render() {
    const { takeoutDetail } = this.props;
    return (
      <div className="application">
        <div className="flex-columns">
          <div className="flex-rest">
            <div className="order-status">
              <span className="order-status-title">{takeoutDetail.status}</span>
              {
                takeoutDetail.tradeFailReason &&
                  <span className="order-status-reason">{takeoutDetail.tradeFailReason}</span>
              }
              {takeoutDetail.status === '订单待支付' &&
                <span className="order-status-detail">
                  {this.formatCuntDown(this.state.countDown)}后订单自动取消
                </span>
              }
            </div>
            <div className="options-group">
              <div className="option">
                <a className="shop-info" href="">
                  <img className="shop-info-logo" role="presentation" src={takeoutDetail.shopLogo || shopLogoDefault} />
                  <span className="shop-info-name ellipsis">{takeoutDetail.shopName}</span>
                </a>
              </div>
              {
                takeoutDetail.serialNo &&
                  <div className="option">
                    <span>流水号</span>
                    <span>{takeoutDetail.serialNo}</span>
                  </div>
              }
              <div className="option">
                <span>送达时间</span>
                <span>{takeoutDetail.expectTime}</span>
              </div>
              <div className="option">
                <span>收货地址</span>
                <div>
                  <p>{takeoutDetail.address}</p>
                  <span>{takeoutDetail.name}{this.getSex()}{takeoutDetail.mobile}</span>
                </div>
              </div>
            </div>
            <div className="options-group">
            {
              takeoutDetail.dishItems &&
                takeoutDetail.dishItems.map((item, index) =>
                  <DishDetail mainDish={item} key={index} />
              )
            }
            </div>
            <div className="options-group">
              {
                takeoutDetail.extraFee && takeoutDetail.extraFee.map((item, index) =>
                  <div className="option" key={index}>
                    <span>{item.privilegeName}</span>
                    <div className="fr">{item.privilegeAmount < 0 ? '-' : ''}<span className="price">{Math.abs(item.privilegeAmount)}</span></div>
                  </div>
                )
              }
            </div>
            <div className="list-default">
              {
                takeoutDetail.tradePrivileges && takeoutDetail.tradePrivileges.map((item, index) =>
                  <div className="list-item flex-row" key={index}>
                    <span className={`icon-privilege icon-${Math.abs(item.privilegeType)}`}>{item.privilegeName}</span>
                    {item.privilegeValue && <span>-{Math.abs(item.privilegeValue)}</span>}
                    <div className="fr">-<span className="price">{Math.abs(item.privilegeAmount)}</span></div>
                  </div>
                )
              }
              {
                Boolean(takeoutDetail.carryRuleAmount) && (
                  <div className="list-item flex-row">
                    <span className="icon-privilege icon-carry">自动抹零</span>
                    <div className="fr">
                      {takeoutDetail.carryRuleAmount < 0 ? '-' : ''}<span className="price">{Math.abs(takeoutDetail.carryRuleAmount)}</span>
                    </div>
                  </div>
                )
              }
              <div className="list-item">
                <div className="flex-row">
                  <div className="flex-row-item">原价
                    <span className="price">{(takeoutDetail.tradeAmount || 0) + Math.abs(takeoutDetail.tradePrivilegeAmount || 0)}</span>
                  </div>
                  <div className="flex-row-item">共优惠<span className="price">{Math.abs(takeoutDetail.tradePrivilegeAmount || 0)}</span></div>
                  <div className="flex-row-item">总计：
                    <span className="price">{takeoutDetail.tradeAmount}</span>
                  </div>
                </div>
              </div>
            </div>
            <p>其他信息</p>
            <div className="option-group">
              <div className="list-default">
                <div className="list-item">
                  <span className="list-item-title">下单时间</span>
                  <span className="list-item-content">{dateUtility.format(new Date(takeoutDetail.dateTime), 'yyyy/MM/dd HH:mm')}</span>
                </div>
                <div className="list-item">
                  <span className="list-item-title">订单编号</span>
                  <span className="list-item-content">{takeoutDetail.orderNumber}</span>
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
          <div className="btn-oparate flex-none">
            <div className="flex-row">
              <a className="btn-oparate-more" href={`http://${location.host}/orderall/selectDish?shopId=${shopId}`}>再来一单</a>
              {(takeoutDetail.status === '订单待支付' || takeoutDetail.status === '订单支付失败') &&
                <a
                  className="btn-oparate-count"
                  href={`http://${location.host}/shop/payDetail?shopId=${shopId}&orderId=${takeoutDetail.orderId}&orderType=TS`}
                >结账</a>
              }
            </div>
          </div>
        </div>
      </div>
    );
  },
});

module.exports = connect(state => state, takeoutAction)(TakeoutDetailApplication);
