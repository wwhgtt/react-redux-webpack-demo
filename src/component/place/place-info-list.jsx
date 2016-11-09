const React = require('react');
require('./place-info-list.scss');

module.exports = React.createClass({ // ShowBasicInfo
  displayName: 'ShowBasicInfo',
  propTypes:{
    orderInfo:React.PropTypes.object,
  },
  getInitialState() {
    return {};
  },
  componentWillMount() { },
  componentDidMount() { },
  render() {
    // const { orderInfo } = this.props;
    return (
      <div className="options-group">
        <div className="option">
          <span className="option-title">
            订单编号
          </span>
          <span className="option-content">
            2016102300012
          </span>
        </div>
        <div className="option">
          <span className="option-title">
            预定时间
          </span>
          <span className="option-content">
            2016/10/23 18:00
          </span>
        </div>
        <div className="option">
          <span className="option-title">
            桌台类型
          </span>
          <span className="option-content">
            大厅区 2人桌
          </span>
        </div>
        <div className="option">
          <span className="option-title">
            预订人数
          </span>
          <span className="option-content">
            2人
          </span>
        </div>
        <div className="option">
          <span className="option-title">
            联系人
          </span>
          <span className="option-content">
            徐大宝宝
          </span>
        </div>
        <div className="option">
          <span className="option-title">
            联系方式
          </span>
          <span className="option-content">
            13398490896
          </span>
        </div>
        <div className="option">
          <span className="option-title">
            备注
          </span>
          <span className="option-content">
            鳗鱼饭多要一点
          </span>
        </div>
      </div>
    );
  },
});
