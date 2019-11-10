const discord = require("discord.js")
const main = () => {
    const client = new discord.Client()

    client.on("ready", () => console.log("ready"))
    client.on("message", msg => {
        if (msg.author.id === client.user.id) {
            console.log("unchi")
            return
        }
        if (msg.content === "ping") msg.channel.send("ping")
    })

    client.login("NjQxNTk3NjgwNzAyOTgwMTAy.XcK6KQ.rpULg2jv0W_7jEup3ncy34mELMo")


}
main()