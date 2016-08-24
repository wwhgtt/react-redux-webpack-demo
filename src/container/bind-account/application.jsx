const React = require('react');
const connect = require('react-redux').connect;
const Toast = require('../../component/mui/toast.jsx');
require('../../asset/style/style.scss');
require('./application.scss');
import BindPhoneIndex from '../../component/bind-account/bind-phone-index.js';
import BindPhoneValidate from '../../component/bind-account/bind-phone-validate.js';
import BindPhoneSuccess from '../../component/bind-account/bind-phone-success.js';
import BindWxIndex from '../../component/bind-account/bind-wx-index.js';
import BindWxInfo from '../../component/bind-account/bind-wx-info.js';
// import BindWxSuccess from '../../component/bind-account/bind-wx-success.js';
import * as actions from '../../action/bind-account/bind-account.js';


const BindAccountApplication = React.createClass( {
	// 监听hash变化
	componentWillMount () {
		window.addEventListener('hashchange', this.setChildViewAccordingToHash);
		window.addEventListener('load', this.setChildViewAccordingToHash);
	},

	// 获得页面hash并发送action
	setChildViewAccordingToHash() {
		const {setChildView} = this.props;
		const hash = location.hash;
	    setChildView(hash);
	},

	render() {
		const {childView, bindPhone} = this.props;
		if (childView === '#bind-phone') {
			// 手机绑定首页
			return <BindPhoneIndex />
		} else if (childView === '#bind-validate') {
			// 验证手机
			return <BindPhoneValidate 
					onBindPhone = {phoneInfo => bindPhone(phoneInfo)}
					/>
		} else if (childView === '#bind-success') {
			const phoneNum = window.sessionStorage.getItem('phoneNum');
			// 手机绑定成功
			return <BindPhoneSuccess phoneNum={phoneNum}/>
		} else if (childView === '#bind-wx') {
			// 微信绑定首页
			return <BindWxIndex />
		} else if (childView === '#bind-info') {
			// 微信信息展示
			const wxInfo = {'phoneNum': '1234'};
			return <BindWxInfo wxInfo= {wxInfo}/>
		} else {
			return <div></div>;
		}
		
		
	}
})

module.exports = connect(state => state, actions)(BindAccountApplication);