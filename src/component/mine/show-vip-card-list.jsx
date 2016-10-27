const React = require('react');
const config = require('../../config');
const commonHelper = require('../../helper/common-helper');

const shopId = commonHelper.getUrlParam('shopId');
const classnames = require('classnames');
require('./show-vip-card-list.scss');
const VipCurrentRights = require('./get-vip-current-rights.jsx');

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
  render() {
    const { memberInfo, userInfo } = this.props;
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
              <span className={classnames('arrow', { 'arrow-up':!arrowUp, 'arrow-down':arrowUp })}></span>
            </a>
          </div>
        </div>
        <div className={classnames('tq-outer of', { 'tq-outer-hide': arrowUp, 'tq-outer-show': !arrowUp })}>
          <VipCurrentRights grownCfg={memberInfo.grownCfg} levelRights={memberInfo.levelRights} />
        </div>
      </div>
    );
  },
});
