const React = require('react');
const config = require('../../config');
const commonHelper = require('../../helper/common-helper');

const shopId = commonHelper.getUrlParam('shopId');
const classnames = require('classnames');
// const mid = commonHelper.getCookie('mid');


require('./show-vip-card-list.scss');

module.exports = React.createClass({
  displayName: 'Name',
  propTypes:{
    memberInfo:React.PropTypes.object,
    userInfo:React.PropTypes.object,
  },
  getInitialState() {
    return { arrowUp:true };
  },
  componentWillMount() {},
  componentDidMount() {},
  slideDown() {
    const arrowCondition = this.state.arrowUp;
    if (arrowCondition) {
      this.setState({ arrowUp:false });
    } else {
      this.setState({ arrowUp:true });
    }
  },
  grownPart() {
    const { memberInfo } = this.props;
    if (!memberInfo.grownCfg) { return false; }
    return (
      <p className="of">
        <i className="cube fl">◆</i>
        <span className="info of">
          每消费{memberInfo.grownCfg.grownConsumeGainValue || '0'}个积分可以获得{memberInfo.grownCfg.grownConsumeValue || '0'}点成长值
        </span>
      </p>
    );
  },
  scorePart() {
    const { memberInfo } = this.props;
    if (memberInfo.levelRights && memberInfo.levelRights.consumeValue && memberInfo.levelRights.consumeGainValue) {
      return (
        <p className="of">
          <i className="cube fl">◆</i>
          <span className="info of">
            每消费{memberInfo.levelRights.consumeValue}元获得{memberInfo.levelRights.consumeGainValue}个积分，
            {
              memberInfo.levelRights.isGainAll === 0 ?
                <span>全部商品可积分</span>
              :
                <span>无积分商品：{memberInfo.levelRights.dishNames}</span>
            }
          </span>
        </p>
      );
    }
    return false;
  },
  scoreExchange() {
    const { memberInfo } = this.props;
    if (memberInfo.levelRights) {
      const limitType = memberInfo.levelRights.limitType;
      let limitWord = '';
      if (limitType === 1) {
        limitWord = '积分使用无上限';
      } else if (limitType === 2) {
        limitWord = `单次最多可抵扣${memberInfo.levelRights.limitIntegral}个积分`;
      } else if (limitType === 3) {
        limitWord = `单次最多可抵用订单金额的${memberInfo.levelRights.discount}%`;
      }
      return (
        <p className="of">
          <i className="cube fl">◆</i>
          <span className="info of">
            {
              memberInfo.levelRights.isExchangeCash === 0 ?
                <span>
                  每{memberInfo.levelRights.exchangeIntegralValue}个积分可抵扣{memberInfo.levelRights.exchangeCashValue}元，
                  {limitWord}
                </span>
              :
                <span>不可低现</span>
            }
          </span>
        </p>
      );
    }
    return false;
  },
  render() {
    const { memberInfo, userInfo } = this.props;
    const grownPart = this.grownPart();
    const scorePart = this.scorePart();
    const scoreExchange = this.scoreExchange();
    const { arrowUp } = this.state;

    const grownLevelxURL = `${config.grownLevelxURL}?shopId=${shopId}`;
    const valueCardURL = `${config.valueCardURL}?shopId=${shopId}`;
    const integralURL = `${config.integralURL}?shopId=${shopId}`;

    return (
      <div className="list-group-outer">
        <div className="list-group">
          <div className="list-group-item" name="我的余额">
            <a className="list-group-link" href={valueCardURL}>
              <i className="icon" name="WDYE"></i>
              <span className="name">我的余额</span>
              <span className="brief">￥{userInfo.balance}</span>
              <span className="arrow arrow-right"></span>
            </a>
          </div>
          <div className="list-group-item" name="我的等级">
            <a className="list-group-link" href={grownLevelxURL}>
              <i className="icon" name="WDDJ"></i>
              <span className="name">我的等级</span>
              <span className="brief">{memberInfo.nowLevelName}</span>
              <span className="arrow arrow-right"></span>
            </a>
          </div>
          <div className="list-group-item" name="我的积分">
            <a className="list-group-link" href={integralURL}>
              <i className="icon" name="WDJF"></i>
              <span className="name">我的积分</span>
              <span className="brief">{userInfo.score}分</span>
              <span className="arrow arrow-right"></span>
            </a>
          </div>
          <div className="list-group-item" name="我的特权">
            <a className="list-group-link" href=" javascript:void(0)" onTouchTap={this.slideDown}>
              <i className="icon" name="WDTQ"></i>
              <span className="name">我的特权</span>
              <span className={classnames('arrow', { 'arrow-down':!arrowUp, 'arrow-up':arrowUp })}></span>
            </a>
          </div>
        </div>
        <div id="aaa" className={classnames('tq-detail of', { 'tq-detail-hide': arrowUp, 'tq-detail-show': !arrowUp })}>
          {scorePart}
          {scoreExchange}
          {grownPart}
        </div>
      </div>
    );
  },
});
