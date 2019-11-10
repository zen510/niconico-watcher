
const axios = require("axios")
const cron = require("node-cron")
const Eventemitter = require("events").EventEmitter
const discordcfg = require("../config/cfg")

module.exports = class unchi extends Eventemitter{
    constructor(){
        super()   
    }
    
    start(){
        const self = this
        cron.schedule(" */1 * * * *", () => self._niconico())
    }

    async _niconico(){
        const res = await axios.get(`https://api.search.nicovideo.jp/api/v2/video/contents/search?q=${discordcfg.KEY_WORD}&targets=tags&fields=contentId,title,description,tags&_sort=-startTime&_limit=1`)
        this.emit("post",res.data)
    }
}
