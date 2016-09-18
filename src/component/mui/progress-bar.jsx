const React = require('react');
require('./progress-bar.scss');

const ProgressBar = React.createClass({
  displayName: 'ProgressBar',
  propTypes:{
    msg:React.PropTypes.object,
    isShow:React.PropTypes.bool,
    timerStatus:React.PropTypes.bool,
  },
  getInitialState() {
    return {
      animateBar:'',
    };
  },
  componentWillMount() {},
  componentDidMount() {},
  componentWillReceiveProps(nextProps) {
    if (nextProps.isShow) {
      this.setState({ animateBar:'animation' });
    } else {
      this.setState({ animateBar:'' });
    }
  },
  fillBar() {
    const { timerStatus, msg } = this.props;
    const { animateBar } = this.state;
    let status = false;
    if (timerStatus && msg.callStatus) {
      status = true;
    } else {
      status = false;
    }
    return (
      <div className="progress">
        <span className="middle"></span>
        <div className="progress-holder">
          <p className={!status ? 'bar' : 'bar vh'}>
            <i className={`bar-inner bar-inner-${animateBar}`}></i>
          </p>
          <span>
            {msg.info}
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
