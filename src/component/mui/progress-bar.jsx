const React = require('react');
require('./progress-bar.scss');
const classnames = require('classnames');

const ProgressBar = React.createClass({
  displayName: 'ProgressBar',
  propTypes:{
    isShowBar:React.PropTypes.bool.isRequired, // 进度条是否显示
    isShowZone:React.PropTypes.bool.isRequired, // 进度条组件是否显示
    zoneInfo:React.PropTypes.string.isRequired, // 请求数据的提示文字
    progressTimer:React.PropTypes.string.isRequired,  // 秒之后隐藏进度条
  },
  getInitialState() {
    return {
      animateBar:'', // 进度条动画类名
      timerLimit:true, // 时间限制 2秒钟隐藏进度条
    };
  },
  componentWillMount() {},
  componentDidMount() {},
  componentWillReceiveProps(nextProps) {
    if (!nextProps.isShowZone) {
      this.setState({ animateBar:'', timerLimit:true }, () => {
        clearTimeout(this._timer);
      });
    } else if (nextProps.isShowZone && nextProps.isShowZone !== this.props.isShowZone) {
      this.setState({ animateBar:'animation' + nextProps.progressTimer }, () => {
        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
          this.setState({ timerLimit:false });
        }, nextProps.progressTimer);
      });
    }
  },
  fillBar() {
    const { zoneInfo, isShowBar } = this.props;
    const { animateBar, timerLimit } = this.state;

    return (
      <div className="progress">
        <div className="progress-holder">
          <p className={classnames('bar', { vh: !isShowBar || !timerLimit })}>
            <i className={`bar-inner bar-inner-${animateBar}`}></i>
          </p>
          <span>
            {zoneInfo}
          </span>
        </div>
      </div>
    );
  },
  render() {
    const { isShowZone } = this.props;
    let fillBar = this.fillBar();
    return (
      <div className={classnames({ vh: !isShowZone })}>{fillBar}</div>
    );
  },
});

module.exports = ProgressBar;
