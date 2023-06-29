import { injectable, inject } from 'inversify';
import { BlockAction, ButtonAction, KnownBlock, SlackActionMiddlewareArgs } from '@slack/bolt';

import { SlackService } from '../services';
import { IocIds } from '../../types/index';

@injectable()
export class SlackController {
  private service: SlackService;

  constructor(@inject(IocIds.SlackService) service: SlackService) {
    this.service = service;
  }

  public async handleFinishTask(payload: SlackActionMiddlewareArgs<BlockAction<ButtonAction>>) {
    if (typeof payload?.action?.value !== 'string') {
      console.error(`Received invalid finish task request. Payload: ${JSON.stringify(payload)}`);
    }

    const taskId = payload.action.value;

    console.log(`Received new finish task request (taskId: "${taskId}")`);

    const { ack, say, respond } = payload;

    await ack();

    try {
      await this.service.handleFinishTask(taskId);
    } catch (error) {
      console.error(error);
      await say(`Beim Abschließen des Tasks ist ein Fehler aufgetreten: ${error.message}`);
      return;
    }

    const previousMessage = payload.body.message;
    if (!previousMessage || !previousMessage.text || !previousMessage.blocks) {
      console.error(`Could not update slack message. Previous message is missing.`);
      return;
    }

    const blocksWithoutFinishButton = previousMessage.blocks.map((block: KnownBlock) => {
      if (block.type !== 'actions' || block.block_id !== 'button-row-block') {
        return block;
      }

      const newElements = block.elements.filter((element) => {
        if (element.type !== 'button') {
          return true;
        }

        return element.action_id !== 'finish-task';
      });

      return {
        ...block,
        elements: newElements,
      };
    });

    await respond({
      text: previousMessage.text,
      blocks: blocksWithoutFinishButton,
    });
  }

  // This is needed to prevent Slack from showing an error message
  public handleOpenTask(payload: SlackActionMiddlewareArgs) {
    return payload.ack();
  }
}
