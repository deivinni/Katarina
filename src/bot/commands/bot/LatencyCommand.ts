import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class LatencyCommand extends Command {
  public constructor() {
    super('latency', {
      aliases: ['latency', 'ping'],
      category: 'bot',
      description: {
        content: 'commands:ping.description',
        usage: 'ping',
        examples: ['ping'],
      },
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES'],
    });
  }

  public exec(message: Message): Promise<Message> {
    return message.util?.reply(
      this.client.i18n.t('commands:ping.message', {
        time: Math.floor(this.client.ws.ping),
      }),
    );
  }
}
