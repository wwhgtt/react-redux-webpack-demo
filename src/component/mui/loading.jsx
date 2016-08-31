const React = require('react');
require('./loading.scss');

module.exports = React.createClass({ // SexSwitch
  displayName: 'SexSwitch',
  propTypes:{},
  getInitialState() {
    return {};
  },
  componentWillMount() {},
  componentDidMount() {},
  componentWillReceiveProps(nextProps) {},
  render() {
    return (
      <div className="loading-hover">
        <span className="span-null"></span>
        <img src="../../../src/asset/images/load.gif" alt="加载中" title="加载中" className="load-img" />
        <span className="span-null"></span>
      </div>
    );
  },
});
