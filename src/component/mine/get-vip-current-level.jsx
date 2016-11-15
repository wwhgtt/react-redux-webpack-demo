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
    if (grownLevelInfo.levelList && grownLevelInfo.levelList.length !== 0) {
      grownLevelInfo.levelList.forEach((item, index) => {
        if (switchIndex !== -1 && index === switchIndex) {
          rights = grownLevelInfo.levelRightsMap[item.id];
          rightsCfg = grownLevelInfo.grownCfgMap[item.id];
          this.name = item.name;
        }
        if (switchIndex === -1) {
          if (item.needGrownValue <= grownLevelInfo.grounValue) {
            rights = grownLevelInfo.levelRightsMap[item.id];
            rightsCfg = grownLevelInfo.grownCfgMap[item.id];
            this.name = item.name;
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
