const React = require('react');
const config = require('../../config');
const classnames = require('classnames');
const commonHelper = require('../../helper/common-helper');
const shallowCompare = require('react-addons-shallow-compare');

const shopId = commonHelper.getUrlParam('shopId');
const growthValueURL = `${config.growthValueURL}?shopId=${shopId}`;

require('./show-vip-process.scss');

module.exports = React.createClass({
  displayName: 'ShowVipProcess',
  propTypes:{
    grownLevelInfo:React.PropTypes.object.isRequired,
    getIndex:React.PropTypes.func.isRequired,
  },
  getInitialState() {
    return { arrowPosition:'' };
  },
  componentWillMount() {},
  componentDidMount() {},
  componentWillReceiveProps(nextProps) {},
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
  needGrownValueFontSize(length) {
    if (length > 4) {
      return { fontSize:`${4 / length * 2}em` };
    }
    return { fontSize:'2em' };
  },
  switchLevel(index) {
    const { getIndex } = this.props;
    // 箭头位置
    this.setState({ arrowPosition:this.perWidth * (index + 1) - this.perWidth / 2 + '%' }, () => {
      getIndex(index);
    });
  },
  vipFormat() {
    const { grownLevelInfo } = this.props;
    if (grownLevelInfo.levelList && grownLevelInfo.levelList.length !== 0) {
      const length = grownLevelInfo.levelList.length;
      this.perWidth = 100 / length;
      const grounValue = grownLevelInfo.grounValue;
      return (
        <ul className="process-ul flex-row">
          {
            grownLevelInfo.levelList.map((item, index) => {
              let lineWidth = '0%';
              const name = item.name;
              const needGrownValue = item.needGrownValue;
              const needGrownValueFontSize =
                item.needGrownValue ?
                  this.needGrownValueFontSize(item.needGrownValue.toString().length)
                :
                  { fontSize:'2em' };
              let active = false;
              let fakeActive = false;
              if (grounValue >= needGrownValue) {
                active = true;
                lineWidth = '100%';
                if (index === this.lastnum) {
                  fakeActive = true;
                  this.curPosition = `${this.perWidth * (index + 1) - this.perWidth / 2}%`;
                  if (grownLevelInfo.levelList[index + 1]) {
                    lineWidth =
                      `${(grounValue - needGrownValue) /
                      (grownLevelInfo.levelList[index + 1].needGrownValue - needGrownValue) * 100}%`;
                  } else {
                    lineWidth = '100%';
                  }
                }
              }
              return (
                <li className={classnames('process-li flex-rest', { active, fakeActive })} key={index} onTouchTap={() => this.switchLevel(index)}>
                  <div className="process-num"><span className="process-num-value" style={needGrownValueFontSize}>{needGrownValue}</span></div>
                  <div className="process-li-line">
                    <div className={classnames('active', { hide:lineWidth === '0%' })} style={{ width:lineWidth }}></div>
                  </div>
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
          <a href={growthValueURL} className="vip-value-link">查看明细></a>
        </p>
      </div>
    );
  },
  render() {
    const vipLevel = this.vipLevel();
    const vipFormat = this.vipFormat();
    const { arrowPosition } = this.state;
    // return
    return (
      <div className="vip-process-outer of">
        {vipLevel}
        <div className="line"></div>
        <div className="vip-process">
          {vipFormat}
        </div>
        <div className="triangle-outer">
          <div className="triangle triangle-up triangle-absolute" style={{ left:arrowPosition || this.curPosition }}></div>
        </div>
      </div>
    );
  },
});
