const React = require('react');
const _find = require('lodash.find');
const classnames = require('classnames');
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
    const { onSelectBenefit, dish, serviceProps } = this.props;
    if (serviceProps.wholeOrderBenefit && serviceProps.wholeOrderBenefit.isChecked) {
      return;
    }
    onSelectBenefit(dish.id);
    evt.preventDefault();
  },
  buildDiscountName(number) {
    if (number === 1) {
      return '';
    }
    return `满${number}份`;
  },
  buildBenefitName(benefit) {
    const { dish } = this.props;
    // const isDiscountDish = _find(serviceProps.discountProps.discountList, discount => discount.dishId === dish.id);
    if (benefit) {
      if (benefit.priType === 1) {
        return benefit.type === 1 ? benefit.priName : `${this.buildDiscountName(benefit.dishNum)}可享${benefit.discount}折`;
      }
      return `礼品券(${benefit.priName})`;
    }
    if (dish.isMember) {
      return dish.noUseDiscount ? '不享受优惠' : '会员价';
    }
    return '不享受优惠';
  },
  render() {
    const { benefitProps, dish, serviceProps } = this.props;
    let chosenBenefit = _find(benefitProps, prop => prop.isChecked);
    return (
      <div className="benefit-banner clearfix">
        {benefitProps ?
          <div className="fl">
            <span
              className={
                classnames('benefit-badge',
                  { 'benefit-grey':dish.noBenefit || (serviceProps.wholeOrderBenefit && serviceProps.wholeOrderBenefit.isChecked) }
                )}
            >优惠</span>
            <span className={classnames('benefit-text', { 'benefit-grey-text':dish.noBenefit })}>
              {this.buildBenefitName(chosenBenefit)}
            </span>
          </div>
          :
          false
        }
        <button
          className={
            classnames('benefit-btn btn--ellips fr',
              { 'benefit-btn-grey':serviceProps.wholeOrderBenefit && serviceProps.wholeOrderBenefit.isChecked }
            )}
          onTouchTap={evt => this.onSelectBenefit(evt)}
        >切换优惠</button>
      </div>
    );
  },
});
