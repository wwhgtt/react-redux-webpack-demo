const React = require('react');
const connect = require('react-redux').connect;
const commonAction = require('../../action/common-action/common-action.js');
const bindActionCreators = require('redux').bindActionCreators;
const classnames = require('classnames');
const takeoutAction = require('../../action/order-detail/takeout-detail.js');
const commonHelper = require('../../helper/common-helper.js');
const dateUtility = require('../../helper/common-helper.js').dateUtility;
const ConfirmDialog = require('../../component/mui/dialog/confirm-dialog.jsx');
const Dialog = require('../../component/mui/dialog/dialog.jsx');
const Toast = require('../../component/mui/toast.jsx');

require('../../asset/style/style.scss');

const DishDetail = require('../../component/order-detail-uncheck/dish-detail.jsx');
const shopLogoDefault = require('../../asset/images/logo_default.svg');
const CommentStar = require('../../component/order-detail/comment-star.jsx');

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
    saveMarkRecord: React.PropTypes.func,
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
          setTimeout(() => { this.props.getTakeoutDetail(); }, 2000);
          this.isReGetInfo = true;
        }
      }
    } else {
      clearInterval(this.countDownInteval);
    }
  },

  // 评分按钮
  getCommentBtn() {
    const { takeoutDetail } = this.props;
    let commentBtn = '';
    if (takeoutDetail.markRecord4Order) {
      if (takeoutDetail.markRecord4Order.supportMark) {
        if (takeoutDetail.markRecord4Order.markSendCoupFlag) {
          commentBtn = (<a className="order-status-comment order-status-hasCoupon" onTouchTap={this.showComment}>评分领券</a>);
        } else {
          commentBtn = (<a className="order-status-comment" onTouchTap={this.showComment}>我要评分</a>);
        }
      } else if (takeoutDetail.markRecord4Order.score > 0) {
        commentBtn = (<a className="order-status-comment" onTouchTap={this.showCommentRead}>我的评分</a>);
      }
    }

    return commentBtn;
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

  showComment() {
    this.setState({ isCommentShow: true });
  },

  showCommentRead() {
    this.setState({ isCommentReadShow: true });
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

  // 结算
  handlePayDetail() {
    const { takeoutDetail } = this.props;
    const returnUrl =
      encodeURIComponent(`http://${location.host}/order/takeOutDetail?shopId=${shopId}&orderId=${takeoutDetail.orderId}&listEntry=true`);
    sessionStorage.setItem('rurl_payDetaill', JSON.stringify(returnUrl));
    location.href = `http://${location.host}/shop/payDetail?shopId=${shopId}&orderId=${takeoutDetail.orderId}&orderType=WM`;
  },

  // 选星星
  handleSelectStar(i) {
    this.setState({ commentScore: i + 1 });
  },

  // 提交评论
  handleComment() {
    const { saveMarkRecord, takeoutDetail } = this.props;
    const scoreInfo = {
      shopId: `${shopId}`,
      tradeId: takeoutDetail.orderId || 0,
      score: this.state.commentScore,
    };
    saveMarkRecord(scoreInfo, this.handleSuccessCallBack, this.handleFaildCallBack);
  },

  handleSuccessCallBack(data) {
    if (data.markSendCoupFlag) {
      if (data.coupSendOver) {
        this.setState({ errorMessage: '订单评分成功，优惠券已赠完' });
      } else {
        this.setState({ errorMessage: `订单评分成功，恭喜获得${data.sendCoupInfo}` });
      }
    } else {
      this.setState({ errorMessage: '订单评分成功' });
    }
    this.setState({ isCommentShow: false });
    this.props.getTakeoutDetail();
  },

  handleFaildCallBack(code, msg) {
    if (code === '70600') {
      this.setState({ errorMessage: '网络原因评分失败，请重新评分' });
    } else {
      this.setState({ isCommentShow: false });
      if (code === '70601') {
        this.setState({ errorMessage: '该订单已评分' });
      } else if (code === '706003') {
        this.setState({ errorMessage: '当前订单不支持评分' });
      } else {
        this.setState({ errorMessage: msg });
      }
    }
  },

  handleCancelComment() {
    this.setState({ isCommentShow: false, isCommentReadShow: false });
  },

  handleClearErrorMsg() {
    this.setState({ errorMessage: '' });
  },

  render() {
    const { takeoutDetail } = this.props;
    const {
      isCounponSmallShow,
      isCouponBigShow,
      errorMessage,
      isCommentShow,
      isCommentReadShow,
      commentScore,
    } = this.state;
    return (
      <div className="application takeout-page">
        <div className="flex-columns">
          <div className="flex-rest detail-content">
            <div className="order-status">
              <span className="order-status-title ellipsis">{takeoutDetail.status}</span>
              {this.getCommentBtn()}
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
                <span className="takeout-head-title">
                  {String(takeoutDetail.deliveryType) === '2' ? '送达时间' : '取餐时间'}
                </span>
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
                    <div className="list-item" key={index}>
                      <span className={`icon-privilege ellipsis icon-${Math.abs(item.privilegeType)}`}>{item.privilegeName}</span>
                      {item.privilegeValue && <span className="list-privilege-value">-{Math.abs(item.privilegeValue)}</span>}
                      <div className="fr list-privilege">-<span className="price">{Math.abs(item.privilegeAmount)}</span></div>
                    </div>
                  )
                }
                {
                  Boolean(takeoutDetail.carryRuleAmount) && (
                    <div className="list-item">
                      <span className="icon-privilege ellipsis icon-carry">自动抹零</span>
                      <div className="fr list-privilege">
                        -<span className="price">{Math.abs(takeoutDetail.carryRuleAmount)}</span>
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
              {Boolean(Math.abs(takeoutDetail.tradePrivilegeAmount)) &&
                <div className="list-statictis-item">
                  <span className="list-statictis-title">共优惠</span>
                  <span className="price ellipsis list-statictis-privilage">{Math.abs(takeoutDetail.tradePrivilegeAmount)}</span>
                </div>
              }
              <div className="list-statictis-item">
                <span className="list-statictis-title">总计:</span>
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
                onTouchTap={this.handlePayDetail}
              >结账</a>
            }
          </div>
        </div>
        {isCounponSmallShow && takeoutDetail.url &&
          <a className="coupon-content-small coupon-animation" href={takeoutDetail.url}></a>
        }
        {isCouponBigShow && takeoutDetail.url &&
          <div className="coupon-bg">
            <a className="coupon-content-close" onTouchTap={this.handleCloseCounpon}></a>
            <div className="coupon-content">
              <div className="coupon-img coupon-content-big"></div>
              <div className="coupon-content-tips">
                <span>客官！是你的优惠券~</span>
                <a className="coupon-content-btn " href={takeoutDetail.url}></a>
              </div>
            </div>
          </div>
        }
        {errorMessage &&
          <Toast errorMessage={errorMessage} clearErrorMsg={this.handleClearErrorMsg} />
        }
        {isCommentShow &&
          <ConfirmDialog
            onCancel={this.handleCancelComment}
            onConfirm={this.handleComment}
            cancelText={'取消'}
            confirmText={'提交'}
          >
            <div className="comment">
              <p className="comment-title">满意请给五星唷～</p>
              <div className="comment-content">
                <CommentStar
                  starTotal={5}
                  commentScore={commentScore}
                  onSelectStar={this.handleSelectStar}
                />
              </div>
            </div>
          </ConfirmDialog>
        }
        {isCommentReadShow &&
          <Dialog
            hasTopBtnClose={false}
            title={'已评分'}
            onClose={this.handleCancelComment}
            theme="sliver"
          >
            <div className="comment">
              <div className="comment-content">
                <CommentStar
                  starTotal={5}
                  commentScore={commentScore}
                  isReadOnly
                />
              </div>
              {takeoutDetail.markRecord4Order && takeoutDetail.markRecord4Order.sendCoupInfo &&
                <p className="comment-tips">
                  恭喜你获得{takeoutDetail.markRecord4Order.sendCoupInfo}，
                  <a href={`http://${location.host}/coupon/getCouponList?shopId=${shopId}`} className="comment-tips-href">去看看</a>
                </p>
              }
            </div>
          </Dialog>
        }
      </div>
    );
  },
});

const mapDispatchToProps = function getPropsFromAction(dispatch) {
  const actionObj = Object.assign({}, commonAction, takeoutAction);
  return bindActionCreators(actionObj, dispatch);
};

module.exports = connect(state => state, mapDispatchToProps)(TakeoutDetailApplication);
