const React = require('react');
const shallowCompare = require('react-addons-shallow-compare');

module.exports = React.createClass({
  displayName: 'BenefitPropOptionDuplicate',
  propTypes: {
    priName: React.PropTypes.string.isRequired,
    setActivityBenefit:React.PropTypes.func.isRequired,
    isChecked:React.PropTypes.bool,
  },
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
  render() {
    const { priName, setActivityBenefit, isChecked } = this.props;
    return (
      <label className="dialog-option" >
        <span className="dialog-option-title ellipsis">{priName}</span>
        <div className="dialog-option-tickbox">
          <input
            className="option-radio" type="radio" name="benefit" defaultValue="1"
            onChange={setActivityBenefit}
            defaultChecked={isChecked}
          />
          <span className="btn-tickbox"></span>
        </div>
      </label>
    );
  },
});
