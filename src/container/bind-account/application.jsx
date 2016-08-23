const React = require('react');
const connect = require('react-redux').connect;
const Toast = require('../../component/mui/toast.jsx');
require('../../asset/style/style.scss');
require('./application.scss');
import BindPhoneIndex from '../../component/bind-account/bind-phone-index.js';
import BindPhoneValidate from '../../component/bind-account/bind-phone-validate.js';
import BindPhoneSuccess from '../../component/bind-account/bind-phone-success.js';
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
		const {childView, phoneInfo} = this.props;
		if (childView === '#bind-phone') {
			const {bindPhone} = this.props;
			// 验证手机
			return <BindPhoneValidate 
					onBindPhone = {phoneInfo => bindPhone(phoneInfo)}/>

		} else if (childView === '#bind-validate') {
			console.log('phoneinfo:'+phoneInfo.code);
			// 手机绑定成功
			return <BindPhoneSuccess phoneInfo={phoneInfo}/>
		} else {
			// 手机绑定首页
			return <BindPhoneIndex />
		}
		
		
	}
})

module.exports = connect(state => state, actions)(BindAccountApplication);