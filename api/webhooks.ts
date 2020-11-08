import { withUiHook, htm } from "@vercel/integration-utils";
import { ADD_WEBHOOK_ACTION } from "./constants/actions";
import {
  createDeleteWebhookFunction,
  createTestWebhookFunction,
  formatDate,
  isValidUrl,
  parseAction,
} from "./utils/common";
import { ActionTypes, ParsedAction } from "./utils/types";
import { ApiClient } from "./vercel/client";
import { VercelWebhook } from "./vercel/types";

function addWebhookButton() {
  return htm`
    <Box
      display="flex"
      justifyContent="flex-end"
      marginBottom="24px"
    >
      <Button
        type="success"
        width="16px"
        action="${ADD_WEBHOOK_ACTION}"
      >
        Add Webhook
      </Button>
    </Box>
  `;
}

function webhookItem(
  webhook: VercelWebhook,
  parsed: ParsedAction,
  testResult: any
) {
  const isTest = parsed.action === "test-webhook";
  const isTestingCurrentWebhook = isTest && parsed.identifier === webhook.id;
  const isError = !!testResult.error;

  return htm`
    <Box
      backgroundColor="white"
      padding="20px"
      borderRadius="8px"
      display="flex"
      marginBottom="32px"
      flexDirection="column"
      boxShadow="0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
    >
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" flexDirection="row">
          <H1>${webhook.name}</H1>
          <Box marginLeft="12px">
            <Button action="${createTestWebhookFunction(
              webhook.id
            )}" small>Test</Button>
          </Box>
        </Box>
        <Button action="${createDeleteWebhookFunction(
          webhook.id
        )}" small type="error">Delete</Button>
      </Box>
      <HR/>
      <P><B>ID</B><BR/>${webhook.id}</P>
      <P><B>URL</B><BR/> ${webhook.url}</P>
      <P><B>Created at</B><BR/> ${formatDate(webhook.createdAt)} (UTC)</P>
      ${
        isTestingCurrentWebhook
          ? htm`
          <Box marginTop="16px">
            We have sent an HTTP POST request to the URL above.
            <BR/>
            Please note that the request is not HMAC encrypted and the values inside the payload may not be the actual values sent by Vercel.
          </Box>
          <Box
            color="${isError ? "red" : "black"}"
            marginBottom="8px"
            marginTop="6px"
          >
            <P><B>${isError ? "ERROR" : "RESPONSE"}</B></P>
          </Box>
          <Code>${JSON.stringify(testResult, null, 2)}</Code>
        `
          : ""
      }
    </Box>
  `;
}

function isValidAddWebhookState(state: any) {
  return state.webhookName && isValidUrl(state.webhookUrl);
}

function newWebhookItem(state: any) {
  const values = {
    name: state.webhookName || "Webhook Name",
    url: state.webhookUrl || "https://",
  };

  return htm`
    <Box
      backgroundColor="white"
      padding="20px"
      borderRadius="8px"
      display="flex"
      marginBottom="32px"
      flexDirection="column"
      boxShadow="0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
    >
      <Box display="flex" justifyContent="space-between">
        <H1>New Webhook</H1>
        <Box display="flex" flexDirection="row">
          <Box marginRight="12px">
            <Button action="view" small type="ghost">Cancel</Button>
          </Box>
          <Button action="add-webhook" small type="success">Add</Button>
        </Box>
      </Box>
      <HR/>
      <P><B>Name</B></P>
      <Input
        name="webhookName"
        value="${values.name}"
      />
      <Box>
        <P>Name can only contain alphanumeric characters, "_", "-", and space</P>
      </Box>
      <P><B>URL</B></P>
      <Input
        name="webhookUrl"
        value="${values.url}"
      />
      ${
        isValidUrl(values.url)
          ? ""
          : htm`
          <Box color="red">
            <P>Please enter a valid URL</P>
          </Box>
        `
      }
    </Box>
  `;
}

function noWebhookItem(isAddWebhook: boolean) {
  return !isAddWebhook
    ? htm`
    <Box>
      <P>No webhooks in the current project</P>
    </Box>
  `
    : "";
}

export default withUiHook(async ({ payload, vercelClient }) => {
  const { action, clientState } = payload;
  const client = new ApiClient(vercelClient);

  const parsed = parseAction(action as ActionTypes);
  const actionName = parsed.action;
  const actionIdentifier = parsed.identifier || ""; // auto failure
  const isValidAddState = isValidAddWebhookState(clientState);
  let testResult = {};
  let isAddWebhookSuccess = false;

  if (actionName === "delete-webhook") {
    try {
      await client.deleteWebhook(actionIdentifier);
    } catch (e) {
      console.log(e);
      /** ignore */
    }
  }

  if (actionName === "add-webhook" && isValidAddState) {
    try {
      await client.createWebhook(
        clientState.webhookName,
        clientState.webhookUrl
      );
      isAddWebhookSuccess = true;
    } catch (e) {
      console.log(e);
      /** ignore */
    }
  }

  const isAddWebhook = actionName === "add-webhook" && !isAddWebhookSuccess;
  const webhooks = await client.findAllWebhooks();

  if (actionName === "test-webhook") {
    const webhook = webhooks.find((w) => w.id === actionIdentifier);
    if (webhook) {
      testResult = await client.sendSampleWebhook(webhook.id, webhook.url);
    }
  }

  return htm`
    <Page>
      ${!isAddWebhook && webhooks.length < 6 ? addWebhookButton() : ""}
      ${
        webhooks.length > 0
          ? webhooks.map((item) => webhookItem(item, parsed, testResult))
          : noWebhookItem(isAddWebhook)
      }
      ${isAddWebhook ? newWebhookItem(clientState) : ""}
    </Page>
  `;
});
