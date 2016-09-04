const React = require('react');
const malePic = require('../../asset/images/head-male.png');
const femalePic = require('../../asset/images/head-female.png');
const defaultPic = require('../../asset/images/head-default.png');
require('./ShowBasicInfo.scss');

module.exports = React.createClass({ // ShowBasicInfo
  displayName: 'BrandBg',
  propTypes:{
    info:React.PropTypes.object.isRequired,
  },
  getInitialState() {
    return { realImage : '', realSex : '' };
  },
  componentWillMount() { },
  componentDidMount() { },
  componentWillReceiveProps(nextProps) {   // 接收props
    if (JSON.stringify(this.props.info) === JSON.stringify(nextProps.info)) {
      return;
    }
    // 获取Icon
    if (nextProps.info.iconUri) {
      this.setState({ realImage : nextProps.info.iconUri });
    } else if (nextProps.info.sex === '1') {
      this.setState({ realImage : malePic });
    } else if (nextProps.info.sex === '0') {
      this.setState({ realImage : femalePic });
    } else {
      this.setState({ realImage : defaultPic });
    }
    // 转义性别
    if (nextProps.info.sex === '1') {
      this.setState({ realSex : '先生' });
    } else if (nextProps.info.sex === '0') {
      this.setState({ realSex : '女士' });
    }
  },
  imgError(sex, e) {
    switch (sex) {
      case '1': { this.setState({ realImage : malePic }); break; }
      case '0': { this.setState({ realImage : femalePic }); break; }
      default: { this.setState({ realImage : defaultPic }); break; }
    }
  },
  render() {
    const { info } = this.props;
    const { realImage, realSex } = this.state;
    return (
      <div className="basicInfoBg">
        <img className="basicInfoBg-img" src={realImage} alt="用户头像" title={info.name || ''} ref="logo" onError={() => this.imgError(info.sex)} />
        <p className="basicInfoBg-name omit">
          {info.name || '不愿透露姓名的用户'} {info.name ? realSex : ''}
        </p>
        <div className="basicInfoBg-wave"></div>
      </div>
    );
  },
});
