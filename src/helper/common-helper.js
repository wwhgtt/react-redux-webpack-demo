exports.getCurrentPosition = (success, error, config) => {
  const defaultConfig = {
    enableHighAccuracy: true,
    timeout: 2000,
    maximumAge: 1000 * 10,
  };
  navigator.geolocation.getCurrentPosition(pos => {
    if (success) {
      success(Object.assign({}, pos.coords));
    }
  }, err => {
    if (error) {
      error(err);
    }
  }, Object.assign({}, defaultConfig, config));
};
