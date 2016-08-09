const React = require('react');
const BMap = window.BMap;

module.exports = React.createClass({
  displayName: 'StandardAddrSelectMap',
  propTypes: {
    currentPoint: React.PropTypes.object.isRequired,
    zoomLevel: React.PropTypes.number,
    onMapInited: React.PropTypes.func,
    onCenterPointChange: React.PropTypes.func,
  },
  componentDidMount() {
    window.setTimeout(x => {
      this.initMap();
    }, 1);
  },
  convertGPSPointToBaiduPoint(gpsPoint, callback) {
    const convertor = new BMap.Convertor();
    const pointArr = [
      new BMap.Point(gpsPoint.lng, gpsPoint.lat),
    ];
    convertor.translate(pointArr, 1, 5, data => {
      if (data.status === 0) {
        if (callback) {
          callback(data.points && data.points[0]);
        }
      }
    });
  },
  initMap() {
    const map = this.map = new BMap.Map(this.refs.content);
    const { currentPoint } = this.props;
    this.convertGPSPointToBaiduPoint(currentPoint, point => {
      map.centerAndZoom(point, 16);
      map.addControl(new BMap.NavigationControl());
      map.addControl(new BMap.OverviewMapControl());
      map.addEventListener('tilesloaded', evt => {
        if (!this.initMaped) {
          this.handleCenterPointChange();
          this.initMaped = true;
        }
      });
      map.addEventListener('dragend', evt => {
        this.handleCenterPointChange();
      });
      this.handleMapInited();
      const url = 'src/asset/images/map-marker-cur.png';
      const myIcon = new BMap.Icon(url, new BMap.Size(32, 32), {});
      const marker = new BMap.Marker(point, { icon: myIcon });
      map.addOverlay(marker);
    });
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
  render() {
    return (
      <div className="addrselect-map">
        <div className="addrselect-map-inner" ref="content">
          <p className="addrselect-map-loading">
            地图加载中...
          </p>
        </div>
      </div>
    );
  },
});
