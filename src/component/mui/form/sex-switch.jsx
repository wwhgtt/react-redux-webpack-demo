const React = require('react');
require('./sex-switch.scss');

module.exports = React.createClass({ // SexSwitch
  displayName: 'SexSwitch',
  propTypes:{
    sex:React.PropTypes.string,
    getSex:React.PropTypes.func,
  },
  getInitialState() {
    return { sex: '' };
  },
  componentWillMount() {},
  componentDidMount() {},
  sexSwitch(sex, e) {
    // 回传值给component
    const { getSex } = this.props;
    getSex({ sex });
  },
  render() {
    // this.setState({value: Info.name});
    const { sex } = this.props;
    return (
      <div className="sex-switch fr">
        <i className={sex === '0' ? 'active' : ''} onTouchTap={() => this.sexSwitch('0')} ref="female">女士</i>
        <i className={sex === '1' ? 'active' : ''} onTouchTap={() => this.sexSwitch('1')} ref="male">先生</i>
      </div>
    );
  },
});
