const _findIndex = require('lodash.findindex');
const React = require('react');
const { findDOMNode } = require('react-dom');
const shallowCompare = require('react-addons-shallow-compare');
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
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
  componentDidUpdate() {
    const { optionsData, viewportHeight } = this.props;
    const viewport = findDOMNode(this);
    this.adjustViewportHeight(viewport, viewportHeight);
    this._cache.iScroll.refresh();
    this.scrollToSelectedOption(optionsData);
  },
  applyIScrollPlugin(viewport) {
    const cache = this._cache;
    const iScroll = cache.iScroll = new IScroll(viewport, { snap:'[data-option]', probeType: 3, snapThreshold: 1 });
    iScroll.on('scrollEnd', () => {
      const { optionsData, onSelectOption } = this.props;
      if (!cache.autoScrolling) {
        setTimeout(() => onSelectOption(null, optionsData[iScroll.currentPage.pageY]), 50);
      }
      cache.autoScrolling = false;
    });
  },
  adjustViewportHeight(viewport, viewportHeight) { // We need to adjust the height of viewport according to the height of Option
    const optionElement = viewport.querySelector('[data-option]');
    if (optionElement) {
      // viewport.style.height = `${optionElement.offsetHeight * viewportHeight}px`;
      viewport.style.height = `${200}px`; // this is a temp fix for performance issue
    }
  },
  scrollToSelectedOption(options) {
    const optionIdx = _findIndex(options, { isChecked: true });
    const cache = this._cache;
    // debugger;
    if (optionIdx !== -1) {
      cache.iScroll.goToPage(0, optionIdx, 100);
    }
    cache.autoScrolling = true;
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
