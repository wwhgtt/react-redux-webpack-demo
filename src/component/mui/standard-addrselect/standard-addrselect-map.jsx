const React = require('react');
const classnames = require('classnames');
const shallowCompare = require('react-addons-shallow-compare');

const getCurrentPosition = require('../../../helper/common-helper.js').getCurrentPosition;
const callWxClientMethod = require('../../../helper/wx-client-helper.js').callWxClientMethod;
const getWeixinVersionInfo = require('../../../helper/common-helper.js').getWeixinVersionInfo;
const BMap = window.BMap;
const baiduMapConfig = {
  zoomLevel: 16,
};
module.exports = React.createClass({
  displayName: 'StandardAddrSelectMap',
  propTypes: {
    currentPoint: React.PropTypes.object,
    currentCity: React.PropTypes.object,
    onMapInited: React.PropTypes.func,
    onCenterPointChange: React.PropTypes.func,
  },
  getInitialState() {
    return {
      isDefultPoint: false,
    };
  },
  componentDidMount() {
    const fetchPosSuccess = (pos) => {
      this.initMap({ latitude: pos.latitude, longitude: pos.longitude, isGPSPoint: true });
    };
    const fetchPosError = () => {
      this.setState({ isDefultPoint: true });
      this.initMap({});
    };

    getCurrentPosition(pos => {
      fetchPosSuccess(pos);
    }, error => {
      const wxInfo = getWeixinVersionInfo();
      if (wxInfo.weixin) {
        callWxClientMethod('getLocation', {
          success: fetchPosSuccess,
          error: fetchPosError,
        });
      } else {
        fetchPosError();
      }
    });
  },
  componentWillReceiveProps(nextProps) {
    const { currentCity } = this.props;
    const nextCurrentCity = nextProps.currentCity;

    if (currentCity && nextCurrentCity && nextCurrentCity.name !== currentCity.name && nextCurrentCity.autoSelect !== false) {
      this.setCurrentCity(nextCurrentCity);
    }
    this.setCurrentPoint(nextProps.currentPoint);
  },
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
  setCurrentCity(city) {
    this.map.centerAndZoom(city.name, baiduMapConfig.zoomLevel);
    this._onTilesLoadedOnce = () => {
      this.handleCenterPointChange();
    };
  },
  setCurrentPoint(point) {
    if (!point || this._currentPoint !== undefined) {
      return;
    }

    const baidMapPoint = new BMap.Point(point.longitude, point.latitude);
    this.map.centerAndZoom(point, baiduMapConfig.zoomLevel);
    this._currentPoint = baidMapPoint;
  },
  mapCenter(point) {
    const centerThePoint = _point => {
      const iconUrl = 'http://api0.map.bdimg.com/images/blank.gif';
      const myIcon = new BMap.Icon(iconUrl, new BMap.Size(32, 32));
      const marker = new BMap.Marker(_point, { icon: myIcon });

      this.map.centerAndZoom(this._currentPoint || _point, baiduMapConfig.zoomLevel);
      this.map.addOverlay(marker);
      this._userPoint = _point;
      this.handleCenterPointChange();
    };
    // 取不到用户的坐标，根据用户ip取对应的城市
    if (!point.latitude || !point.longitude) {
      const currentCity = new BMap.LocalCity();
      currentCity.get(result => {
        this.map.centerAndZoom(result.name, baiduMapConfig.zoomLevel);
        this._userPoint = null;
      });
      return;
    }

    if (point.isGPSPoint !== true) {
      centerThePoint(new BMap.Point(point.longitude, point.latitude));
      return;
    }

    const convertor = new BMap.Convertor();
    const pointArr = [
      new BMap.Point(point.longitude, point.latitude),
    ];
    convertor.translate(pointArr, 1, 5, data => {
      if (data.status === 0) {
        centerThePoint(data.points && data.points[0]);
      }
    });
  },
  initMap(pos) {
    const map = this.map = new BMap.Map(this.refs.content);
    this.mapCenter(pos);
    map.addEventListener('tilesloaded', evt => {
      if (!this._userPoint) {
        const point = this.map.getCenter();
        this.mapCenter({ latitude: point.lat, longitude: point.lng });
      }

      if (this._onTilesLoadedOnce) {
        this._onTilesLoadedOnce();
        this._onTilesLoadedOnce = null;
      }
    });
    map.addEventListener('dragend', evt => {
      this.handleCenterPointChange();
    });
    this.handleMapInited();
    this.setCurrentPoint(this.props.currentPoint);
  },
  handleCenterPointChange() {
    const point = this.map.getCenter();
    if (this.props.onCenterPointChange) {
      this.props.onCenterPointChange({
        longitude: point.lng,
        latitude: point.lat,
      });
    }
  },
  handleMapInited() {
    if (this.props.onMapInited) {
      this.props.onMapInited(this.map);
    }
  },
  handleMoveToCurrent() {
    const point = this._userPoint;
    if (point) {
      this.map.centerAndZoom(point, baiduMapConfig.zoomLevel);
      this.handleCenterPointChange();
    }
  },
  render() {
    const { isDefultPoint } = this.state;
    return (
      <div className={classnames('addrselect-map', { 'addrselect-map-isdefultpoint': isDefultPoint })}>
        <div className="addrselect-map-inner" ref="content">
          <p className="addrselect-map-loading">
            地图加载中...
          </p>
        </div>
        <button className="addrselect-map-center" onTouchTap={this.handleMoveToCurrent}></button>
      </div>
    );
  },
});
