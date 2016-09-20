const React = require('react');
require('./progress-bar.scss');

const ProgressBar = React.createClass({
  displayName: 'ProgressBar',
  propTypes:{
    msgStatus:React.PropTypes.bool.isRequired, // 请求数据的状态
    msgInfo:React.PropTypes.string.isRequired, // 请求数据的提示文字
    isShow:React.PropTypes.bool.isRequired, // 进度条组件是否显示
    timerStatus:React.PropTypes.bool, // 时间限制
    progressTimer:React.PropTypes.string.isRequired,  // 秒之后隐藏进度条
  },
  getInitialState() {
    return {
      animateBar:'', // 进度条动画类名
      timerLimit:false, // 时间限制 2秒钟隐藏进度条
    };
  },
  componentWillMount() {},
  componentDidMount() {},
  componentWillReceiveProps(nextProps) {
    if (!nextProps.isShow) {
      this.setState({ animateBar:'', timerLimit:false }, () => {
        clearTimeout(this._timer);
      });
    } else if (nextProps.isShow && nextProps.isShow !== this.props.isShow) {
      this.setState({ animateBar:'animation' + nextProps.progressTimer }, () => {
        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
          this.setState({ timerLimit:true });
        }, nextProps.progressTimer);
      });
    }
  },
  fillBar() {
    const { timerStatus, msgStatus, msgInfo, isShow } = this.props;
    const { animateBar, timerLimit } = this.state;
    let statusBar = false;

    // timerStatus 非必要prop
    if (isShow && timerStatus === undefined) {
      if (msgStatus) {
        statusBar = true;
      } else {
        statusBar = false;
      }
    } else if (isShow) {
      if (timerStatus && msgStatus) {
        statusBar = true;
      } else {
        statusBar = false;
      }
    }

    return (
      <div className="progress">
        <span className="middle"></span>
        <div className="progress-holder">
          <p className={!statusBar && !timerLimit ? 'bar' : 'bar vh'}>
            <i className={`bar-inner bar-inner-${animateBar}`}></i>
          </p>
          <span>
            {msgInfo}
          </span>
        </div>
        <span className="middle"></span>
      </div>
    );
  },
  render() {
    const { isShow } = this.props;
    let fillBar = this.fillBar();
    return (
      <div className={isShow ? '' : 'vh'}>{fillBar}</div>
    );
  },
});

module.exports = ProgressBar;
