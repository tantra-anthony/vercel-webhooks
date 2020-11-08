export type DeploymentEvents = "deployment" | "deployment-ready";

export interface VercelWebhook {
  configurationId: string;
  createdAt: number;
  events: DeploymentEvents[];
  id: string;
  name: string;
  ownerId: string;
  url: string;
}

export interface CreateVercelWebhookPayload {
  name: string;
  url: string;
  events?: DeploymentEvents[];
}

export interface GetCurrentUserResult {
  user: GetCurrentUserResultUser;
}

interface GetCurrentUserResultUser {
  uid: string;
  email: string;
  name: string | null;
  username: string;
  date: string;
  avatar: string;
  platformVersion: number | string | null;
  billing: GetCurrentUserResultUserBilling;
  bio: string | null;
  website: string | null;
  profiles: any[];
  stagingPrefix: string;
  resourceConfig: GetCurrentUserResultUserResourceConfig;
  softBlock: string | null;
}

interface GetCurrentUserResultUserResourceConfig {
  concurrentBuilds: number;
}

interface GetCurrentUserResultUserBilling {
  plan: string;
  period: string | null;
  trial: string | null;
  cancelation: string | null;
  addons: string | null;
  email: string | null;
  tax: string | null;
  language: string | null;
  address: string | null;
  name: string | null;
}

export interface GetDeploymentItem {
  uid: string;
  name: string;
  url: string;
  created: number;
  state: string;
  type: string;
  creator: GetDeploymentItemCreator;
  instanceCount: number;
  scale: any;
  meta: any;
  target: null;
  aliasError: null;
  aliasAssigned: number;
}

interface GetDeploymentItemCreator {
  uid: string;
  email: string;
  username: string;
}
