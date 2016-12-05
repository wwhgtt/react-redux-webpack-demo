const React = require('react');
require('./switch-navi.scss');
const classnames = require('classnames');
const shallowCompare = require('react-addons-shallow-compare');

const SwitchNavi = React.createClass({
  displayName: 'SwitchNavi',
  propTypes:{
    navis:React.PropTypes.array.isRequired,
    getIndex:React.PropTypes.func.isRequired,
    activeTab : React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
  },
  getInitialState() {
    return {
      activeNum: -1,
      activeItem: '',
    };
  },

  componentWillMount() {},
  componentDidMount() {},
  componentWillReceiveProps(nextProps) {
    const { activeTab } = nextProps;
    if (typeof(activeTab) === 'number' || activeTab === 0) {
      this.setState({ activeNum : activeTab, activeItem: '' });
    } else if (activeTab && typeof(activeTab) === 'string') {
      this.setState({ activeItem : activeTab, activeNum: -1 });
    }
  },

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
  switchTo(index, item) {
    const { getIndex } = this.props;
    this.setState({ activeNum:index, activeItem: item });
    getIndex(index, item);
  },
  render() {
    const { navis } = this.props;
    const { activeNum, activeItem } = this.state;
    return (
      <div className="navi-switch flex-row">
        {
          navis.map((item, index) => (
            <div
              key={index}
              className={classnames('navi-switch-item flex-rest', { active:activeNum === index || activeItem === item })}
              onTouchTap={() => this.switchTo(index, item)}
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
