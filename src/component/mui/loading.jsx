const React = require('react');
const loadingImageUrl = require('../../asset/images/load.gif');
require('./loading.scss');

module.exports = React.createClass({
  displayName: 'Loading',
  propTypes:{
    word: React.PropTypes.string,
  },
  getInitialState() {
    return {};
  },
  componentDidMount() {},
  render() {
    const { word } = this.props;
    return (
      <div className="loading-hover">
        <span className="span-null"></span>
        <div className="load-div">
          <img src={loadingImageUrl} alt="加载中" title="加载中" className="load-img" />
          <p className="load-word">{word}</p>
        </div>
        <span className="span-null"></span>
      </div>
    );
  },
});
