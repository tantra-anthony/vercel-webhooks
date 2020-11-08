import {
  DELETE_WEBHOOK_ACTION,
  TEST_WEBHOOK_ACTION,
} from "../constants/actions";
import {
  formatDate,
  parseAction,
  createDeleteWebhookFunction,
  createTestWebhookFunction,
  isValidUrl,
} from "./common";

test("Changes milliseconds to a human readable date format", () => {
  const sampleDate1 = 1604846163265;
  const sampleDate2 = 1604846184852;

  expect(formatDate(sampleDate1)).toBe("8 November 2020, 14:36");
  expect(formatDate(sampleDate2, true)).toBe("8 November 2020, 14:36");
});

test("Creates a delete webhook function with respective hook ID", () => {
  const webhookId = "hook_123456";
  const expected = `${DELETE_WEBHOOK_ACTION}|${webhookId}`;

  expect(createDeleteWebhookFunction(webhookId)).toBe(expected);
});

test("Creates a test webhook function with respective hook ID", () => {
  const webhookId = "hook_123456";
  const expected = `${TEST_WEBHOOK_ACTION}|${webhookId}`;

  expect(createTestWebhookFunction(webhookId)).toBe(expected);
});

test("Creates an action object from a string", () => {
  const webhookId = "hook_123456";
  const action1 = "view";
  const action2 = createDeleteWebhookFunction(webhookId);
  const action3 = createTestWebhookFunction(webhookId);

  expect(parseAction(action1)).toStrictEqual({
    action: action1,
  });
  expect(parseAction(action2)).toStrictEqual({
    action: DELETE_WEBHOOK_ACTION,
    identifier: webhookId,
  });
  expect(parseAction(action3)).toStrictEqual({
    action: TEST_WEBHOOK_ACTION,
    identifier: webhookId,
  });
});

test("Checks if strings is a valid URL", () => {
  const url1 = "https://";
  const url2 = "https://abc.com.com";
  const url3 = "https://abc.com.com/abc";
  const url4 = "abc.abc.com";
  const url5 = "   https://abc.com";
  const url6 = "abc.com/abcabc/abc";
  const url7 = "wss://abc.abc";

  expect(isValidUrl(url1)).toBe(false);
  expect(isValidUrl(url2)).toBe(true);
  expect(isValidUrl(url3)).toBe(true);
  expect(isValidUrl(url4)).toBe(false);
  expect(isValidUrl(url5)).toBe(false);
  expect(isValidUrl(url6)).toBe(false);
  expect(isValidUrl(url7)).toBe(false);
});
