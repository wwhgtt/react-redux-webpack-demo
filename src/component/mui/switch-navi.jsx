const React = require('react');
require('./switch-navi.scss');
const classnames = require('classnames');
const shallowCompare = require('react-addons-shallow-compare');

const SwitchNavi = React.createClass({
  displayName: 'SwitchNavi',
  propTypes:{
    navis:React.PropTypes.array.isRequired,
    getIndex:React.PropTypes.func.isRequired,
  },
  getInitialState() {
    return { activeNum:0 };
  },
  componentWillMount() {},
  componentDidMount() {},
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
  switchTo(index) {
    const { getIndex } = this.props;
    this.setState({ activeNum:index });
    getIndex(index);
  },
  render() {
    const { navis } = this.props;
    const { activeNum } = this.state;
    return (
      <div className="navi-switch flex-row">
        {
          navis.map((item, index) => (
            <div
              key={index}
              className={classnames('navi-switch-item flex-rest', { active:activeNum === index })}
              onTouchTap={() => this.switchTo(index)}
            >
              {item}
              <i className="line"></i>
            </div>
          ))
        }
      </div>
    );
  },
});

module.exports = SwitchNavi;
