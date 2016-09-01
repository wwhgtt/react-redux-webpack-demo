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
  componentWillReceiveProps(nextProps) {   // 接收props
    this.setState({ sex:nextProps.sex }); // 把props赋值给state(需要的值)
  },
  sex_switch(sexT, e) {
    this.setState({ sex: sexT }, () => this.commonMethod());
  },
  commonMethod() {
    // 回传值给component
    const { getSex } = this.props;
    getSex({ sex : this.state.sex });
  },
  render() {
    // this.setState({value: Info.name});
    const { sex } = this.state;
    return (
      <div className="sex-switch fr">
        <i className={sex === '0' ? 'active' : ''} onTouchTap={() => this.sex_switch('0')} ref="female">女士</i>
        <i className={sex === '1' ? 'active' : ''} onTouchTap={() => this.sex_switch('1')} ref="male">先生</i>
      </div>
    );
  },
});
