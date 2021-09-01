const { Client, MessageEmbed, Intents } = require('discord.js');
const fs = require('fs');
const request = require('request');
const Jimp = require('jimp');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES] });
const token = 'TOKEN';
const Prefix = '+';

let pic;
let mes;
//let charSet = ['$', '@', 'B', '%', '8', '&', 'W', 'M', '#', 'o', 'a', 'h', 'k', 'b', 'd', 'p', 'q', 'w', 'm', 'Z', 'O', '0', 'Q', 'L', 'C', 'J', 'U', 'Y', 'X', 'z', 'c', 'v', 'u', 'n', 'x', 'r', 'j', 'f', 't', '/', '(', ')', '1', '{', '}', '[', ']', '?', '-', '_', '+', '<', '>', 'i', '!', 'l', 'I', ';', ':', ',', '^', ',', '..'];
let charSetInv = [
    '.', '>', '<', '+', '}', '{', 'r', 'x', 'n', 'u', 'v', 'c',
    'z', 'X', 'Y', 'U', 'J', 'C', 'L', 'Q', '0',
    'O', 'Z', 'm', 'w', 'q', 'p', 'd', 'b', 'k',
    'h', 'a', 'o', '#', 'M', 'W', '&', '8',
    '%', 'B', '@', '$'];

fixLine('abcdefg');

bot.on('ready', () => {
    console.log('Bot Online');
    bot.user.setActivity('ASCII Representatiton | +rep');
})

bot.on('messageCreate', message => {
    let args = message.content.substring(Prefix.length).split(" ");
    if (!message.content.startsWith(Prefix)) return;

    switch(args[0]) {
        case 'rep':
            pic = message.attachments.first();
            var stream = function(){
                return new Promise (resolve => {
                    request(pic.url).pipe(fs.createWriteStream('pic.png')).then(resolve());
                })
            }
            stream()
            setTimeout(preprocess, 1 * 1000);
            setTimeout(() => {assembleMessage(message)}, 2 * 1000);
            // setTimeout(() => { 
            //     message.delete();
            //     fs.unlinkSync('./pic.png');
            //     fs.unlinkSync('./pic2.png');
            //  }, 3 * 1000);
            break;
        case 'effect':
            preprocess();
            message.channel.send('Here you go!');
            message.channel.send({
                files: ['./pic2.png']
            });
            break;
        case 'clear':
            fs.unlinkSync('./pic.png');
            fs.unlinkSync('./pic2.png');
            break;
    }
})

//sclaes and greyscales the image
function preprocess() {
        Jimp.read('./pic.png')
        .then(image => {
            image.greyscale();
            image.contrast(0.5);
            image.scaleToFit(40, 50);
            image.resize(image.bitmap.width, image.bitmap.height / 2);
            image.write('pic2.png');
        }) 
}

function assembleMessage(message) {
    let m = '';
    let l = '';
    Jimp.read('./pic2.png')
        .then(image => {
            image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
                let index = Math.trunc((this.bitmap.data[idx] / 255) * (charSetInv.length - 1));
                    if (x == this.bitmap.width - 1) {
                        m += `${fixLine(l + charSetInv[index])}\n`;
                        l = '';
                    }
                    else {
                        l += charSetInv[index]; 
                    }
            });
            message.channel.send(m);
        })
}

function fixLine(line) {
    let l = line.split('');
    for (var i = 0; i < l.length; i++) {
        if (l[i] == '.') {
            if (i % 2 == 0) l[i] += '.';
            else l[i] += '..';
        }
        if (l[i] == '{' || l[i] == '}') {
            l[i] += '{';
        }01
    }
    return l.join('');
}

bot.login(token);
