import { Action, ActionType, WorkflowContext } from '../types';

/**
 * Action registry for workflow automation
 * Actions are reusable workflow steps that AI agents can execute
 */

export class ActionRegistry {
  private actions: Map<string, Action> = new Map();

  register(action: Action): void {
    this.actions.set(action.name, action);
  }

  get(name: string): Action | undefined {
    return this.actions.get(name);
  }

  list(): Action[] {
    return Array.from(this.actions.values());
  }

  async execute(name: string, params: any): Promise<any> {
    const action = this.get(name);
    if (!action) {
      throw new Error(`Action '${name}' not found`);
    }
    return await action.execute(params);
  }
}

/**
 * Built-in actions for common workflow tasks
 */

export const createChatAction = (): Action => ({
  type: 'chat',
  name: 'chat',
  description: 'Send a chat message using AI',
  execute: async (params: { provider: any; request: any }) => {
    return await params.provider.chat(params.request);
  },
});

export const createVerifyAction = (): Action => ({
  type: 'verify',
  name: 'verify',
  description: 'Request human verification',
  execute: async (params: { method: string; identifier: string }) => {
    // This will be implemented with the verification system
    return {
      verificationId: `verify_${Date.now()}`,
      url: `https://ai.heysalad.app/verify/${Date.now()}`,
      expiresAt: new Date(Date.now() + 3600000), // 1 hour
      status: 'pending',
    };
  },
});

export const createWebhookAction = (): Action => ({
  type: 'webhook',
  name: 'webhook',
  description: 'Send data to a webhook endpoint',
  execute: async (params: { url: string; data: any; method?: string }) => {
    const response = await fetch(params.url, {
      method: params.method || 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params.data),
    });
    return await response.json();
  },
});

/**
 * Create a default action registry with built-in actions
 */
export const createDefaultActionRegistry = (): ActionRegistry => {
  const registry = new ActionRegistry();
  registry.register(createChatAction());
  registry.register(createVerifyAction());
  registry.register(createWebhookAction());
  return registry;
};
