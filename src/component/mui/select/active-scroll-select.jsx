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
    className:React.PropTypes.string,
    viewportHeight:React.PropTypes.number,
    ...ActiveSelect.propTypes,
  },
  getDefaultProps() {
    return {
      viewportHeight:5,
    };
  },
  componentWillMount() {
    this._cache = {};
  },
  componentDidMount() {
    const ViewportElement = findDOMNode(this);
    const { viewportHeight } = this.props;
    this.adjustViewportHeight(ViewportElement, viewportHeight);
  },
  componentDidUpdate() {

  },
  applyIScrollPlugin(ViewportElement) {
    const iScroll = this._cache.iScroll = new IScroll(ViewportElement, { probeType: 2 });
    iScroll.on('scrollEnd', () => console.log(222));
  },
  adjustViewportHeight(ViewportElement, viewportHeight) { // We need to adjust the height of viewport according to the height of Option
    const optionElement = ViewportElement.querySelector('[data-option]');
    ViewportElement.style.height = `${optionElement.offsetHeight * viewportHeight}px`;
  },
  buildPlaceholderElement(OptionComponent, viewportHeight) {
    const placeholderOffset = this._cache.placeholderOffset = viewportHeight / 2;
    const placeholders = [];
    for (let i = 1; i <= placeholderOffset; i++) {
      placeholders.push(<OptionComponent key={`placeholder-${i}`} data-placeholder />);
    }
    return (
      <div className="placeholder-container">
        {placeholders}
      </div>
    );
  },
  render() {
    const { className, viewportHeight, optionComponent, ...props } = this.props;
    const topPlaceholder = this.buildPlaceholderElement(optionComponent, viewportHeight);
    const bottomPlaceholder = this.buildPlaceholderElement(optionComponent, viewportHeight);
    return (
      <div className={classnames('scroll-select', className)}>
        <div className="scroll-wrapper">
          {topPlaceholder}
          <ActiveSelect optionComponent={optionComponent} {...props} />
          {bottomPlaceholder}
        </div>
      </div>
    );
  },

});
