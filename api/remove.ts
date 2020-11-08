import { htm, withUiHook } from "@vercel/integration-utils";

export default withUiHook(() => {
  return htm`
    <Page>
      <P>No configuration required after removing this integration. Please note that all your webhooks under this integration has been deleted.</P>
    </Page>
  `;
});
