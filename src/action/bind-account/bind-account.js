import {createAction} from 'redux-actions';
exports.setChildView = createAction('SET_CHILDVIEW', viewHash => viewHash);
const setPhone = createAction('SET_PHONE', phoneInfo => phoneInfo);

exports.bindPhone = phoneInfo => (dispatch, getState) => {
	dispatch(setPhone(phoneInfo));
	location.hash = '#bind-validate';
	// return phoneInfo;
}
