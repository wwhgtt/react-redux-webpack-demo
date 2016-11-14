const React = require('react');
const connect = require('react-redux').connect;
const dinnerDetailAction = require('../../action/order-detail/dinner-detail.js');
const commonHelper = require('../../helper/common-helper.js');
const dateUtility = require('../../helper/common-helper.js').dateUtility;

require('../../asset/style/style.scss');

const DishDetail = require('../../component/order-detail-uncheck/dish-detail.jsx');
const DiningOptions = require('../../component/order/dining-options.jsx');
require('../../component/order-detail/dish-detail.scss');
require('../../component/order-detail/common.scss');
require('./application.scss');

const shopId = commonHelper.getUrlParam('shopId');
const shopLogoDefault = require('../../asset/images/logo_default.svg');

const DinnerDetailApplication = React.createClass({
  displayName: 'DinnerDetailApplication',
  propTypes: {
    dinnerDetail: React.PropTypes.object,
    getDinnerDetail: React.PropTypes.func,
  },

  getInitialState() {
    return {
      countDown: 0,
    };
  },

  componentWillMount() {
    this.props.getDinnerDetail();
  },

  componentWillReceiveProps(nextProps) {
    const { dinnerDetail } = nextProps;
    if (dinnerDetail.dateTime) {
      const countDownOri = 900000 - (parseInt(new Date().getTime(), 10) - parseInt(dinnerDetail.dateTime, 10));
      if (countDownOri > 0 && countDownOri <= 900000 && dinnerDetail.status === '订单待支付') {
        this.setState({ countDown: countDownOri });
      }
    }
  },

  componentDidUpdate(prevProps, prevState) {
    const { dinnerDetail } = this.props;
    const { countDown } = this.state;
    if (dinnerDetail.status === '订单待支付') {
      clearInterval(this.countDownInteval);
      if (countDown > 1000 && countDown <= 900000) {
        this.countDownInteval = setInterval(() => {
          this.setState({ countDown: countDown - 1000 });
        }, 1000);
      } else {
        clearInterval(this.countDownInteval);
        if (!this.isReGetInfo) {
          this.props.getDinnerDetail();
          this.isReGetInfo = true;
        }
      }
    } else {
      clearInterval(this.countDownInteval);
    }
  },

  // 支付方式
  getPayMethod() {
    const payMethodStr = this.props.dinnerDetail.tradePayForm;
    let payMethod = '';
    if (payMethodStr === 'OFFLINE') {
      payMethod = '线下支付';
    } else if (payMethodStr === 'ONLINE') {
      payMethod = '在线支付';
    }

    return payMethod;
  },

  getOriginPrice() {
    const { dinnerDetail } = this.props;
    const privalegePrice = Math.abs(dinnerDetail.tradePrivilegeAmount) * 100 || 0;
    const totalPrice = Math.abs(dinnerDetail.tradeAmount) * 100 || 0;
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

  render() {
    const { dinnerDetail } = this.props;
    const deskNo = {
      area: dinnerDetail.tableArea,
      table: dinnerDetail.tableNo,
    };

    return (
      <div className="application detail-page">
        <div className="flex-columns">
          <div className="flex-rest detail-content">
            <div className="order-status">
              <span className="order-status-title ellipsis">{dinnerDetail.status}</span>
              {
                // <a className="order-status-comment">我要评价</a>
              }
              {
                dinnerDetail.tradeFailReason &&
                  <span className="order-status-detail ellipsis">{dinnerDetail.tradeFailReason}</span>
              }
              {dinnerDetail.status === '订单待支付' &&
                <span className="order-status-detail ellipsis">
                  {this.formatCuntDown(this.state.countDown)}后订单自动取消
                </span>
              }
            </div>
            <div className="options-group">
              <a className="shop-info" href={`http://${location.host}/orderall/selectDish?shopId=${shopId}&type=TS`}>
                <img className="shop-info-logo" role="presentation" src={dinnerDetail.shopLogo || shopLogoDefault} />
                <span className="shop-info-name ellipsis">{dinnerDetail.shopName}</span>
              </a>
              <div className="option">
                <DiningOptions
                  dineSerialNumber={dinnerDetail.serialNo || ''}
                  dineCount={dinnerDetail.peopleCount || 0}
                  dineTableProp={deskNo}
                />
              </div>
            </div>

            <div className="options-group option-min">
            {
              dinnerDetail.dishItems &&
                dinnerDetail.dishItems.map((item, index) =>
                  <DishDetail mainDish={item} key={index} />
              )
            }
            </div>
            <div className="options-group option-extra option-min">
              {
                dinnerDetail.extraFee && dinnerDetail.extraFee.map((item, index) =>
                  <div className="option" key={index}>
                    <span>{item.privilegeName}</span>
                    <div className="fr">{item.privilegeAmount < 0 ? '-' : ''}<span className="price">{Math.abs(item.privilegeAmount)}</span></div>
                  </div>
                )
              }
            </div>
            <div className="list-default option-privilege">
              {
                dinnerDetail.tradePrivileges && dinnerDetail.tradePrivileges.map((item, index) =>
                  <div className="list-item flex-row" key={index}>
                    <span className={`icon-privilege icon-${Math.abs(item.privilegeType)}`}>{item.privilegeName}</span>
                    {item.privilegeValue && <span className="list-privilege-value">-{Math.abs(item.privilegeValue)}</span>}
                    <div className="fr list-privilege">-<span className="price">{Math.abs(item.privilegeAmount)}</span></div>
                  </div>
                )
              }
              {
                Boolean(dinnerDetail.carryRuleAmount) && (
                  <div className="list-item flex-row">
                    <span className="icon-privilege icon-carry">自动抹零</span>
                    <div className="fr">
                      {dinnerDetail.carryRuleAmount < 0 ? '-' : ''}<span className="price">{Math.abs(dinnerDetail.carryRuleAmount)}</span>
                    </div>
                  </div>
                )
              }
            </div>
            <div className="list-statictis">
              <div className="flex-row">
                <div className="flex-row-item">
                  <span className="list-statictis-title">原价</span>
                  <span className="price ellipsis list-statictis-origin">{this.getOriginPrice()}2345432</span>
                </div>
                <div className="flex-row-item">
                  <span className="list-statictis-title">共优惠</span>
                  <span className="price ellipsis list-statictis-privilage">{Math.abs(dinnerDetail.tradePrivilegeAmount || 0)}234567654</span>
                </div>
                <div className="flex-row-item">
                  <span className="list-statictis-title">总计：</span>
                  <span className="price ellipsis list-statictis-total">{dinnerDetail.tradeAmount}4567876543</span>
                </div>
              </div>
            </div>
            <p className="list-other">其他信息</p>
            <div className="option-group">
              <div className="list-default">
                <div className="list-item">
                  <span className="list-item-title">下单时间</span>
                  <span className="list-item-content">{dateUtility.format(new Date(dinnerDetail.dateTime), 'yyyy/MM/dd HH:mm')}</span>
                </div>
                <div className="list-item">
                  <span className="list-item-title">订单编号</span>
                  <span className="list-item-content">{dinnerDetail.orderNumber}</span>
                </div>
                <div className="list-item">
                  <span className="list-item-title">支付方式</span>
                  <span className="list-item-content">{this.getPayMethod()}</span>
                </div>
                {
                  dinnerDetail.memo &&
                    <div className="list-item list-memo clearfix">
                      <span className="list-item-title fl">备注</span>
                      <span className="list-item-content fl">{dinnerDetail.memo}</span>
                    </div>
                }
                {
                  dinnerDetail.invoiceTitle &&
                    <div className="list-item list-memo clearfix">
                      <span className="list-item-title fl">发票抬头</span>
                      <span className="list-item-content fl">{dinnerDetail.invoiceTitle}</span>
                    </div>
                }
              </div>
            </div>
          </div>
          <div className="btn-oparate flex-none">
            <div className="flex-row">
              <a className="btn-oparate-more" href={`http://${location.host}/orderall/selectDish?shopId=${shopId}&type=TS`}>再来一单</a>
              {dinnerDetail.businessType === 1 && (dinnerDetail.status === '订单待支付' || dinnerDetail.status === '订单支付失败') &&
                <a
                  className="btn-oparate-count"
                  href={`http://${location.host}/shop/payDetail?shopId=${shopId}&orderId=${dinnerDetail.orderId}&orderType=TS`}
                >结账</a>
              }
            </div>
          </div>
        </div>
      </div>
    );
  },
});

const mapStateToProps = function (state) {
  return ({
    dinnerDetail: state.dinnerDetail,
  });
};

module.exports = connect(mapStateToProps, dinnerDetailAction)(DinnerDetailApplication);