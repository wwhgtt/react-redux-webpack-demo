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
  },
  onSelectOption(evt) {
    const { optionsData } = this.props;
    const optionData = _find(optionsData, { id: isNaN(evt.currentTarget.getAttribute('data-id')) ?
      evt.currentTarget.getAttribute('data-id')
      :
      parseInt(evt.currentTarget.getAttribute('data-id'), 10),
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
