const discord = require("discord.js")
const watchNiconico = require("./niconico")
const discordcfg = require("../config/cfg")
const niconico = new watchNiconico()

const main = () => {

    const client = new discord.Client()
    
    client.on("ready", () => {
        console.log("ready")
        niconico.start()
    })

    client.login(discordcfg.TOKEN)

    let count = 0
    let isFirst = true
    
    niconico.on("post",resjson => {

        let time = new Date()
        let hours = padding(time.getHours(),2)
        let minutes = padding(time.getMinutes(),2)
        let nt = `${hours}:${minutes}`
        
    if (resjson.meta.status === 200) {
        console.log(`${nt} Successfully acquired data.`) 
        let videotitle = resjson.data[0].title
        let videoURL = `https://www.nicovideo.jp/watch/${resjson.data[0].contentId}`
        oldcount = count
        count = resjson.meta.totalCount
        if (count > oldcount) {
            console.log(`${nt} new video arrived:${videotitle}`)
            if (isFirst == false) client.channels.get(discordcfg.CH_ID).send(`**【動画投稿】**${videotitle}\n${videoURL}`)
        isFirst = false
        }
    }
    else {console.log(`HTTP Status Code:${resjson.meta.status}`)}
    })

}

function padding(num,len){
    return("0000000000" + num).slice(-len)
}

main()
