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
    placeholder: React.PropTypes.string,
    currentPoint: React.PropTypes.object,
    onSelectComplete: React.PropTypes.func,
  },
  getInitialState() {
    return {
      suggest: [],
      list: [],
      centerPoint: null,
      suggestVisible: false,
    };
  },
  componentDidMount() {
  },
  handleMapInited(map) {
    this._map = map;
    const that = this;
    const local = this._mapLocal = new window.BMap.LocalSearch(map, {
      onSearchComplete(results) {
        if (local.getStatus() === window.BMAP_STATUS_SUCCESS) {
          let pois = [];
          for (let i = 0; i < results.getCurrentNumPois(); i++) {
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

    this.timer = window.setTimeout(x => {
      if (this._mapLocal) {
        this._mapLocal.search(searchKey);
      }
    }, 100);
  },
  handleCenterPointChange(point) {
    const geocoder = new BMap.Geocoder();
    geocoder.getLocation(new BMap.Point(point.longitude, point.latitude), ret => {
      let list = [];
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
      }
      this.setState({ list });
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

  render() {
    return (
      <div>
        <StandardAddrSelectSearchBox
          placeholder={this.props.placeholder}
          onUserInput={this.handleUserInput}
          onSelectComplete={this.handleSelectComplete}
          onSetSuggestVisible={this.handleSuggestVisible}
          suggestVisible={this.state.suggestVisible}
          suggest={this.state.suggest}
        />
        <StandardAddrSelectMap
          onCenterPointChange={this.handleCenterPointChange}
          onMapInited={this.handleMapInited}
          {...this.props}
        />
        <StandardAddrSelectListBox
          onSelectComplete={this.handleSelectComplete}
          list={this.state.list}
        />
        <div className="addrselect-mask" style={{ display: this.state.suggestVisible ? 'block' : '' }}></div>
      </div>
    );
  },
});
