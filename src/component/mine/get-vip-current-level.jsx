const React = require('react');

const VipCurrentRights = require('./get-vip-current-rights.jsx');

require('./get-vip-current-level.scss');

module.exports = React.createClass({
  displayName: 'GetVipCurrentLevel',
  propTypes:{
    grownLevelInfo:React.PropTypes.object.isRequired,
    switchIndex:React.PropTypes.number.isRequired,
  },
  getInitialState() {
    return {};
  },
  componentWillMount() {},
  componentDidMount() {},
  listContent() {
    const { grownLevelInfo, switchIndex } = this.props;
    let rights = {};
    let rightsCfg = {};
    if (grownLevelInfo.allLevelRuleVO && grownLevelInfo.allLevelRuleVO.length !== 0) {
      // 排序
      const grownLevelList = Array.prototype.slice.call(grownLevelInfo.allLevelRuleVO).sort((a, b) =>
        a.levelId > b.levelId
      );
      grownLevelList.forEach((item, index) => {
        if (switchIndex !== -1 && index === switchIndex) {
          rights = rightsCfg = item;
          this.name = item.levelName;
        }
        if (switchIndex === -1) {
          if (item.needGrownValue <= grownLevelInfo.curGrownValue) {
            rights = rightsCfg = item;
            this.name = item.levelName;
          }
        }
      });
    }
    return (
      <VipCurrentRights grownCfg={rightsCfg} levelRights={rights} />
    );
  },
  render() {
    const listContent = this.listContent();
    // return
    return (
      <div className="vip-level">
        <p className="vip-level-name">{this.name}特权</p>
        {listContent}
      </div>
    );
  },
});
