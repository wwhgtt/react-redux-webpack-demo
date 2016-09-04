const React = require('react');

const BindWxInfo = React.createClass({
  propTypes: {
    wxInfo: React.PropTypes.object,
    onGetWXInfo: React.PropTypes.func,
    onBindWX: React.PropTypes.func,
  },

  getInitialState() {
    return {
      phoneNum: '',
    };
  },

  componentWillMount() {
    this.props.onGetWXInfo();
    const mobile = window.sessionStorage.getItem('mobile');
    this.setState({ phoneNum: mobile });
  },

  handleBindWX() {
    this.props.onBindWX();
  },

  render() {
    const { wxInfo } = this.props;
    return (
      <div className="bind-account mt20">
        <p>以下微信号将与手机号<span className="text-success">{this.state.phoneNum}</span>绑定</p>
        <div className="account-info">
          <div className="account-info-head">
            <img className="wx-head" alt="" src={wxInfo.headUrl} />
          </div>
          <p className="account-info-userName"><span>{wxInfo.name}</span></p>
        </div>
        <a className="btn account-btn btn--yellow" onTouchTap={this.handleBindWX}>绑定微信号</a>
      </div>
    );
  },
});

module.exports = BindWxInfo;
