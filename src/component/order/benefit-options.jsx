const React = require('react');
module.exports = React.createClass({
  displayName: 'BenefitOptions',
  propTypes: {
    benefitProps:React.PropTypes.array.isRequired,
    onSelectBenefit:React.PropTypes.func.isRequired,
    dish:React.PropTypes.object.isRequired,
  },
  onSelectBenefit() {
    const { onSelectBenefit, dish } = this.props;
    onSelectBenefit(dish.id);
  },
  render() {
    const { benefitProps } = this.props;
    return (
      <div className="options">
        <div className="">
          {benefitProps ?
            <div className="benefit-prop">
              <span>优惠</span>
              <span>{benefitProps.filter(prop => prop.isChecked).priName || '不享受优惠'}</span>
            </div>
            :
            false
          }
          <button onTouchTap={this.onSelectBenefit}>切换优惠</button>
        </div>
      </div>
    );
  },
});
