import { Command } from 'discord-akairo';
import { Message, Snowflake } from 'discord.js';
import { inspect } from 'util';
import { VultrexHaste } from 'vultrex.haste';

const haste = new VultrexHaste({ url: 'https://hastebin.com' });

export default class EvalCommand extends Command {
  public constructor() {
    super('eval', {
      aliases: ['eval', 'e'],
      category: 'owner',
      description: {
        content: 'commands:owner.eval',
        usage: 'eval <code>',
        examples: ['eval message.author.tag'],
      },
      ownerOnly: true,
      args: [{
        id: 'code',
        type: 'string',
        match: 'content',
        prompt: {
          start: 'digite algum código',
        },
      }],
      ratelimit: 5,
      clientPermissions: ['SEND_MESSAGES'],
      userPermissions: ['SEND_MESSAGES'],
    });
  }

  public async exec(message: Message, { code }: { code: string }): Promise<Message> {
    // eslint-disable-next-line no-unused-vars, eqeqeq
    const _user = (_id: Snowflake) => this.client.users.cache.find((user) => user.id == _id);
    code = code
      .replace(/^`{3}(js)?|`{3}$/g, '')
      .replace(/<@!?(\d{16,18})>/g, '_user($1)');
    let result: string = '';

    try {
      result = inspect(eval(code), { depth: 0 }); // eslint-disable-line no-eval
    } catch (error) {
      result = String(error);
    }

    result.replace(new RegExp(this.client.token, 'gi'), '#####');

    return message.channel
      .send(result.length > 1950 ? String(await haste.post(result)) : result, { code: 'js' })
      .catch((err) => message.channel.send(err, { code: 'xl' }));
  }
}
