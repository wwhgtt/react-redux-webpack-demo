const React = require('react');
const { findDOMNode } = require('react-dom');
const classnames = require('classnames');
const IScroll = require('iscroll/build/iscroll-probe');
const ActiveSelect = require('./active-select.jsx');

require('../../../asset/style/style.scss');
require('./active-scroll-select.scss');

module.exports = React.createClass({
  displayName: 'ActiveScrollSelect',
  propTypes: {
    className:React.PropTypes.string.isRequired,
    ...ActiveSelect.propTypes,
  },
  componentDidMount() {
    const cache = this._cache = {};
    const iScroll = cache.iScroll = new IScroll(findDOMNode(this), { probeType: 2 });
    iScroll.on('scrollEnd', () => console.log(222));
  },
  render() {
    const { className, ...props } = this.props;
    return (
      <div className={classnames('scroll-select', className)}>
        <div className="scroll-select-header">
          <span>选择地区</span>
          <button className="scroll-select-confirm btn--yellow">确定</button>
        </div>
        <div className="scroll-select-content flex-row indicator-box">
          <ActiveSelect className="scroll-select-column flex-rest" {...props} />
          <ActiveSelect className="scroll-select-column flex-rest" {...props} />
        </div>
      </div>
    );
  },

});
