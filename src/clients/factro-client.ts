import { injectable } from 'inversify';
import fetch, { HeadersInit } from 'node-fetch';

import { mapTask } from './mappers';

import config from '../config/config.json';
import { TaskState } from '../types';

const baseRoute = `https://cloud.factro.com/api/core`;

@injectable()
export class FactroClient {
  public async getTask(taskId: string) {
    const route = this.buildRoute(`/tasks/${taskId}`);
    const headers = this.getHeaders();

    const result = await fetch(route, { headers: headers });

    if (!result.ok) {
      const resultText = await result.text();
      const errorMessage = `Failed to fetch task (${taskId}): ${resultText}`;

      if (result.status === 401) {
        const cause = new Error(`Invalid factro API-Key. Please check your config.`);

        throw new Error(errorMessage, { cause });
      }

      throw new Error(errorMessage);
    }

    const receivedResult = await result.json();

    return mapTask(receivedResult);
  }

  public async finishTask(taskId: string) {
    const route = this.buildRoute(`/tasks/${taskId}/state`);
    const headers = this.getHeaders();
    const body = JSON.stringify({ state: TaskState.Closed });

    const result = await fetch(route, { headers: headers, method: 'PUT', body: body });

    if (!result.ok) {
      const resultText = await result.text();
      const errorMessage = `Failed to finish task (${taskId}): ${resultText}`;

      if (result.status === 401) {
        const cause = new Error(`Invalid factro API-Key. Please check your config.`);

        throw new Error(errorMessage, { cause });
      }

      throw new Error(errorMessage);
    }
  }

  private buildRoute(route: string) {
    return `${baseRoute}${route}`;
  }

  private getHeaders(): HeadersInit {
    return {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: config.factro.apiKey,
    };
  }
}
