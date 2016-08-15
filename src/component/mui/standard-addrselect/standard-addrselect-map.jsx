const React = require('react');
const classnames = require('classnames');
const BMap = window.BMap;
const baiduMapConfig = {
  zoomLevel: 16,
};
module.exports = React.createClass({
  displayName: 'StandardAddrSelectMap',
  propTypes: {
    currentPoint: React.PropTypes.object.isRequired,
    onMapInited: React.PropTypes.func,
    onCenterPointChange: React.PropTypes.func,
  },
  componentDidMount() {
    window.setTimeout(this.initMap, 1);
  },
  componentWillReceiveProps(nextProps) {
    const { currentPoint } = this.props;
    const nextCurrentPoint = nextProps.currentPoint;
    if (!nextCurrentPoint || !nextCurrentPoint.latitude) {
      return;
    }

    if (currentPoint.latitude === nextCurrentPoint.latitude && currentPoint.longitude === nextCurrentPoint.longitude) {
      return;
    }

    this.mapCenter(nextCurrentPoint);
  },
  mapCenter(point) {
    const centerThePoint = _point => {
      const iconUrl = 'http://api0.map.bdimg.com/images/blank.gif';
      const myIcon = new BMap.Icon(iconUrl, new BMap.Size(32, 32));
      const marker = new BMap.Marker(_point, { icon: myIcon });
      this.map.centerAndZoom(_point, baiduMapConfig.zoomLevel);
      this.map.addOverlay(marker);
      this._currentPoint = _point;
      this.handleCenterPointChange();
    };
    if (!point.latitude || !point.longitude) {
      centerThePoint(new BMap.Point(0, 0));
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
  initMap() {
    const map = this.map = new BMap.Map(this.refs.content);
    this.mapCenter(this.props.currentPoint);
    map.addEventListener('tilesloaded', evt => {
    });
    map.addEventListener('dragend', evt => {
      this.handleCenterPointChange();
    });
    this.handleMapInited();
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
    const point = this._currentPoint;
    if (point) {
      this.map.centerAndZoom(point, baiduMapConfig.zoomLevel);
      this.handleCenterPointChange();
    }
  },
  render() {
    const { currentPoint } = this.props.currentPoint;
    return (
      <div className={classnames('addrselect-map', { 'addrselect-map-isdefultpoint': currentPoint && currentPoint.isDefault })}>
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
