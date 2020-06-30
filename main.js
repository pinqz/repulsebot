const Discord = require('discord.js');

const PREFIX = 'r!';

var servers = {};

const token = 'NzI0MTY3MTgxNTQxMzEwNTE4.Xu8PUg.oUG0WSCB_ExKIaeYw_8BrH5TPQM'

const client = new Discord.Client();

const ytdl = require("ytdl-core");

const ms = require('ms');

client.once('ready', ()=>{
    console.log('Repulse is Online!');
})

client.on('message', message=> {
    
    let args = message.content.slice(PREFIX.length).split(" ");

    switch(args[0]) {
        case 'ping':
            message.channel.send('pong!')
            break;
        case 'clear':
            if(!args[1]) return message.reply('r!clear (amount)')
            message.channel.bulkDelete(args[1]);
            break;
        case 'embed':
            const embed = new Discord.MessageEmbed()
            .setTitle('User Information')
            .addField('Username', message.author.username)
            .addField('Current Server', message.guild.name)
            .setThumbnail(message.author.avatarURL)
            .setColor(0x909ee3)
            message.channel.send(embed);
            break;
        case 'play':
            
            function play(connection, message){
                var server = servers[message.guild.id];

                server.dispatcher = connection.play(ytdl(server.queue[0], {filter: "audioonly"}));

                server.queue.shift();

                server.dispatcher.on("end", function(){
                    if(server.queue[0]){
                        play(connection, message);
                    }else {
                        connection.disconnect();
                    }


            });

        }
        
        
        
            if(!args[1]){
                message.channel.send("You need to provide a Link/URL!");
                return;
            }

            if(!message.member.voice.channel){
                message.channel.send("You Need to be in the Music Voice Channel to play the bot!");
                return;
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            }

            var server = servers[message.guild.id];

            server.queue.push(args[1]);

            if(!message.guild.voice) message.member.voice.channel.join().then(function(connection){
                play(connection, message);
            
            })



            break;

            case 'skip':
                var server = servers[message.guild.id];
                if(server.dispatcher) server.dispatcher.end();
                message.channel.send("Skipping Song!")
            break;

            case 'stop':
                var server = servers[message.guild.id];
                if(message.guild.voice.connection){
                    for (var i = server.queue.length -1; i >=0; i--){
                        server.queue.splice(i, 1);
                    }

                    server.dispatcher.end();
                    message.channel.send("Ending the Queue, Leaving the Voice Channel!")
                    console.log('Stopped the Queue')
                }

                if(message.guild.connection) message.guild.voice.connection.disconnect();
            break;

            case 'mute':
            let person = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]))
            if(!person) return message.reply("Couldn't find that User");

            let mainrole = message.guild.roles.cache.find(role => role.name === "[Community]");
            let muterole = message.guild.roles.cache.find(role => role.name === "[Muted]");

            if(!muterole) return message.reply("Couldn't find the Muted Role");

            let time = args[2];

            if(!time){
                return message.reply("You didn't specify a time!");
            
        }
            person.roles.remove(mainrole.id);
            person.roles.add(muterole.id);

            message.channel.send(`@${person.user.tag} has now have been Muted for ${ms(ms(time))}`);

            setTimeout(function(){
                person.roles.add(mainrole.id);
                person.roles.remove(muterole.id);
                message.channel.send(`@${person.user.tag} has been Unmuted!`)
    }, ms(time));
                




            break;    
    }


});
            

client.login(token);
