const React = require('react');
const classnames = require('classnames');

const ActiveSelect = React.createClass({
  displayName: 'ActiveSelect',
  propTypes: {
    optionsData: React.PropTypes.array.isRequired,
    optionComponent: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.string]).isRequired,
    onSelectOption: React.PropTypes.func.isRequired,
    className: React.PropTypes.string,
  },
  onSelectOption(evt, optionData) {
    this.props.onSelectOption(evt, optionData);
  },
  renderOptions(optionsData, optionComponent) {
    return optionsData.map(optionData => {
      const { label } = optionData;
      return React.createElement(optionComponent,
        Object.assign({}, { key:optionData.id, onTouchTap:evt => this.onSelectOption(evt, optionData) }, optionData), label
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
