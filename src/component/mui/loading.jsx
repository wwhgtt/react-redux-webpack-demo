const React = require('react');
require('./loading.scss');

module.exports = React.createClass({ // SexSwitch
  displayName: 'loading',
  propTypes:{
    word:React.PropTypes.string.isRequired,
  },
  getInitialState() {
    return {};
  },
  componentWillMount() {},
  componentDidMount() {},
  componentWillReceiveProps(nextProps) {},
  render() {
    const { word } = this.props;
    return (
      <div className="loading-hover">
        <span className="span-null"></span>
        <div className="load-div">
          <img src="../../../src/asset/images/load.gif" alt="加载中" title="加载中" className="load-img" />
          <p className="load-word">{word}</p>
        </div>
        <span className="span-null"></span>
      </div>
    );
  },
});
