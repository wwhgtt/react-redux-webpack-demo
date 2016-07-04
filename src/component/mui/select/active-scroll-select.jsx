const _findIndex = require('lodash.findindex');
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
    const viewport = findDOMNode(this);
    const { optionsData, viewportHeight } = this.props;
    this.adjustViewportHeight(viewport, viewportHeight);
    this.applyIScrollPlugin(viewport);
    this.scrollToSelectedOption(optionsData);
  },
  componentDidUpdate() {
    this._cache.iScroll.refresh();
  },
  applyIScrollPlugin(viewport) {
    const iScroll = this._cache.iScroll = new IScroll(viewport, { snap:'[data-option]', probeType: 1 });
    iScroll.on('scrollEnd', () => console.log(iScroll.currentPage));
  },
  adjustViewportHeight(viewport, viewportHeight) { // We need to adjust the height of viewport according to the height of Option
    const optionElement = viewport.querySelector('[data-option]');
    if (optionElement) {
      viewport.style.height = `${optionElement.offsetHeight * viewportHeight}px`;
    }
  },
  scrollToSelectedOption(options) {
    const optionIdx = _findIndex(options, { isChecked: true });
    const cache = this._cache;
    if (optionIdx !== -1) {
      cache.iScroll.goToPage(0, optionIdx, 600);
    }
  },
  buildPlaceholderElement(viewportHeight) {
    const placeholderOffset = this._cache.placeholderOffset = viewportHeight / 2;
    const placeholders = [];
    for (let i = 1; i <= placeholderOffset; i++) {
      placeholders.push(<a key={`placeholder-${i}`} data-option="false" ></a>);
    }
    return (
      <div className="placeholder-container">
        {placeholders}
      </div>
    );
  },
  render() {
    const { className, viewportHeight, optionComponent, ...props } = this.props;
    const topPlaceholder = this.buildPlaceholderElement(viewportHeight);
    const bottomPlaceholder = this.buildPlaceholderElement(viewportHeight);
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
