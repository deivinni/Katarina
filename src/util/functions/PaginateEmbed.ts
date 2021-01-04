import {
  Message, MessageEmbed, ReactionEmoji, User,
} from 'discord.js';
import { KatarinaEmbed } from '.';

/* eslint-disable no-plusplus */

export async function PaginationEmbed(
  message: Message,
  pages: KatarinaEmbed | MessageEmbed,
  emojiList: Array<string> = ['⏪', '⏩'],
  timeout: number = 120000,
) {
  if (!message && !message.channel) throw new Error('canal inacessível');
  if (!pages) throw new Error('paginas de embed não especificadas');
  if (emojiList.length !== 2) throw new Error('é necessários dois emojis');

  let page = 0;
  const currentPage = await message.channel.send(pages[page]);

  for (const emoji of emojiList) currentPage.react(emoji);

  const reactionCollector = currentPage.createReactionCollector(
    (reaction: ReactionEmoji, user: User) => emojiList.includes(reaction.name) && !user.bot,
    { time: timeout },
  );

  reactionCollector
    .on('collect', (reaction) => {
      reaction.users.remove(message.author);
      switch (reaction.emoji.name) {
        case emojiList[0]: {
          page = page > 0 ? --page : pages.length - 1;
          break;
        }
        case emojiList[1]: {
          page = page + 1 < pages.length ? ++page : 0;
          break;
        }
        default:
          break;
      }
      currentPage.edit(pages[page]);
    })
    .on('end', () => {
      if (!currentPage.deleted) currentPage.reactions.removeAll();
    });

  return currentPage;
}
