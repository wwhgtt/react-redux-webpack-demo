const React = require('react');
const connect = require('react-redux').connect;
const Toast = require('../../component/mui/toast.jsx');
require('../../asset/style/style.scss');
require('./application.scss');
import BindPhoneIndex from '../../component/bind-account/bind-phone-index.js';
import BindPhoneValidate from '../../component/bind-account/bind-phone-validate.js';
const actions = require('../../action/bind-account/bind-account.js');

const BindAccountApplication = React.createClass( {
	componentWillMount () {
		window.addEventListener('hashchange', this.setChildViewAccordingToHash);
	},

	setChildViewAccordingToHash() {
		console.log(this.props)
		const {setChildView} = this.props;
		const hash = location.hash;
	    setChildView(hash);
	},

	render() {
		const {childView} = this.props;
		if (childView === '#bind-validate') {
			console.log('safd');
			return (
				<BindPhoneValidate />
			)
		}

		return <BindPhoneIndex />
		
	}
})

module.exports = connect(state => state, actions)(BindAccountApplication);