import { BlockAction, ButtonAction, KnownBlock, SlackActionMiddlewareArgs } from '@slack/bolt';

import { SlackService } from '../services';

export class SlackController {
  private service: SlackService;

  constructor(service: SlackService) {
    this.service = service;
  }

  public async handleFinishTask(payload: SlackActionMiddlewareArgs<BlockAction<ButtonAction>>) {
    console.log(`Received new finish task request: ${JSON.stringify(payload)}`);

    const { ack, say, respond } = payload;
    const taskId = payload.action.value;

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
