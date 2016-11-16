const React = require('react');
const shallowCompare = require('react-addons-shallow-compare');

const ListItem = require('../mui/list-item.jsx');

require('./get-vip-current-rights.scss');

module.exports = React.createClass({
  displayName: 'GetVipCurrentRights',
  propTypes:{
    grownCfg:React.PropTypes.object,
    levelRights:React.PropTypes.object,
  },
  getInitialState() {
    return {};
  },
  componentWillMount() {},
  componentDidMount() {},
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
  grownPart(grownCfg) {
    if (!grownCfg) { return false; }
    const content = `每消费${grownCfg.grownConsumeValue || '0'}元可获得${grownCfg.grownConsumeGainValue || '0'}点成长值`;
    return (
      <ListItem listContent={content} />
    );
  },
  scorePart(levelRights) {
    if (levelRights && levelRights.consumeValue && levelRights.consumeGainValue) {
      let content = `每消费${levelRights.consumeValue}元可获得${levelRights.consumeGainValue}个积分`;
      if (levelRights.isGainAll) {
        if (levelRights.isGainAll === 0) {
          content += '，全部商品可积分';
        } else {
          content += `，无积分商品：${levelRights.dishNames}`;
        }
      }
      return (
        <ListItem listContent={content} />
      );
    }
    return false;
  },
  scoreExchange(levelRights) {
    if (levelRights) {
      const limitType = levelRights.limitType;
      let limitWord = '';
      let content = '';
      if (limitType === 1) {
        limitWord = '积分使用无上限';
      } else if (limitType === 2) {
        limitWord = `单次最多可抵扣${levelRights.limitIntegral}个积分`;
      } else if (limitType === 3) {
        limitWord = `单次最多可抵用订单金额的${levelRights.discount}%`;
      }

      if (levelRights.isExchangeCash && levelRights.isExchangeCash !== 0) {
        content = `每${levelRights.exchangeIntegralValue}个积分可抵扣${levelRights.exchangeCashValue}元 ${limitWord}`;
      } else {
        content = '不可抵现';
      }
      return (
        <ListItem listContent={content} />
      );
    }
    return false;
  },
  render() {
    const { grownCfg, levelRights } = this.props;
    const grownPart = this.grownPart(grownCfg);
    const scorePart = this.scorePart(levelRights);
    const scoreExchange = this.scoreExchange(levelRights);
    // return
    return (
      <div className="tq-detail">
        {
          grownPart || scorePart || scoreExchange ?
            <div>
              {scorePart}
              {scoreExchange}
              {grownPart}
            </div>
          :
            <div className="noInfo">暂无</div>
        }
      </div>
    );
  },
});
