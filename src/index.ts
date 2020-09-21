import dotenv from 'dotenv';
dotenv.config();

import Discord from 'discord.js';
import WatchNiconico from './niconico';

import moment from 'moment';

class NW {
  private wn: WatchNiconico;

  private bot: Discord.Client;
  private token: string;
  private channelId: string;

  private channel?: Discord.TextChannel;

  constructor(
    token: string | undefined,
    keyword: string | undefined,
    channelId: string | undefined
  ) {
    if (!token) throw new Error('トークンが入力されていません');
    if (!keyword) throw new Error('キーワードが入力されていません');
    if (!channelId) throw new Error('チャンネルIDが入力されていません');

    this.bot = new Discord.Client();
    this.token = token;
    this.channelId = channelId;
    this.wn = new WatchNiconico(keyword);
  }

  start(): void {
    this._botReadyHandler();
    this._botErrorHandler();

    this._nicoVideoHandler();

    this.bot.login(this.token);
    this.wn.start();
  }

  private _botReadyHandler(): void {
    this.bot.on('ready', () => {
      this._botFetchChannel();

      if (!this.bot.user) throw new Error('正常にログインできませんでした');
      this.bot.user.setActivity('ニコニコ動画', { type: 'WATCHING' });
      console.log('準備完了');
    });
  }

  private _botErrorHandler(): void {
    this.bot.on('error', (err) => console.error(err));
  }

  private _botFetchChannel(): void {
    const channel = this.bot.channels.cache.get(this.channelId);
    if (!(channel instanceof Discord.TextChannel))
      throw new Error('不正なチャンネルIDが指定されました');

    this.channel = channel;
  }

  private _nicoVideoHandler(): void {
    this.wn.on('post', (video) => {
      console.log(`${moment().format('hh:mm')} 新着動画 : ${video.title}`);

      if (!this.channel) throw new Error('チャンネル情報適用に失敗しました');
      this.channel.send(`**【新着動画】**${video.title}\n${video.url}`);
    });
  }
}

const nw = new NW(process.env.TOKEN, process.env.KEYWORD, process.env.CHID);
nw.start();
