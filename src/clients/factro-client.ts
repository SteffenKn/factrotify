import config from '../config/config.json';
import fetch from 'node-fetch';

const baseRoute = `https://cloud.factro.com/api/core/`;

export class FactroClient {
  public async getTask(taskId: string) {
    const route = this.buildRoute(`tasks/${taskId}`);
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

    return await result.json();
  }

  private buildRoute(route: string) {
    return `${baseRoute}${route}`;
  }

  private getHeaders() {
    return {
      accept: 'application/json',
      Authorization: config.factro.apiKey,
    };
  }
}
