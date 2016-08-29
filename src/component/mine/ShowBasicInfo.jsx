const React = require('react');
require('./ShowBasicInfo.scss');

module.exports = React.createClass({ // ShowBasicInfo
  displayName: 'BrandBg',
  propTypes:{
    info:React.PropTypes.object,
  },
  componentWillMount() { },
  componentDidMount() { },
  imgError(sex, e) {
    switch (sex) {
      case '1': { this.refs.logo.src = '../../../src/asset/images/head-male.png'; break; }
      case '0': { this.refs.logo.src = '../../../src/asset/images/head-female.png'; break; }
      default: { this.refs.logo.src = '../../../src/asset/images/head-default.png'; break; }
    }
  },
  render() {
    const { info } = this.props;
    let realImage = '';
    let realSex = '';
    // 获取Icon
    if (info.iconUri) {
      realImage = info.iconUri;
    } else if (info.sex === '1') {
      realImage = '../../../src/asset/images/head-male.png';
    } else if (info.sex === '0') {
      realImage = '../../../src/asset/images/head-male.png';
    } else {
      realImage = '../../../src/asset/images/head-default.png';
    }
    // 转义性别
    if (info.sex === '1') {
      realSex = '先生';
    } else if (info.sex === '0') {
      realSex = '女士';
    }
    return (
      <div className="BasicInfoBg">
        <img className="BasicInfoBg-img" src={realImage} alt="用户头像" title={info.name || ''} ref="logo" onError={() => this.imgError(info.sex)} />
        <p className="BasicInfoBg-name omit">
          {info.name || '不愿透露姓名的用户'} {realSex}
        </p>
        <div className="BasicInfoBg-wave"></div>
      </div>
    );
  },
});
