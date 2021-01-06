import {
  APIMessage, Client, TextChannel, DMChannel, NewsChannel, Structures,
} from 'discord.js';

export function MessageStructuresExtend() {
  return Structures.extend('Message', (Message) => {
    class MessageExtend extends Message {
      // eslint-disable-next-line no-useless-constructor
      public constructor(client: Client, data: object, channel: TextChannel | DMChannel | NewsChannel) {
        super(client, data, channel);
      }

      public quote(content: any, options?: any): Promise<void> {
        const message_reference = {
          message_id: (
            !!content && !!options
              ? typeof content === 'object' && content.messageID
              : options && options.messageID
          ) || this.id,
          channel_id: this.channel.id,
          guild_id: this.guild.id,
        };
        const allowed_mentions = {
          parse: ['users', 'roles', 'everyone'],
          replied_user: true,
          // replied_user: typeof content === 'object' ? content && +content.mention : options && +options.mention,
        };

        return (async () => {
          const { data: parsed, files } = await APIMessage
            .create(this.channel, content, options)
            .resolveData()
            .resolveFiles();

          // @ts-ignore
          const postMessage = await this.client.api.channels[this.channel.id].messages.post({
            data: { ...parsed, message_reference, allowed_mentions },
            files,
          });

          // @ts-ignore
          return this.client.actions.MessageCreate.handle(postMessage).message;
        })();
      }
    }

    return MessageExtend;
  });
}
