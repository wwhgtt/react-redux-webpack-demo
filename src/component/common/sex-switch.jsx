const React = require('react');
require('./sex-switch.scss');
const classnames = require('classnames');

module.exports = React.createClass({ // SexSwitch
  displayName: 'SexSwitch',
  propTypes:{
    sex:React.PropTypes.string.isRequired,
    changeSex:React.PropTypes.func.isRequired,
  },
  getInitialState() {
    return { sex: '' };
  },
  componentWillMount() {},
  componentDidMount() {},
  sexSwitch(sex) {
    const { changeSex } = this.props;
    changeSex({ sex });
  },
  render() {
    // this.setState({value: Info.name});
    const { sex } = this.props;
    return (
      <div className="sex-switch fl">
        <label onTouchTap={() => this.sexSwitch('0')} className="sex-switch-label">
          <span className={classnames('sex-switch-round', { active:sex === '0' })}></span>
          <i className="sex-switch-name">女士</i>
        </label>
        <label onTouchTap={() => this.sexSwitch('1')} className="sex-switch-label">
          <span className={classnames('sex-switch-round', { active:sex === '1' })}></span>
          <i className="sex-switch-name">先生</i>
        </label>
      </div>
    );
  },
});
