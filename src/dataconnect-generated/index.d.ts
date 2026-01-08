import { ConnectorConfig, DataConnect, QueryRef, QueryPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Achievement_Key {
  id: UUIDString;
  __typename?: 'Achievement_Key';
}

export interface Activity_Key {
  id: UUIDString;
  __typename?: 'Activity_Key';
}

export interface GetUsersData {
  users: ({
    id: string;
    email: string;
    name?: string | null;
  } & User_Key)[];
}

export interface MoodEntry_Key {
  id: UUIDString;
  __typename?: 'MoodEntry_Key';
}

export interface QuizResult_Key {
  id: UUIDString;
  __typename?: 'QuizResult_Key';
}

export interface UserAchievement_Key {
  userId: string;
  achievementId: UUIDString;
  __typename?: 'UserAchievement_Key';
}

export interface UserStats_Key {
  id: UUIDString;
  __typename?: 'UserStats_Key';
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

interface GetUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUsersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetUsersData, undefined>;
  operationName: string;
}
export const getUsersRef: GetUsersRef;

export function getUsers(): QueryPromise<GetUsersData, undefined>;
export function getUsers(dc: DataConnect): QueryPromise<GetUsersData, undefined>;

