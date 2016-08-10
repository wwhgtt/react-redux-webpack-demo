const React = require('react');

module.exports = React.createClass({
  displayName: 'StandardAddrSelectSearchBox',
  propTypes:{
    placeholder: React.PropTypes.string,
    suggestVisible: React.PropTypes.bool,
    suggest: React.PropTypes.array,
    onUserInput: React.PropTypes.func,
    onSetSuggestVisible: React.PropTypes.func,
    onSelectComplete: React.PropTypes.func,
  },
  getDefaultProps() {
    return {
      placeholder: '请录入关键字',
      suggest: [],
    };
  },
  componentDidMount() {
  },
  handleChange(evt) {
    if (this.props.onUserInput) {
      this.props.onUserInput(evt.target.value.trim());
    }
  },
  handleInputClick(evt) {
    if (!this.props.suggest.length) {
      return;
    }

    if (this.props.onSetSuggestVisible) {
      this.props.onSetSuggestVisible();
    }
  },
  handleItemClick(evt) {
    if (!this.props.onSelectComplete) {
      return;
    }

    let target = evt.target;
    if (target.nodeName === 'span'.toUpperCase()) {
      target = target.parentNode;
    }

    const data = target.dataset;
    const pos = this.props.suggest[data.index];
    if (!pos) {
      return;
    }

    const ret = {
      title: pos.title,
      address: pos.address,
      point: {
        longitude: pos.point.lng.toString(),
        latitude: pos.point.lat.toString(),
      },
    };
    this.refs.input.value = pos.address;
    this.props.onSetSuggestVisible(false);
    this.props.onSelectComplete(ret);
  },
  render() {
    let items = this.props.suggest.map((item, index) => {
      const key = item.uid;
      return (
        <li key={key}>
          <a
            className="suggest-title"
            onClick={this.handleItemClick}
            data-index={index}
            data-name={item.title}
            data-latitude={item.point.lat}
            data-longitude={item.point.lng}
          >
            {item.title}
            <span>{item.address}</span>
          </a>
        </li>
      );
    });

    return (
      <div className="addrselect-search" ref="wrap">
        <input
          type="text"
          ref="input"
          placeholder={this.props.placeholder}
          onClick={this.handleInputClick}
          onChange={this.handleChange}
        />
        <ul className="suggest" style={{ display: this.props.suggestVisible ? 'block' : '' }}>
          {items}
        </ul>
      </div>
    );
  },
});
