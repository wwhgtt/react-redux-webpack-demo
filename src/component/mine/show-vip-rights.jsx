const React = require('react');
const config = require('../../config');
const commonHelper = require('../../helper/common-helper');
const shopId = commonHelper.getUrlParam('shopId');
const classnames = require('classnames');

require('./show-vip-rights.scss');
module.exports = React.createClass({
  displayName: 'ShowSettingList',
  propTypes:{
    grownLevelInfo:React.PropTypes.object.isRequired,
  },
  getInitialState() {
    return {};
  },
  componentWillMount() {},
  componentDidMount() {},
  grownPart(grownCfg) {
    if (!grownCfg) { return false; }
    return (
      <p className="of">
        <i className="cube fl">◆</i>
        <span className="info of">
          每消费{grownCfg.grownConsumeGainValue || '0'}个积分可以获得{grownCfg.grownConsumeValue || '0'}点成长值
        </span>
      </p>
    );
  },
  scorePart(levelRights) {
    if (levelRights && levelRights.consumeValue && levelRights.consumeGainValue) {
      return (
        <p className="of">
          <i className="cube fl">◆</i>
          <span className="info of">
            每消费{levelRights.consumeValue}元获得{levelRights.consumeGainValue}个积分，
            {
              levelRights.isGainAll === 0 ?
                <span>全部商品可积分</span>
              :
                <span>无积分商品：{levelRights.dishNames}</span>
            }
          </span>
        </p>
      );
    }
    return false;
  },
  scoreExchange(levelRights) {
    if (levelRights) {
      const limitType = levelRights.limitType;
      let limitWord = '';
      if (limitType === 1) {
        limitWord = '积分使用无上限';
      } else if (limitType === 2) {
        limitWord = `单次最多可抵扣${levelRights.limitIntegral}个积分`;
      } else if (limitType === 3) {
        limitWord = `单次最多可抵用订单金额的${levelRights.discount}%`;
      }
      return (
        <p className="of">
          <i className="cube fl">◆</i>
          <span className="info of">
            {
              levelRights.isExchangeCash === 0 ?
                <span>
                  每{levelRights.exchangeIntegralValue}个积分可抵扣{levelRights.exchangeCashValue}元，
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
  listContent() {
    const { grownLevelInfo } = this.props;
    let rights = '';
    let rightsCfg = '';
    if (grownLevelInfo.levelList && grownLevelInfo.levelList.length !== 0) {
      grownLevelInfo.levelList.forEach((item, index) => {
        if (item.needGrownValue <= grownLevelInfo.grounValue) {
          rights = grownLevelInfo.levelRightsMap[item.id];
          rightsCfg = grownLevelInfo.grownCfgMap[item.id];
        }
      });
    }

    const grownPart = this.grownPart(rightsCfg);
    const scorePart = this.scorePart(rights);
    const scoreExchange = this.scoreExchange(rights);

    return (
      <div>
        {scorePart}
        {scoreExchange}
        {grownPart}
      </div>
    );
  },
  render() {
    const { grownLevelInfo } = this.props;
    const listContent = this.listContent();
    // return
    return (
      <div className="vip-rights">
        <p className="vip-rights-name">{grownLevelInfo.nowLevelName}特权</p>
        <div className="tq-detail">
          {listContent}
        </div>
      </div>
    );
  },
});
