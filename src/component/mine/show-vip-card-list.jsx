const React = require('react');
const config = require('../../config');
const commonHelper = require('../../helper/common-helper');

const shopId = commonHelper.getUrlParam('shopId');
const classnames = require('classnames');
require('./show-vip-card-list.scss');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
const VipCurrentRights = require('./get-vip-current-rights.jsx');

module.exports = React.createClass({
  displayName: 'ShowVipCardList',
  propTypes:{
    memberInfo:React.PropTypes.object,
    userInfo:React.PropTypes.object,
  },
  getInitialState() {
    return { arrowUp:false };
  },
  componentWillMount() {},
  componentDidMount() {},
  slideDown(e) {
    e.preventDefault();
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
        {userInfo.loginType === 0 &&
          <div className="list-item" name="我的余额">
            <a className="list-link" href={valueCardURL}>
              <i className="list-icon" name="WDYE"></i>
              <span className="list-name">我的余额</span>
              <span className="list-brief price">{userInfo.balance}</span>
              <span className="list-arrow list-arrow-right"></span>
            </a>
          </div>
        }
          <div className="list-item" name="我的等级">
            <a className="list-link" href={grownLevelxURL}>
              <i className="list-icon" name="WDDJ"></i>
              <span className="list-name">我的等级</span>
              <span className="list-brief">{memberInfo.nowLevelName}</span>
              <span className="list-arrow list-arrow-right"></span>
            </a>
          </div>
          <div className="list-item" name="我的积分">
            <a className="list-link" href={integralURL}>
              <i className="list-icon" name="WDJF"></i>
              <span className="list-name">我的积分</span>
              <span className="list-brief">{userInfo.score}分</span>
              <span className="list-arrow list-arrow-right"></span>
            </a>
          </div>
          <div className="list-item" name="我的特权">
            <a className="list-link" href=" javascript:void(0)" onTouchTap={this.slideDown}>
              <i className="list-icon" name="WDTQ"></i>
              <span className="list-name">我的特权</span>
              <span className={classnames('list-arrow', { 'list-arrow-up':arrowUp, 'list-arrow-down':!arrowUp })}></span>
            </a>
          </div>
        </div>
        <ReactCSSTransitionGroup transitionName="slidedetail" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
          {
            arrowUp &&
              <div className="tq-outer">
                <VipCurrentRights grownCfg={memberInfo.grownCfg} levelRights={memberInfo.levelRights} />
              </div>
          }
        </ReactCSSTransitionGroup>
      </div>
    );
  },
});
