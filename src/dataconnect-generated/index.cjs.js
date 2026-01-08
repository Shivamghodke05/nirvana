const { queryRef, executeQuery, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'dashboard',
  service: 'mind-grove-guide',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const getUsersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUsers');
}
getUsersRef.operationName = 'GetUsers';
exports.getUsersRef = getUsersRef;

exports.getUsers = function getUsers(dc) {
  return executeQuery(getUsersRef(dc));
};
