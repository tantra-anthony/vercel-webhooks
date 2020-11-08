import { VercelClient } from "@vercel/integration-utils";
import {
  GET_DEPLOYMENTS,
  NO_EXISTING_DEPLOYMENTS,
  USER_ENDPOINT,
  WEBHOOK_ENDPOINT,
} from "../constants/api";
import {
  CreateVercelWebhookPayload,
  DeploymentEvents,
  GetCurrentUserResult,
  GetDeploymentItem,
  VercelWebhook,
} from "./types";
import axios from "axios";

export class ApiClient {
  client: VercelClient;

  constructor(vercelClient: VercelClient) {
    this.client = vercelClient;
  }

  findAllWebhooks(): Promise<VercelWebhook[]> {
    return this.client
      .fetch(WEBHOOK_ENDPOINT, { method: "GET" })
      .then(async (res) => {
        const result = await res.json();
        return result as VercelWebhook[];
      });
  }

  createWebhook(
    name: string,
    url: string,
    events?: DeploymentEvents[]
  ): Promise<VercelWebhook> {
    const body: CreateVercelWebhookPayload = {
      name,
      url,
    };

    if (events) {
      body.events = events;
    }

    return this.client
      .fetch(`${WEBHOOK_ENDPOINT}`, {
        method: "POST",
        body: JSON.stringify(body),
      })
      .then(async (res) => {
        const result = await res.json();
        return result as VercelWebhook;
      });
  }

  deleteWebhook(webhookId: string): Promise<any> {
    return this.client
      .fetch(`${WEBHOOK_ENDPOINT}/${webhookId}`, { method: "DELETE" })
      .then(async (res) => {
        const result = await res.json();
        return result;
      });
  }

  async sendSampleWebhook(webhookId: string, url: string): Promise<any> {
    const promises = await Promise.all([
      this.findCurrentUser(),
      this.findLatestDeployment(),
    ]);

    const [user, deployment] = promises;

    if (!deployment) {
      return this.createError(NO_EXISTING_DEPLOYMENTS);
    }

    const webhook: any = {
      id: "uev_A6gYoHob8uYNIO9Mf4d8RjB9",
      ownerId: user.user.uid,
      type: "deployment-ready",
      createdAt: 1604695537826,
      payload: {
        deploymentId: deployment.uid,
        name: deployment.name,
        project: deployment.name,
        url: deployment.url,
        plan: user.user.billing.plan,
        regions: ["sfo1"],
        target: null,
        alias: [`${deployment.name}.${user.user.username}.vercel.app`],
        type: "LAMBDAS",
        deployment: {
          id: deployment.uid,
          name: deployment.name,
          url: deployment.url,
          meta: {
            ...deployment.meta,
          },
        },
      },
      region: "now-sfo",
      teamId: null,
      userId: user.user.uid,
      webhookId,
    };

    try {
      const result = await axios.post(url, webhook);

      return result.data;
    } catch (e) {
      return this.createError(e);
    }
  }

  createError(error: string) {
    return {
      error,
    };
  }

  findLatestDeployment() {
    return this.client.fetch(`${GET_DEPLOYMENTS}?limit=1`).then(async (res) => {
      const result = await res.json();
      const deployments = Array.isArray(result.deployments)
        ? result.deployments
        : [];
      if (deployments.length > 0) {
        return deployments[0] as GetDeploymentItem;
      }
      return null;
    });
  }

  findCurrentUser() {
    return this.client
      .fetch(`${USER_ENDPOINT}`, { method: "GET" })
      .then(async (res) => {
        const result = await res.json();
        return result as GetCurrentUserResult;
      });
  }
}
