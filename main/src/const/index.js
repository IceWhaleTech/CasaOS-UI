export const MIRCO_APP_ACTION_ENUM = {
  OPEN: 'open',
  CLOSE: 'close',
  MOUNT: 'mount', // show storage manager panel from child app
  LOGIN: 'login', // child app 401 unauth trigger main app login
  DESTROY: 'destroy', // call child app to release its content and destroy itself
};