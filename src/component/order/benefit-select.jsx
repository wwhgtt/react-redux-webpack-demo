const React = require('react');
const _find = require('lodash.find');
const BenefitPropOption = require('./benefit-prop-option.jsx');
const BenefitPropOptionDuplicate = require('./benefit-prop-option-duplicate.jsx');

require('./benefit-select.scss');

module.exports = React.createClass({
  displayName: 'BenefitSelect',
  propTypes: {
    dish:React.PropTypes.object.isRequired,
    setActivityBenefit:React.PropTypes.func.isRequired,
    serviceProps:React.PropTypes.object.isRequired,
    onSelectBenefit:React.PropTypes.func.isRequired,
  },
  componentDidMount() {

  },
  onSelectBenefit() {
    const { onSelectBenefit } = this.props;
    onSelectBenefit('closeWindow');
  },
  setActivityBenefit(evt, id) {
    const option = {
      id,
      dish:this.props.dish,
    };
    this.props.setActivityBenefit(evt, option);
  },
  buildBenefitDetail() {
    const { dish, setActivityBenefit, serviceProps } = this.props;
    const discountDish = _find(serviceProps.discountProps.discountList, discount => discount.dishId === dish.id);
    return (
      <div className="dialog-options-group">
        {dish.benefitOptions || (dish.order[0] && dish.order[0].benefitOptions) ?
          (dish.benefitOptions || dish.order[0].benefitOptions).map(benefitProp =>
            <BenefitPropOption setActivityBenefit={setActivityBenefit} benefitProp={benefitProp} key={benefitProp.priId} />)
          :
          false
        }
        {discountDish ?
          <BenefitPropOptionDuplicate
            priName={'会员价'}
            isChecked={!dish.noUseDiscount && !dish.noBenefit}
            setActivityBenefit={(evt) => this.setActivityBenefit(evt, 'discount')}
          />
          :
          false
        }
        <BenefitPropOptionDuplicate
          priName={'不享受优惠'}
          isChecked={dish.noBenefit}
          setActivityBenefit={(evt) => this.setActivityBenefit(evt, 'noBenefit')}
        />
      </div>
    );
  },
  render() {
    return (
      <div className="dialog-content">
        {this.buildBenefitDetail()}
        <button className="dialog-content-btn" onTouchTap={(evt) => { evt.preventDefault(); this.onSelectBenefit(); }}>确定</button>
      </div>
    );
  },
});
