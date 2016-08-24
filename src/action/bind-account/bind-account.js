import {createAction} from 'redux-actions';
exports.setChildView = createAction('SET_CHILDVIEW', viewHash => viewHash);
const setPhone = createAction('SET_PHONE', phoneInfo => phoneInfo);

exports.bindPhone = phoneInfo => () => {
	if (phoneInfo) {
		window.sessionStorage.setItem('phoneNum', phoneInfo.phoneNum);
		location.hash = '#bind-success';
	} else {
		return false;
	}
	
}
