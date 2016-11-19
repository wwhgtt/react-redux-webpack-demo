const React = require('react');
const classnames = require('classnames');
const getCityList = require('../../../helper/city-helper.js').getCityList;

module.exports = React.createClass({
  displayName: 'StandardAddrSelectSearchBox',
  propTypes:{
    hotCityList: React.PropTypes.array,
    currentCity: React.PropTypes.object,
    placeholder: React.PropTypes.string,
    suggestVisible: React.PropTypes.bool,
    suggest: React.PropTypes.array,
    onUserInput: React.PropTypes.func,
    onSetSuggestVisible: React.PropTypes.func.isRequired,
    onSelectComplete: React.PropTypes.func,
    onCurrentCityChange: React.PropTypes.func,
  },
  getDefaultProps() {
    return {
      hotCityList: ['北京', '上海', '广州', '深圳', '天津', '杭州', '成都'],
      placeholder: '请录入关键字',
      suggest: [],
    };
  },
  getInitialState() {
    return {
      searchValueIsEmpty: true,
      cityPopupVisible: false,
    };
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.suggestVisible) {
      this.toggleCityPopup(false);
    }
  },
  getCityPopupElement() {
    const allCity = getCityList();
    const hotKeys = {};
    const firstCode = 'A'.charCodeAt(0);
    const hotCitys = [];
    const cityGroup = [];
    const groupNameletterCount = 6;
    const columnLength = 3;
    const maxCode = 'Z'.charCodeAt(0);

    this.props.hotCityList.forEach((name, index) => {
      hotKeys[name] = index;
    });

    allCity.forEach((city, i) => {
      const currentCode = city.pinyin.charCodeAt(0);
      if (hotKeys.hasOwnProperty(city.name)) {
        Object.assign(city, { hotIndex : hotKeys[city.name] });
        hotCitys.push(city);
      }

      const index = Math.floor((currentCode - firstCode) / groupNameletterCount);
      const group = cityGroup[index] || [];
      group.push(city);
      cityGroup[index] = group;
    });
    hotCitys.sort((a, b) => a.hotIndex - b.hotIndex);

    const getGroupName = (index) => {
      const letters = [];
      const start = index * groupNameletterCount;
      for (let i = 0; i < groupNameletterCount; i++) {
        const code = start + i + firstCode;
        if (code > maxCode) {
          break;
        }

        letters.push(String.fromCharCode(code));
      }
      return letters.join('');
    };

    const getBordersElment = (length) => {
      const rowLength = Math.floor((length + columnLength - 1) / columnLength);
      const borders = [];

      for (let i = 1; i < rowLength; i++) {
        borders.push(<i className="city-list-border" key={i} style={{ top: `${i * 50}px` }}></i>);
      }
      return (<span>{borders}</span>);
    };

    const getHotCityListElement = () => {
      const result = hotCitys.map(city => {
        const value = city.value;
        return <a key={value} data-value={value}>{city.name}</a>;
      });
      return result;
    };

    const getAllCityListElement = () => {
      const elements = [];

      cityGroup.forEach((group, index) => {
        const groupName = getGroupName(index);
        elements.push(
          <dl key={index}>
            <dt className="city-title" key={index}>{groupName}</dt>
            <dd key={`group-${index}`} className="city-list clearfix">
              {group.map(city => <a className="ellipsis"key={city.value} data-value={city.value}>{city.name}</a>)}
              {getBordersElment(group.length)}
            </dd>
          </dl>
        );
      });
      return elements;
    };

    return (
      <div className="city-popup" onTouchTap={this.handleCityTap}>
        <div className="city-hot">
          <h3 className="city-title">热门城市</h3>
          <p className="city-list clearfix">
            {getHotCityListElement()}
            {getBordersElment(hotCitys.length)}
          </p>
        </div>
        {getAllCityListElement()}
      </div>
    );
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

    this.props.onSetSuggestVisible();
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
  handleCityTap(evt) {
    const target = evt.target;
    const dataset = target.dataset;
    const { currentCity, onCurrentCityChange } = this.props;
    const name = target.textContent;

    if (target.nodeName === 'A' && dataset.value && (!currentCity || currentCity.name !== name)) {
      if (onCurrentCityChange) {
        onCurrentCityChange({ name, value: dataset.value });
      }
    }
    this.toggleCityPopup();
  },
  toggleCityPopup(visible) {
    this.setState({ cityPopupVisible: visible === undefined ? !this.state.cityPopupVisible : visible }, () => {
      const { cityPopupVisible } = this.state;
      if (cityPopupVisible) {
        this.props.onSetSuggestVisible(false);
      }
    });
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

    const { currentCity } = this.props;
    const { searchValueIsEmpty, cityPopupVisible } = this.state;
    return (
      <div className={classnames('addrselect-header flex-row', { 'city-expand': cityPopupVisible })} ref="wrap">
        <span
          className="city-select flex-none"
          onTouchTap={() => { this.toggleCityPopup(); }}
        >
          {currentCity && currentCity.name || ''}
        </span>
        {cityPopupVisible && this.getCityPopupElement()}
        <label className={classnames('addrselect-searchbox clearfix flex-rest', { 'is-empty': searchValueIsEmpty })}>
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
