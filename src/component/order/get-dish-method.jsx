const React = require('react');
const classnames = require('classnames');
// const DynamicClassLink = require('../mui/misc/dynamic-class-hoc.jsx')('a');
const shallowCompare = require('react-addons-shallow-compare');
require('./get-dish-method.scss');
module.exports = React.createClass({
  displayName: 'GetDishMethod',
  propTypes: {
    serviceProps: React.PropTypes.object.isRequired,
    onSelectOption:React.PropTypes.func.isRequired,
  },
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
  onSelectOption(type) {
    const { onSelectOption } = this.props;
    let option = {
      id:'way-of-get-diner',
    };
    let prop = {
      id:'totable',
    };
    if (type === 'pickup') {
      onSelectOption(null, option);
    } else {
      onSelectOption(null, prop);
    }
  },
  render() {
    const { serviceProps } = this.props;
    return (
      <div className="option" style={{ padding:'10px 0 10px 10px' }}>
        <span className="option-dish">取餐方式</span>
        {serviceProps.serviceApproach && serviceProps.serviceApproach.indexOf('totable') >= 0 ?
          <span
            className={classnames('option-get-dish', { 'option-get-dish-checked':!serviceProps.isPickupFromFrontDesk.isChecked })}
            onTouchTap={evt => this.onSelectOption('totable')}
          >送餐到桌
          </span>
          :
          false
        }
        {serviceProps.serviceApproach && serviceProps.serviceApproach.indexOf('pickup') >= 0 ?
          <span
            className={classnames('option-get-dish', { 'option-get-dish-checked':serviceProps.isPickupFromFrontDesk.isChecked })}
            onTouchTap={evt => this.onSelectOption('pickup')}
          >
            前台自取
          </span>
          :
          false
        }
      </div>
    );
  },
});
