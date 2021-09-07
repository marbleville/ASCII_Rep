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

const pixWidth = [3, 15, 15, 16, 12, 12, 9, 13, 13, 13, 14, 13, 13, 18, 18, 18, 9, 18, 12, 21, 16, 20, 17, 23, 23, 14, 14, 14, 14, 13, 14, 12, 12, 19, 26, 26, 21, 16, 26, 14, 25, 15];

console.log(getPixWidth('$$$$$$$$$$Wu...................................uW$$$$$$$$$$$$$') + ' 1');
console.log(getPixWidth('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$') + ' 2');

console.log(pixWidth[charSetInv.indexOf('$')])

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
            image.resize(image.bitmap.width, image.bitmap.height / 3);
            image.write('pic2.png');
        }) 
}

function assembleMessage(message) {
    let m = new Array();
    let l = '';
    Jimp.read('./pic2.png')
        .then(image => {
            image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
                let index = Math.trunc((this.bitmap.data[idx] / 255) * (charSetInv.length - 1));
                    if (x == this.bitmap.width - 1) {
                        m.push(`${fixLine(l + charSetInv[index])}`);
                        l = '';
                    }
                    else {
                        l += charSetInv[index]; 
                    }
            });
            message.channel.send(normalizeLines(m).join('\n'));            
        })
}

function fixLine(line) {
    let l = line.split('');
    for (var i = 0; i < l.length; i++) {
        if (l[i] == '.') {
            if (i % 2 == 0) l[i] += '.';
            else l[i] += '..';
        }
        // if (l[i] == '{' || l[i] == '}') {
        //     l[i] += '{';
        // }
    }
    return l.join('');
}

function getPixWidth(line) {
    let len = 0;
    let l = line.split('');
    l.forEach(letter => {
        len += (pixWidth[charSetInv.indexOf(letter)] + 1);
    });
    return len;
}

function normalizeLines(l) {
    let lines = l;
    let ave = 0;
    for (var j = 0; j < lines.length; j++) {
        ave += getPixWidth(lines[j]);
    }
    ave = ave / lines.length;
    for (var i = 0; i < lines.length; i++) {
        lines[i] = bringToTarget(lines[i], ave);
    }
    return lines;
}

function bringToTarget(l, target) {
    let line = l;
    let margin = pixWidth[charSetInv.indexOf(line[line.length - 1])];
    if (getPixWidth(line) - target >= margin) {
        line = line.substring(0, line.length - 1);
        bringToTarget(line, target);
    }
    else if ((getPixWidth(line) - target) <= (margin * -1)) {
        line += line[line.length - 1];
        bringToTarget(line, target);
    }
    return line;
}

bot.login(token);
