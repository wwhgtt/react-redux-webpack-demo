const React = require('react');
const classnames = require('classnames');
const _find = require('lodash.find');

const ActiveSelect = React.createClass({
  displayName: 'ActiveSelect',
  propTypes: {
    optionsData: React.PropTypes.array.isRequired,
    optionComponent: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.string]).isRequired,
    onSelectOption: React.PropTypes.func.isRequired,
    className: React.PropTypes.string,
    triggerElement:React.PropTypes.bool,
  },
  onSelectOption(evt) {
    const { optionsData, triggerElement } = this.props;
    if (triggerElement && !evt.target.getAttribute('data-trigger')) {
      return false;
    }

    const optionData = _find(optionsData, { id: typeof evt.currentTarget.getAttribute('data-id') === Number ?
      parseInt(evt.currentTarget.getAttribute('data-id'), 10)
      :
      evt.currentTarget.getAttribute('data-id'),
    });
    return this.props.onSelectOption(evt, optionData);
  },
  renderOptions(optionsData, optionComponent) {
    return optionsData.map(optionData => {
      const { label } = optionData;
      return React.createElement(optionComponent,
        Object.assign({}, { key:optionData.id, 'data-id':optionData.id, onTouchTap:this.onSelectOption }, optionData), label
      );
    });
  },
  render() {
    const { optionsData, optionComponent, className } = this.props;
    const optionElements = this.renderOptions(optionsData, optionComponent);
    return (
      <div className={classnames('active-select', className)}>
        <div className="optionsData-wrapper clearfix">
          {optionElements}
        </div>
      </div>
    );
  },
});

module.exports = ActiveSelect;
