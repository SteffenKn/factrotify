import config from './config/config.json';
import fetch from 'node-fetch';

const baseRoute = `https://cloud.factro.com/api/core/`;

export default class FactroClient {
  public async getTask(taskId: string) {
    const route = this.buildRoute(`tasks/${taskId}`);
    const headers = this.getHeaders();

    const result = await fetch(route, {headers: headers});

    if (!result.ok) {
      const error = await result.text();

      throw new Error(`Failed to fetch task (${taskId}): ${error}`);
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
