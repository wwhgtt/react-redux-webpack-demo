const React = require('react');

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
  handleClick(evt) {
    if (!this.props.onSelectComplete) {
      return;
    }

    const data = evt.target.dataset;
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
    const now = this._now;
    let items = this.props.list.map((item, index) => {
      let title = item.title;
      if (index === 0) {
        title = `[推荐位置] ${name}`;
      }
      return (
        <li key={item.uid || (now + index)}>
          <button data-index={index} className="addrselect-list-item">
            <h4 className="addrselect-list-title ellipsis" onClick={this.handleClick}>{title}</h4>
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
