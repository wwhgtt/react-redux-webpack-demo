const React = require('react');
const { findDOMNode } = require('react-dom');
const classnames = require('classnames');
const IScroll = require('iscroll/build/iscroll-probe');
const ActiveSelect = require('./active-select.jsx');
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
        <div className="scroll-wrapper">
          <ActiveSelect {...props} />
        </div>
      </div>
    );
  },

});
