const React = require('react');
const shallowCompare = require('react-addons-shallow-compare');

module.exports = React.createClass({
  displayName: 'BenefitPropOption',
  propTypes: {
    benefitProp: React.PropTypes.object.isRequired,
    setActivityBenefit: React.PropTypes.func.isRequired,
  },
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
  setActivityBenefit(evt, benefitProp) {
    const { setActivityBenefit } = this.props;
    setActivityBenefit(evt, benefitProp);
  },
  render() {
    const { benefitProp } = this.props;
    return (
      <label className="dialog-option">
        <span className="dialog-option-title ellipsis">{+benefitProp.priType === 2 ? `礼品券(${benefitProp.priName})` : benefitProp.priName}</span>
        <div className="dialog-option-tickbox">
          <input
            className="option-radio" type="radio" name="benefit" defaultValue="1"
            onChange={evt => this.setActivityBenefit(evt, benefitProp)}
            defaultChecked={benefitProp.isChecked}
          />
          <span className="btn-tickbox"></span>
        </div>
      </label>
    );
  },
});
