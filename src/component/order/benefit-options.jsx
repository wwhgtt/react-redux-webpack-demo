const React = require('react');
const _find = require('lodash.find');

require('./benefit-options.scss');

module.exports = React.createClass({
  displayName: 'BenefitOptions',
  propTypes: {
    benefitProps:React.PropTypes.array.isRequired,
    onSelectBenefit:React.PropTypes.func.isRequired,
    dish:React.PropTypes.object.isRequired,
    serviceProps:React.PropTypes.object.isRequired,
  },
  onSelectBenefit(evt) {
    const { onSelectBenefit, dish } = this.props;
    onSelectBenefit(dish.id);
    evt.preventDefault();
  },
  buildBenefitName(benefit) {
    const { dish } = this.props;
    // const isDiscountDish = _find(serviceProps.discountProps.discountList, discount => discount.dishId === dish.id);
    if (benefit) {
      return benefit.priName;
    }
    if (dish.isMember) {
      return dish.noUseDiscount ? '不享受优惠' : '会员价';
    }
    return '不享受优惠';
  },
  render() {
    const { benefitProps } = this.props;
    let chosenBenefit = _find(benefitProps, prop => prop.isChecked);
    return (
      <div className="benefit-banner clearfix">
        {benefitProps ?
          <div className="fl">
            <span className="benefit-badge">优惠</span>
            <span className="benefit-text">{this.buildBenefitName(chosenBenefit)}</span>
          </div>
          :
          false
        }
        <button className="benefit-btn btn--ellips fr" onTouchTap={evt => this.onSelectBenefit(evt)}>切换优惠</button>
      </div>
    );
  },
});
