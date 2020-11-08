import moment from "moment-timezone";
import {
  DELETE_WEBHOOK_ACTION,
  TEST_WEBHOOK_ACTION,
} from "../constants/actions";
import { HUMAN_DATE_FORMAT } from "../constants/common";
import { ActionTypes, ParsedAction } from "./types";
import isURL from "validator/lib/isURL";

export function formatDate(millis: number, utc: boolean = true) {
  if (!millis) {
    return [];
  }

  const m = moment(millis);

  if (utc) {
    m.utc();
  }

  return m.format(HUMAN_DATE_FORMAT);
}

function mergeActionWithId(action: string, id: string) {
  return `${action}|${id}`;
}

export function parseAction(action: string): ParsedAction {
  const arr = action.split("|");

  if (arr.length < 2) {
    return {
      action: arr[0] as ActionTypes,
    };
  }

  return {
    action: arr[0] as ActionTypes,
    identifier: arr[1],
  };
}

export function createTestWebhookFunction(webhookId: string) {
  return mergeActionWithId(TEST_WEBHOOK_ACTION, webhookId);
}

export function createDeleteWebhookFunction(webhookId: string) {
  return mergeActionWithId(DELETE_WEBHOOK_ACTION, webhookId);
}

export function isValidUrl(url: string) {
  if (url) {
    return isURL(url, {
      protocols: ["https", "http"],
      require_protocol: true,
    });
  }

  return false;
}
