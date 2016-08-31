const React = require('react');
const up = require('../mui/touchTouch.jquery.js');
//const $ = require('jquery');
require('./registerBanner.scss');

module.exports = React.createClass({
  displayName: 'ShowSettingList',
  propTypes:{
    Info:React.PropTypes.object,
    getInfo:React.PropTypes.func,
    updateInfo:React.PropTypes.func,
  },
  getInitialState() {
    return { value: '', sex: '' };
  },
  componentWillMount() { },
  componentDidMount() {
    up('k');
  },
  imgError(e) {
    e.target.src = '../../../src/asset/images/register-banner-default.jpg';
  },
  render() {
    const { Info } = this.props;
    // this.setState({value: Info.name});
    return (
      <div className="register-banner">
        <a href={Info.picUrl} id="k">
          <img src={Info.picUrl || '../../../src/asset/images/register-banner-default.jpg'} onError={this.imgError} alt="会员注册头图" title="会员注册头图" />
        </a>
      </div>
    );
  },
});
