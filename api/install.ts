import { htm, withUiHook } from "@vercel/integration-utils";

export default withUiHook(() => {
  return htm`
    <Page>
      <P>This integration requires no configuration, please proceed to the integrations page to start managing your webhooks.</P>
    </Page>
  `;
});
