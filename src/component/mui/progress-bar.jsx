const React = require('react');
require('./progress-bar.scss');

const ProgressBar = React.createClass({
  displayName: 'ProgressBar',
  propTypes:{
    msgStatus:React.PropTypes.bool.isRequired,
    msgInfo:React.PropTypes.string.isRequired,
    isShow:React.PropTypes.bool.isRequired,
    timerStatus:React.PropTypes.bool.isRequired,
  },
  getInitialState() {
    return {
      animateBar:'',
      timerLimit:false,
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
      this.setState({ animateBar:'animation' }, () => {
        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
          this.setState({ timerLimit:true });
        }, 2000);
      });
    }
  },
  fillBar() {
    const { timerStatus, msgStatus, msgInfo, isShow } = this.props;
    const { animateBar, timerLimit } = this.state;
    let statusBar = false;

    if (isShow) {
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
