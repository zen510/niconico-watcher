import axios from 'axios';
import cron from 'node-cron';
import { EventEmitter } from 'events';

export default class unchi extends EventEmitter {
  private keyword: string;

  private count = 0;
  private isFirst = true;

  constructor(keyword: string) {
    super();
    this.keyword = keyword;
  }

  start(): void {
    cron.schedule(' */1 * * * *', () => this._niconico());
  }

  private async _niconico() {
    const res = await axios
      .get(
        `https://api.search.nicovideo.jp/api/v2/video/contents/search?q=${encodeURIComponent(
          this.keyword
        )}&targets=tags&fields=contentId,title&_sort=-startTime&_limit=1`
      )
      .catch((err) => {
        throw err;
      });

    const oldCount = this.count;
    this.count = res.data.meta.totalCount;

    if (this.count <= oldCount) return;
    if (this.isFirst) {
      this.isFirst = false;
      return;
    }

    const data = res.data;
    const video = {
      title: data.data[0].title,
      url: `https://www.nicovideo.jp/watch/${data.data[0].contentId}`,
    };
    this.emit('post', video);
  }
}
