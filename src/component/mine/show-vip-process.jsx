const React = require('react');
const classnames = require('classnames');
const config = require('../../config');
const commonHelper = require('../../helper/common-helper');
const shopId = commonHelper.getUrlParam('shopId');
const integralURL = `${config.integralURL}?shopId=${shopId}`;
require('./show-vip-process.scss');

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
  componentWillReceiveProps(nextProps) {},
  vipFormat() {
    const { grownLevelInfo } = this.props;
    if (grownLevelInfo.levelList && grownLevelInfo.levelList.length !== 0) {
      const grounValue = grownLevelInfo.grounValue;
      return (
        <ul className="process-ul flex-row">
          {
            grownLevelInfo.levelList.map((item, index) => {
              const name = item.name;
              const needGrownValue = item.needGrownValue;
              let active = false;
              let fakeActive = false;
              if (grounValue >= needGrownValue) {
                active = true;
                if (index === this.lastnum) {
                  fakeActive = true;
                }
              }
              return (
                <li className={classnames('process-li flex-rest', { active, fakeActive })} key={index}>
                  <div className="process-num">{needGrownValue}</div>
                  {name}
                </li>
              );
            })
          }
        </ul>
      );
    }
    return false;
  },
  vipLevel() {
    const { grownLevelInfo } = this.props;
    let name = '';
    let count = '';
    if (grownLevelInfo.levelList && grownLevelInfo.levelList.length !== 0) {
      grownLevelInfo.levelList.forEach((item, index) => {
        if (item.needGrownValue <= grownLevelInfo.grounValue) {
          name = item.name;
          count = `process-icon lv${index + 1}`;
          this.lastnum = index;
        }
      });
    }
    return (
      <div>
        <div className={count}></div>
        <h3 className="vip-name">{name}</h3>
        <p className="vip-value">
          成长值：{grownLevelInfo.grounValue}
          <a href={integralURL} className="vip-value-link">查看明细></a>
        </p>
      </div>
    );
  },
  render() {
    const vipLevel = this.vipLevel();
    const vipFormat = this.vipFormat();
    // return
    return (
      <div className="vip-process-outer of">
        {vipLevel}
        <div className="line"></div>
        <div className="vip-process">
          {vipFormat}
        </div>
      </div>
    );
  },
});
