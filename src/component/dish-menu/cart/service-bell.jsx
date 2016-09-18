const React = require('react');
require('./service-bell.scss');
const Hammer = require('react-hammerjs');
const ProgressBar = require('../../mui/progress-bar.jsx');

const QuickMenu = React.createClass({
  displayName: 'QuickMenu',
  propTypes:{
    call:React.PropTypes.string,
    animate:React.PropTypes.string,
    callBell:React.PropTypes.func.isRequired,
    clearBell:React.PropTypes.func,
    callMsg:React.PropTypes.object,
    isMenu:React.PropTypes.bool,
  },
  getInitialState() {
    return {
      timerStatus:false,
      options:{
        touchAction:'compute',
        recognizers: {
          press: {
            time: 3100,
          },
        },
      },
    };
  },
  componentWillMount() {},
  componentDidMount() {},
  // 呼叫
  getMethod(call, callGray) {
    const { options } = this.state;
    const { animate, isMenu } = this.props;
    // animateBar 60秒间隔
    const timer = 60;
    if (!call) {
      return (
        <Hammer onTouchStart={this.callBegin} onTouchEnd={this.callEnd} onPress={() => this.callPress(timer)} options={options}>
          <div className={isMenu ? `call-bell call-bell-${animate} ${callGray}` : 'call-bell'}>
            <i className="call-bell-inner"></i>
            <span className="detail">呼叫</span>
          </div>
        </Hammer>
      );
    }
    return (
      <Hammer>
        <div className={isMenu ? `call-bell call-bell-${animate} ${callGray}` : 'call-bell'}>
          <i className="call-bell-inner"></i>
          <span className="detail">呼叫</span>
        </div>
      </Hammer>
    );
  },
  callBegin(e) {
    e.preventDefault();
    const { timerStatus } = this.state;
    const { callMsg, clearBell } = this.props;
    if (!callMsg.callStatus || !timerStatus) {
      clearBell('按住发送');
    }
    this.setState({ isShow:true });
  },
  callEnd() {
    this.setState({ isShow:false });
  },
  callPress(timer) {
    const { timerStatus } = this.state;
    const { callBell } = this.props;
    if (!timerStatus) {
      // this.interValStatus(timer);
      // 在此处进行呼叫吧台的操作
      // ...
      callBell(timer, this);
    }
  },
  render() {
    const { isShow, timerStatus } = this.state;
    const { call, callMsg } = this.props;
    const callGray = call || timerStatus ? 'call-bell-gray' : '';
    const method = this.getMethod(call, callGray);
    return (
      <div>
        {method}
        <ProgressBar
          msg={callMsg}
          isShow={isShow}
          timerStatus={timerStatus}
        />
      </div>
    );
  },
});

module.exports = QuickMenu;
