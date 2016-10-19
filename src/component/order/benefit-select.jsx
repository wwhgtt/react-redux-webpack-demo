const React = require('react');
const _find = require('lodash.find');
const ActiveSelect = require('../mui/select/active-select.jsx');
const BenefitPropOption = require('./benefit-prop-option.jsx');
module.exports = React.createClass({
  displayName: 'BenefitSelect',
  propTypes: {
    dish:React.PropTypes.object.isRequired,
    setAcvitityBenefit:React.PropTypes.func.isRequired,
    serviceProps:React.PropTypes.object.isRequired,
  },
  componentDidMount() {

  },
  onSelectBenefit() {
    console.log(1234);
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
          <BenefitPropOption priName={'会员价'} priId={'discount'} priType={'discount'} />
          :
          false
        }
        <BenefitPropOption priName={'不享受优惠'} priId={'noBenefit'} priType={'no-benefit'} />
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
