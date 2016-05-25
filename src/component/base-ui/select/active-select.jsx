const React = require('react');
require('./active-select.scss');
const ActiveSelect = React.createClass({
  displayName: 'ActiveSelect',
  propTypes: {
    optionsData: React.PropTypes.array.isRequired,
    OptionComponent: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.string]).isRequired,
    onChange: React.PropTypes.func.isRequired,
  },
  onChange(evt, optionData) {
    this.props.onChange(evt, optionData);
  },
  renderOptions(optionsData, OptionComponent) {
    return optionsData.map(optionData => {
      const { label, ...props } = optionData;
      if (Object.prototype.toString.call(OptionComponent) === '[object String]') {
        return React.createElement(OptionComponent, Object.assign({}, { onClick:evt => this.onChange(evt, optionData) }, props), label);
      }
      return <OptionComponent {...props} optionData={optionData} onClick={evt => this.onChange(evt, optionData)} key={optionData.id} />;
    });
  },
  render() {
    const { optionsData, OptionComponent } = this.props;
    const optionElements = this.renderOptions(optionsData, OptionComponent);
    return (
      <div className="active-select">
        <div className="optionsData-wrapper">
          {optionElements}
        </div>
      </div>
    );
  },
});

module.exports = ActiveSelect;

// componentDidMount() {
//   DOM.on(document, 'keydown', this.handleKeyDown);
// },
// componentWillUpdate(nextProps) {
//   if (this.props.optionsData !== nextProps.optionsData) {
//     this.setState({
//       optionsData : nextProps.optionsData,
//     });
//   }
// },
// componentWillUnmount() {
//   DOM.off(document, 'keydown', this.handleKeyDown);
// },
// handleKeyDown(event) {
//   switch (event.keyCode) {
//     case 8: // backspace
//       return;
//     case 13: // enter
//       event.stopPropagation();
//       this.selectOption(this.state.focusedOption.value);
//       break;
//     case 32: // space bar
//       break;
//     case 27: // escape
//       break;
//     case 38: // up
//       this.focusAdjacentOption('previous');
//       break;
//     case 40: // down
//       this.focusAdjacentOption('next');
//       break;
//     default:
//       return;
//   }
//   event.preventDefault();
// },
// focusAdjacentOption(dir) {
//   const optionsData = this.props.optionsData;
//   let focusedIndex = -1;
//   let focusedOption = optionsData[0];
//
//   for (let i = 0; i < optionsData.length; i++) {
//     if (this.state.focusedOption === optionsData[i]) {
//       focusedIndex = i;
//       break;
//     }
//   }
//   if (dir === 'next' && focusedIndex > -1 && focusedIndex < optionsData.length - 1) {
//     focusedOption = optionsData[focusedIndex + 1];
//   } else if (dir === 'previous') {
//     if (focusedIndex > 0) {
//       focusedOption = optionsData[focusedIndex - 1];
//     } else {
//       focusedOption = optionsData[optionsData.length - 1];
//     }
//   }
//   this.setState({ focusedOption });
// },
