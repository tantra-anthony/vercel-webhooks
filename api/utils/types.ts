import {
  ADD_WEBHOOK_ACTION,
  DELETE_WEBHOOK_ACTION,
  TEST_WEBHOOK_ACTION,
} from "../constants/actions";

export type ActionTypes =
  | typeof ADD_WEBHOOK_ACTION
  | typeof DELETE_WEBHOOK_ACTION
  | typeof TEST_WEBHOOK_ACTION;

export interface ParsedAction {
  action: ActionTypes;
  identifier?: string;
}
