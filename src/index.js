const discord = require("discord.js")
const watchNiconico = require("./niconico")
const discordcfg = require("../config/cfg")
const unchi = new watchNiconico()

const main = () => {

    const client = new discord.Client()
    
    client.on("ready", () => {
        console.log("ready")
        unchi.start()
    })

    client.login(discordcfg.TOKEN)

    let count = 0
    let isFirst = true
    let time = new Date()
    let hours = padding(time.getHours(),2)
    let minutes = padding(time.getMinutes(),2)
    let nt = `${hours}:${minutes}`
    
    unchi.on("post",unko => {
    if (unko.meta.status === 200) {
        console.log(`${nt} Successfully acquired data.`) 
        let videotitle = unko.data[0].title
        let videoURL = `https://www.nicovideo.jp/watch/${unko.data[0].contentId}`
        oldcount = count
        count = unko.meta.totalCount
        if (count > oldcount) {
            console.log(`${nt} new video arrived:${videotitle}`)
            isFirst = false
            if (isFirst == false) client.channels.get(discordcfg.CH_ID).send(`**【動画投稿】**${videotitle}\n${videoURL}`)
        }
    }
    else {console.log(`HTTP Status Code:${unko.meta.status}`)}
    })

}

function padding(num,len){
    return("0000000000" + num).slice(-len)
}

main()
