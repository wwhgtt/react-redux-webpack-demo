const React = require('react');
require('./get-vip-current-level.scss');
const VipCurrentRights = require('./get-vip-current-rights.jsx');

module.exports = React.createClass({
  displayName: 'GetVipCurrentLevel',
  propTypes:{
    grownLevelInfo:React.PropTypes.object.isRequired,
  },
  getInitialState() {
    return {};
  },
  componentWillMount() {},
  componentDidMount() {},
  listContent() {
    const { grownLevelInfo } = this.props;
    let rights = {};
    let rightsCfg = {};
    if (grownLevelInfo.levelList && grownLevelInfo.levelList.length !== 0) {
      grownLevelInfo.levelList.forEach((item, index) => {
        if (item.needGrownValue <= grownLevelInfo.grounValue) {
          rights = grownLevelInfo.levelRightsMap[item.id];
          rightsCfg = grownLevelInfo.grownCfgMap[item.id];
        }
      });
    }
    return (
      <VipCurrentRights grownCfg={rightsCfg} levelRights={rights} />
    );
  },
  render() {
    const { grownLevelInfo } = this.props;
    const listContent = this.listContent();
    // return
    return (
      <div className="vip-level">
        <p className="vip-level-name">{grownLevelInfo.nowLevelName}特权</p>
        {listContent}
      </div>
    );
  },
});
