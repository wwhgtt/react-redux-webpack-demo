const React = require('react');
require('./sex-switch.scss');

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
  sexSwitch(sex, e) {
    const { changeSex } = this.props;
    changeSex({ sex });
  },
  render() {
    // this.setState({value: Info.name});
    const { sex } = this.props;
    return (
      <div className="sex-switch fr">
        <i className={sex === '0' ? 'active item' : 'item'} onTouchTap={() => this.sexSwitch('0')} ref="female">女士</i>
        <i className={sex === '1' ? 'active item' : 'item'} onTouchTap={() => this.sexSwitch('1')} ref="male">先生</i>
      </div>
    );
  },
});
