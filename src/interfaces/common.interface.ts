export enum ResponseStatus {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL = 500,
}

export enum responseStatusMessage {
  SUCCESS = "Success",
  FAIL = "Fail",
}

export interface ResultProps {
  [key: string]: any;
}