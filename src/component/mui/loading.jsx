const React = require('react');
require('./loading.scss');

module.exports = React.createClass({ // SexSwitch
  displayName: 'SexSwitch',
  propTypes:{
    word: React.PropTypes.string,
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
          <img src="../../../src/asset/images/load.gif" alt={word} title={word} className="load-img" />
          <p className="load-word">{word}</p>
        </div>
        <span className="span-null"></span>
      </div>
    );
  },
});
