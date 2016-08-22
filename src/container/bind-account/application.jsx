const React = require('react');
const connect = require('react-redux').connect;
const Toast = require('../../component/mui/toast.jsx');
require('../../asset/style/style.scss');
require('./application.scss');
import BindPhoneIndex from '../../component/bind-account/bind-phone-index.js';
import BindPhoneValidate from '../../component/bind-account/bind-phone-validate.js';
import actions from '../../action/bind-account/bind-account.js';

class BindAccountApplication extends React.Component {
	componentWillMount () {
		window.addEventListener('hashChange', this.setChildViewAccordingToHash);
	}

	setChildViewAccordingToHash() {
		const {setChildView} = this.props;
		const hash = location.hash;
	    setChildView(hash);
	}

	render() {
		return (
			<BindPhoneIndex />
			// <BindPhoneValidate />
		)
	}
}

module.exports = BindAccountApplication;
// module.exports = connect(state => state, actions)(BindAccountApplication);