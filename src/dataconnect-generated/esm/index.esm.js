import { queryRef, executeQuery, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'dashboard',
  service: 'mind-grove-guide',
  location: 'us-central1'
};

export const getUsersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUsers');
}
getUsersRef.operationName = 'GetUsers';

export function getUsers(dc) {
  return executeQuery(getUsersRef(dc));
}

