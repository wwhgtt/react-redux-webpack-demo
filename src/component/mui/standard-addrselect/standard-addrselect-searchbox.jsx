const React = require('react');
const classnames = require('classnames');

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
  getInitialState() {
    return {
      searchValueIsEmpty: true,
    };
  },
  componentDidMount() {
  },
  handleChange(evt) {
    const value = evt.target.value;
    if (this.props.onUserInput) {
      this.props.onUserInput(value.trim());
    }
    this.setState({ searchValueIsEmpty: !value });
  },
  handleInputClick(evt) {
    if (!this.props.suggest.length) {
      return;
    }

    if (this.props.onSetSuggestVisible) {
      this.props.onSetSuggestVisible();
    }
  },
  handleItemTouchTap(evt) {
    if (!this.props.onSelectComplete) {
      return;
    }

    const target = evt.currentTarget;
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
  handleBtnClose() {
    this.refs.input.value = '';
    if (this.props.onUserInput) {
      this.props.onUserInput('');
    }
    this.props.onSetSuggestVisible(false);
  },
  render() {
    let items = this.props.suggest.map((item, index) => (
      <li key={index}>
        <button
          className="addrselect-suggestion"
          onTouchTap={this.handleItemTouchTap}
          data-index={index}
          data-name={item.title}
          data-latitude={item.point.lat}
          data-longitude={item.point.lng}
        >
          {item.title}
          <small>{item.address}</small>
        </button>
      </li>
      ));

    return (
      <div className="addrselect-header" ref="wrap">
        <label className={classnames('addrselect-searchbox clearfix', { 'is-empty': this.state.searchValueIsEmpty })}>
          <span className="addrselect-search-icon"></span>
          <input
            type="text"
            ref="input"
            className="addrselect-search-input"
            placeholder={this.props.placeholder}
            onClick={this.handleInputClick}
            onChange={this.handleChange}
          />
          <button className="addrselect-search-close" onTouchTap={this.handleBtnClose}></button>
        </label>
        <ul className="addrselect-suggestions" style={{ display: this.props.suggestVisible ? 'block' : '' }}>
          {items}
        </ul>
      </div>
    );
  },
});
