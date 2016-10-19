const React = require('react');
const _find = require('lodash.find');
const ActiveSelect = require('../mui/select/active-select.jsx');
const BenefitPropOption = require('./benefit-prop-option.jsx');
const BenefitPropOptionDuplicate = require('./benefit-prop-option-duplicate.jsx');
module.exports = React.createClass({
  displayName: 'BenefitSelect',
  propTypes: {
    dish:React.PropTypes.object.isRequired,
    setAcvitityBenefit:React.PropTypes.func.isRequired,
    serviceProps:React.PropTypes.object.isRequired,
    onSelectBenefit:React.PropTypes.func.isRequired,
  },
  componentDidMount() {

  },
  onSelectBenefit() {
    const { onSelectBenefit } = this.props;
    onSelectBenefit('closeWindow');
  },
  setAcvitityBenefit(evt, id) {
    const option = {
      id,
      dish:this.props.dish,
    };
    this.props.setAcvitityBenefit(evt, option);
  },
  buildBenefitDetail() {
    const { dish, setAcvitityBenefit, serviceProps } = this.props;
    const discountDish = _find(serviceProps.discountProps.discountList, discount => discount.dishId === dish.id);
    return (
      <div className="benefit-item">
        <ActiveSelect
          optionsData={dish.benefitOptions || dish.order[0].benefitOptions} onSelectOption={setAcvitityBenefit}
          optionComponent={BenefitPropOption}
        />
        {discountDish ?
          <BenefitPropOptionDuplicate priName={'会员价'} setAcvitityBenefit={(evt) => this.setAcvitityBenefit(evt, 'discount')} />
          :
          false
        }
        <BenefitPropOptionDuplicate priName={'不享受优惠'} setAcvitityBenefit={(evt) => this.setAcvitityBenefit(evt, 'noBenefit')} />
      </div>
    );
  },
  render() {
    return (
      <div className="options">
        <div className="">
          <p className="title">该商品可参加一下优惠</p>
          {this.buildBenefitDetail()}
          <button onTouchTap={() => this.onSelectBenefit()}>确定</button>
        </div>
      </div>
    );
  },
});
