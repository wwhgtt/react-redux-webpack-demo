const React = require('react');
const shallowCompare = require('react-addons-shallow-compare');

module.exports = React.createClass({
  displayName: 'StandardAddrSelectListBox',
  propTypes:{
    list: React.PropTypes.array,
    onSelectComplete: React.PropTypes.func,
  },
  getDefaultProps() {
    return { list: [] };
  },
  componentDidMount() {
    this._now = new Date().getTime();
  },
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
  handleTouchTap(evt) {
    if (!this.props.onSelectComplete) {
      return;
    }

    const data = evt.currentTarget.dataset;
    const pos = this.props.list[data.index];
    if (!pos) {
      return;
    }

    const ret = {
      title: pos.title,
      address: pos.address,
      point: {
        longitude: pos.point.lng.toString(),
        latitude: pos.point.lat.toString() },
    };
    this.props.onSelectComplete(ret);
  },
  render() {
    let items = this.props.list.map((item, index) => {
      let title = item.title;
      if (index === 0) {
        title = `[推荐位置] ${title}`;
      }

      return (
        <li key={index}>
          <button data-index={index} className="addrselect-list-item" onTouchTap={this.handleTouchTap}>
            <h4 className="addrselect-list-title ellipsis">{title}</h4>
            <p className="addrselect-list-address ellipsis">{item.address}</p>
          </button>
        </li>
      );
    });

    return (
      <ul className="addrselect-list">
        {items}
      </ul>
    );
  },
});
