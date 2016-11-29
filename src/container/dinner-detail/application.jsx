const React = require('react');
const connect = require('react-redux').connect;
const classnames = require('classnames');
const dinnerDetailAction = require('../../action/order-detail/dinner-detail.js');
const commonHelper = require('../../helper/common-helper.js');
const dateUtility = require('../../helper/common-helper.js').dateUtility;
const ConfirmDialog = require('../../component/mui/dialog/confirm-dialog.jsx');
const Dialog = require('../../component/mui/dialog/dialog.jsx');

require('../../asset/style/style.scss');

const DishDetail = require('../../component/order-detail-uncheck/dish-detail.jsx');
const DiningOptions = require('../../component/order/dining-options.jsx');
const CommentStar = require('../../component/order-detail/comment-star.jsx');
require('../../component/order-detail/dish-detail.scss');
require('../../component/order-detail/common.scss');
require('./application.scss');

const shopId = commonHelper.getUrlParam('shopId');
const shopLogoDefault = require('../../asset/images/logo_default.svg');
const listEntry = commonHelper.getUrlParam('listEntry');

const DinnerDetailApplication = React.createClass({
  displayName: 'DinnerDetailApplication',
  propTypes: {
    dinnerDetail: React.PropTypes.object,
    getDinnerDetail: React.PropTypes.func,
  },

  getInitialState() {
    return {
      countDown: 0,
      isCouponBigShow: false,
      isCounponSmallShow: false,
      commentScore: 0,
      isCommentShow: false,
      isCommentReadShow: false,
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

    if (dinnerDetail.markRecord4Order) {
      this.setState({ commentScore:  dinnerDetail.markRecord4Order.score });
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
          setTimeout(() => { this.props.getDinnerDetail(); }, 2000);
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

  // 评分按钮
  getCommentBtn() {
    const { dinnerDetail } = this.props;
    let commentBtn = '';
    if (dinnerDetail.markRecord4Order) {
      if (dinnerDetail.markRecord4Order.supportMark) {
        if (dinnerDetail.markRecord4Order.markSendCoupFlag) {
          commentBtn = (<a className="order-status-comment" onTouchTap={this.showComment}>评分领券</a>);
        } else {
          commentBtn = (<a className="order-status-comment" onTouchTap={this.showComment}>我要评分</a>);
        }
      } else if (dinnerDetail.markRecord4Order.score > 0) {
        commentBtn = (<a className="order-status-comment" onTouchTap={this.showCommentRead}>我的评分</a>);
      }
    }

    return commentBtn;
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
    const { dinnerDetail } = this.props;
    const returnUrl =
      encodeURIComponent(`http://${location.host}/order/orderallDetail?shopId=${shopId}&orderId=${dinnerDetail.orderId}&listEntry=true`);
    sessionStorage.setItem('rurl_payDetaill', JSON.stringify(returnUrl));
    location.href = `http://${location.host}/shop/payDetail?shopId=${shopId}&orderId=${dinnerDetail.orderId}&orderType=WM`;
  },

  // 选星星
  handleSelectStar(i) {
    this.setState({ commentScore: i + 1 });
  },

  // 提交评论
  handleComment() {
    console.log(this.state.commentScore);
  },

  handleCancelComment() {
    this.setState({ isCommentShow: false, isCommentReadShow: false });
  },

  render() {
    const { dinnerDetail } = this.props;
    const {
      isCounponSmallShow,
      isCouponBigShow,
      commentScore,
      isCommentReadShow,
      isCommentShow,
    } = this.state;

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
              {this.getCommentBtn()}
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
            {dinnerDetail.extraFee && dinnerDetail.extraFee.length > 0 &&
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
            }
            {dinnerDetail.tradePrivileges && dinnerDetail.tradePrivileges.length > 0 &&
              <div className="list-default option-privilege">
                {
                  dinnerDetail.tradePrivileges && dinnerDetail.tradePrivileges.map((item, index) =>
                    <div className="list-item" key={index}>
                      <span className={`icon-privilege ellipsis icon-${Math.abs(item.privilegeType)}`}>{item.privilegeName}</span>
                      {item.privilegeValue && <span className="list-privilege-value">-{Math.abs(item.privilegeValue)}</span>}
                      <div className="fr list-privilege">-<span className="price">{Math.abs(item.privilegeAmount)}</span></div>
                    </div>
                  )
                }
                {
                  Boolean(dinnerDetail.carryRuleAmount) && (
                    <div className="list-item">
                      <span className="icon-privilege ellipsis icon-carry">自动抹零</span>
                      <div className="fr">
                        -<span className="price">{Math.abs(dinnerDetail.carryRuleAmount)}</span>
                      </div>
                    </div>
                  )
                }
              </div>
            }
            <div className="list-statictis">
              <div className="list-statictis-item">
                <span className="list-statictis-title">原价</span>
                <span className="price ellipsis list-statictis-origin">{this.getOriginPrice()}</span>
              </div>
              <div className="list-statictis-item">
                <span className="list-statictis-title">共优惠</span>
                <span className="price ellipsis list-statictis-privilage">{Math.abs(dinnerDetail.tradePrivilegeAmount || 0)}</span>
              </div>
              <div className="list-statictis-item">
                <span className="list-statictis-title">总计:</span>
                <span className="price ellipsis list-statictis-total">{dinnerDetail.tradeAmount}</span>
              </div>
            </div>
            <p className="list-other">其他信息</p>
            <div className="option-group">
              <div className="list-default">
                <div className="list-item">
                  <span className="list-item-title">下单时间</span>
                  <span className="list-item-content">{dateUtility.format(new Date(dinnerDetail.dateTime || 0), 'yyyy/MM/dd HH:mm')}</span>
                </div>
                <div className="list-item">
                  <span className="list-item-title">订单编号</span>
                  <span className="list-item-content ellipsis">{dinnerDetail.orderNumber}</span>
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
          <div className="btn-oparate flex-none clearfix">
            <a
              className={
                classnames('btn-oparate-more fl',
                  { 'width-full': dinnerDetail.businessType === 3 || !(dinnerDetail.status === '订单待支付' || dinnerDetail.status === '订单支付失败') }
                )
              }
              href={`http://${location.host}/orderall/selectDish?shopId=${shopId}&type=TS`}
            >再来一单</a>
            {dinnerDetail.businessType === 1 && (dinnerDetail.status === '订单待支付' || dinnerDetail.status === '订单支付失败') &&
              <a
                onTouchTap={this.handlePayDetail}
                className="btn-oparate-count fl"
              >结账</a>
            }
          </div>
        </div>
        {isCounponSmallShow && dinnerDetail.url &&
          <a className="coupon-content-small coupon-animation" href={dinnerDetail.url}></a>
        }
        {isCouponBigShow && dinnerDetail.url &&
          <div className="coupon-bg">
            <a className="coupon-content-close" onTouchTap={this.handleCloseCounpon}></a>
            <div className="coupon-content">
              <div className="coupon-img coupon-content-big"></div>
              <div className="coupon-content-tips">
                <span>客官！是你的优惠券~</span>
                <a className="coupon-content-btn " href={dinnerDetail.url}></a>
              </div>
            </div>
          </div>
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
              {dinnerDetail.markRecord4Order && dinnerDetail.markRecord4Order.sendCoupInfo &&
                <p className="comment-tips">
                  恭喜你获得{dinnerDetail.markRecord4Order.sendCoupInfo}，
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

const mapStateToProps = function (state) {
  return ({
    dinnerDetail: state.dinnerDetail,
  });
};

module.exports = connect(mapStateToProps, dinnerDetailAction)(DinnerDetailApplication);
