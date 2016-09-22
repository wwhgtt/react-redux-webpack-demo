const React = require('react');
require('./service-bell.scss');
const Hammer = require('react-hammerjs');
const ProgressHolder = require('../../mui/progress-bar.jsx');

const QuickMenu = React.createClass({
  displayName: 'QuickMenu',
  propTypes:{
    callColor:React.PropTypes.string,
    animate:React.PropTypes.string,
    callBell:React.PropTypes.func.isRequired,
    clearBell:React.PropTypes.func.isRequired,
    callMsg:React.PropTypes.object.isRequired,
    isMenu:React.PropTypes.bool.isRequired,
    canCall:React.PropTypes.bool.isRequired,
    timerStatus:React.PropTypes.bool.isRequired,
  },
  getInitialState() {
    return {
      timerStatus:false,
      endStatus:false,
      isShow:false,
      options:{
        touchAction:'compute',
        recognizers: {
          press: {
            time: '2000',
          },
          pan: {
            threshold: 0,
          },
        },
      },
    };
  },
  componentWillMount() {},
  componentDidMount() {},
  componentWillReceiveProps(nextProps) {
    this.setState({ timerStatus: nextProps.timerStatus });
    if (nextProps.canCall && nextProps.canCall !== this.props.canCall) {
      this.setState({ endStatus:true });
      this._timer = setTimeout(() => {
        this.setState({ isShow:false, endStatus:false });
      }, 1000);
    }
  },
  // 呼叫
  getMethod(callColor, callGray) {
    const { options, endStatus } = this.state;
    const { animate, isMenu } = this.props;
    // animateBar 60秒间隔
    const timer = 60;
    if (!callColor && !endStatus) {
      return (
        <Hammer
          onPan={this.hideProgressBar}
          onTouchStart={this.callBegin}
          onTouchEnd={this.callEnd}
          onPress={() => this.callPress(timer)}
          options={options}
        >
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
  hideProgressBar() {
    this.callEnd();
  },
  callBegin(e) {
    e.preventDefault();
    const { timerStatus } = this.state;
    const { callMsg, clearBell, canCall } = this.props;
    if (!canCall) {
      return;
    }
    if (!callMsg.callStatus || !timerStatus) {
      clearBell('按住发送');
    }
    this.setState({ isShow:true });
  },
  callEnd() {
    const { canCall } = this.props;
    if (!canCall) {
      return;
    }
    this.setState({ isShow:false });
  },
  callPress(timer) {
    const { timerStatus } = this.state;
    const { callBell, canCall } = this.props;
    if (!canCall) {
      return;
    }
    if (!timerStatus) {
      callBell(timer);
    }
  },
  render() {
    const { isShow, timerStatus } = this.state;
    const { callColor, callMsg } = this.props;
    const callGray = callColor || timerStatus ? 'call-bell-gray' : '';
    const method = this.getMethod(callColor, callGray);

    let isShowBar = true;
    if (isShow) {
      if (timerStatus && callMsg.callStatus) {
        isShowBar = false;
      } else {
        isShowBar = true;
      }
    }

    return (
      <div>
        {method}
        <ProgressHolder
          isShowZone={isShow}// 是否显示区域
          isShowBar={isShowBar}// 是否显示进度条
          progressTimer={this.state.options.recognizers.press.time}// 进度条存在时间
          zoneInfo={callMsg.info} // 区域文字信息
        />
      </div>
    );
  },
});

module.exports = QuickMenu;
