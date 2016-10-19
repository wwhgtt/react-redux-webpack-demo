const React = require('react');
const ActiveSelect = require('../mui/select/active-select.jsx');
const benefitPropOption = require('./benefit-prop-option.jsx');
module.exports = React.createClass({
  displayName: 'BenefitSelect',
  propTypes: {
    dish:React.PropTypes.object.isRequired,
    setAcvitityBenefit:React.PropTypes.func.isRequired,
  },
  componentDidMount() {

  },
  onSelectBenefit() {
    console.log(1234);
  },
  buildBenefitDetail() {
    const { dish, setAcvitityBenefit } = this.props;
    return (
      <div className="benefit-item">
        <ActiveSelect
          optionsData={dish.benefitOptions || dish.order[0].benefitOptions} onSelectOption={setAcvitityBenefit}
          optionComponent={benefitPropOption}
        />
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
