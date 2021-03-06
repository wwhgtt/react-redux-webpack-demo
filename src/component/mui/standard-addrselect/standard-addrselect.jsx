require('../../../asset/style/style.scss');
require('./standard-addrselect.scss');

const React = require('react');
const BMap = window.BMap;

const StandardAddrSelectSearchBox = require('./standard-addrselect-searchbox.jsx');
const StandardAddrSelectMap = require('./standard-addrselect-map.jsx');
const StandardAddrSelectListBox = require('./standard-addrselect-listbox.jsx');
module.exports = React.createClass({
  displayName: 'StandardAddressSelect',
  propTypes: {
    hotCityList: React.PropTypes.array,
    currentPoint: React.PropTypes.object,
    placeholder: React.PropTypes.string,
    onSelectComplete: React.PropTypes.func,
    searchResultMaxLength: React.PropTypes.number,
  },
  getInitialState() {
    return {
      suggest: [],
      list: [],
      currentCity: null,
      centerPoint: null,
      suggestVisible: false,
    };
  },
  componentDidMount() {
  },
  componentWillUnmount() {
    this._mapLocal = this._map = null;
  },
  handleMapInited(map) {
    this._map = map;
    const that = this;
    const maxLength = this.props.searchResultMaxLength || 10;
    const local = this._mapLocal = new window.BMap.LocalSearch(map, {
      onSearchComplete(results) {
        if (local.getStatus() === window.BMAP_STATUS_SUCCESS) {
          const pois = [];
          for (let i = 0; i < results.getCurrentNumPois() && i < maxLength; i++) {
            const poi = results.getPoi(i);
            pois.push({
              title: poi.title,
              address: poi.address,
              point: poi.point,
              uid: poi.uid,
            });
            that.setState({ suggest: pois, suggestVisible: true });
          }
        }
      },
    });
  },
  handleUserInput(searchKey) {
    if (this.timer) {
      window.clearTimeout(this.timer);
    }

    if (!searchKey) {
      this.setState({ suggest: [], suggestVisible: false });
      return;
    }

    this.timer = window.setTimeout(x => {
      if (this._mapLocal) {
        this._mapLocal.search(searchKey, { forceLocal: true });
      }
    }, 120);
  },
  handleCenterPointChange(point) {
    const geocoder = new BMap.Geocoder();
    geocoder.getLocation(new BMap.Point(point.longitude, point.latitude), ret => {
      let list = [];
      let cityName = null;
      if (ret && ret.surroundingPois) {
        list = ret.surroundingPois.map(item => {
          const _point = item.point;
          return {
            title: item.title,
            address: item.address,
            uid: item.uid,
            point:{ lng: _point.lng, lat: _point.lat },
          };
        });
        cityName = ret.addressComponents && ret.addressComponents.city || '';
      }
      if (this._mapLocal) {
        this.setState({ list, currentCity: { name: cityName.replace('市', ''), autoSelect: false } });
      }
    }, { poiRadius: 500, numPois: 11 });
  },
  handleSelectComplete(poi) {
    if (!poi || !this.props.onSelectComplete) {
      return;
    }

    this.props.onSelectComplete(poi);
  },
  handleSuggestVisible(visible) {
    let _visible = visible;
    if (_visible === undefined) {
      _visible = !this.state.suggestVisible;
    }
    this.setState({ suggestVisible: _visible });
  },
  handleCityChange(city) {
    this.setState({ currentCity: city });
  },
  render() {
    const { suggestVisible, suggest, currentCity } = this.state;
    return (
      <div>
        <StandardAddrSelectSearchBox
          hotCityList={this.props.hotCityList}
          placeholder={this.props.placeholder}
          onUserInput={this.handleUserInput}
          onSelectComplete={this.handleSelectComplete}
          onSetSuggestVisible={this.handleSuggestVisible}
          suggestVisible={suggestVisible}
          suggest={suggest}
          currentCity={currentCity}
          onCurrentCityChange={this.handleCityChange}
        />
        <StandardAddrSelectMap
          currentPoint={this.props.currentPoint}
          currentCity={this.state.currentCity}
          onCenterPointChange={this.handleCenterPointChange}
          onMapInited={this.handleMapInited}
        />
        <StandardAddrSelectListBox
          onSelectComplete={this.handleSelectComplete}
          list={this.state.list}
        />
        <div
          className="addrselect-mask"
          style={{ display: this.state.suggestVisible ? 'block' : '' }}
          onTouchTap={() => { this.handleSuggestVisible(false); }}
        />
      </div>
    );
  },
});
