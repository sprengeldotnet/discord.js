const Discord = require('discord.js');
const client = new Discord.Client();
const http = require('http'),
    https = require('https');

client.on('ready', () => {
    console.log('ready');
    client.user.setActivity('anime | .help', {
        type: 'WATCHING'
    });
});

client.on('message', (message) => {
    if (message.author.bot) return;
    if (message.channel.type == 'dm') {
        message.channel.startTyping();
        setTimeout(function() {
            message.channel.stopTyping();
            return message.channel.send("bruh imagine sending a dm to a bot");
        }, 1000);
    }
    if (!message.guild) return;

    //commands
    if (message.content.startsWith(".")) {
        var command = message.content.substring(1).toLowerCase();
        if (command == 'help') {
            var embed = new Discord.MessageEmbed()
                .setTitle('**Commands:**')
                .setDescription("**.help**  -  This help text.\r**.info**  -  Information about this Bot.\r**.kick** *@user*  -  Kick a Member.\r**.ban** *@user*  -  Ban a Member.\r**.ip** *ip*  -  Returns Information about a specific IP address.\r**.w** *something*  -  Searches for *something* Wikipedia.\r**.domain** *domain*  -  Information about a Domain and it's DNS Records.\r**.meme**  -  Random Meme from Random Subreddit.\r**.nsfw**  -  Returns a Random Picture from /r/nsfw.\r**.hentai**  -  Returns a Random Picture from /r/hentai.\r**.sexy**  -  Returns a Random Picture from /r/SexyButNotPorn.\r**.invite**  -  Invite this Bot.\r**.ping**  -  Ping Test.")
                .setColor('#7289da');
            message.channel.send(embed);
            return;
        } else if (command == 'ping') {
            var embed = new Discord.MessageEmbed()
                .setTitle('Pong! :ping_pong:  ' + client.ws.ping + 'ms')
                .setDescription('Ping me again daddy!!')
                .setColor('#7289da');
            message.channel.send(embed);
            return;
        } else if (command == 'info') {
            var embed = new Discord.MessageEmbed()
                .setTitle('Active on ' + client.guilds.cache.size + ' Discord Servers &\rWatching ' + message.guild.memberCount + ' people on this Server.')
                .setFooter('created by sprengel#0615')
                .setColor('#7289da');
            message.channel.send(embed);
            return;
        } else if (command == 'invite') {
            message.author.send('You can find an invite link here: <https://sprengel.net/discord/>').catch(() => {
                message.channel.send("You can find an invite link here: <https://sprengel.net/discord/>");
                return;
            });
            return;
        }
        //kick
        else if (command.startsWith("kick")) {
            if (message.member.hasPermission("KICK_MEMBERS")) {
                var user = message.mentions.users.first();
                if (user) {
                    var member = message.guild.member(user);
                    if (member) {
                        member.kick('sprengel bot - .kick').then(() => {
                            return message.channel.send("Successfully kicked `" + user.tag + "`");
                        }).catch(() => {
                            return message.channel.send("I am unable to kick `" + user.tag + "`");
                        })
                    } else {
                        return message.channel.send("That user isn't in this guild.");
                    }
                } else {
                    return message.channel.send("You didn't mention the user to kick.");
                }
            } else {
                return message.channel.send("you do not have permission to kick members.");
            }
        }
        //ban
        else if (command.startsWith("ban")) {
            if (message.member.hasPermission("BAN_MEMBERS")) {
                var user = message.mentions.users.first();
                if (user) {
                    var member = message.guild.member(user);
                    if (member) {
                        member.ban({
                            reason: 'sprengel bot - .ban',
                        }).then(() => {
                            return message.channel.send("Successfully banned `" + user.tag + "`");
                        }).catch(() => {
                            return message.channel.send("I am unable to ban `" + user.tag + "`");
                        })
                    } else {
                        return message.channel.send("That user isn't in this guild.");
                    }
                } else {
                    return message.channel.send("You didn't mention the user to ban.");
                }
            } else {
                return message.channel.send("you do not have permission to ban members.");
            }
        }
        if (command == "meme") {
            var str = ["memes", "BlackPeopleTwitter", "dankmemes", "ComedyCemetery", "PrequelMemes"];
            var rand = Math.floor(Math.random() * 5);
            var subr = str[rand];
            https.get('https://www.reddit.com/r/' + subr + '/random.json?limit=1', (resp0) => {
                https.get(resp0.headers.location, (resp) => {
                    let data = '';
                    resp.on('data', chunk => {
                        data += chunk;
                    })
                    resp.on('end', () => {
                        var d = JSON.parse(data)[0]["data"]["children"][0]["data"];
                        var embed = new Discord.MessageEmbed()
                            .setImage(d['url'])
                            .setColor('#7289da')
                            .setTitle(d['title'])
                            .setURL('https://reddit.com' + d['permalink'])
                        message.channel.stopTyping();
                        message.channel.send(embed);
                        return;
                    })
                    return;
                });

            });
        } else if (command.startsWith("ip")) {
            var ip = command.split("ip ")[1];
            message.channel.startTyping();
            http.get('http://ipinfo.io/' + ip, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    var r = JSON.parse(data);
                    var embed = new Discord.MessageEmbed()
                        .setTitle('hostname: ' + r.hostname + '\rcity: ' + r.city + '\rregion: ' + r.region + '\rcountry: ' + r.country + '\rloc: ' + r.loc + '\rorganisation: ' + r.org + '\rpostal: ' + r.postal + '\rtimezone: ' + r.timezone)
                        .setAuthor('' + r['ip'] + ':')
                        .setColor('#7289da');
                    message.channel.stopTyping();
                    message.channel.send(embed);
                    return;
                });
                res.on('error', () => {
                    console.log('error');
                });
            });
        } else if (command.startsWith("w")) {
            var s = command.split("w ")[1];
            message.channel.startTyping();
            https.get('https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=' + encodeURIComponent(s), (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    message.channel.stopTyping();
                    var r = JSON.parse(data);
                    if (r['query']['searchinfo']['totalhits'] >= 1) {
                        return message.channel.send((r['query']['search'][0]['title'] + " - " + r['query']['search'][0]['snippet'] + "...").replace(/<[^>]*>?/gm, ''));
                    } else {
                        return message.channel.send("no results found.");
                    }
                });
                res.on('error', () => {
                    console.log('error');
                });
            });
        } else if (command.startsWith("domain")) {
            var z = command.split("domain ")[1];
            message.channel.startTyping();
            https.get('https://host.io/api/full/' + z + '?token=TOKEN', (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    var r = JSON.parse(data);
                    if (r['dns']['domain'] == null) return message.channel.stopTyping();
                    message.channel.send("could not find anything. sowwy");
                    var _a = '\r\n';
                    if (r['dns']['a'][0] != null) {
                        r['dns']['a'].forEach(ip => {
                            if (_a == '\r\n') {
                                _a = "`" + ip + "` - `" + r['ipinfo'][ip]['country'] + "` - `" + r['ipinfo'][ip]['asn']['name'] + "`\r\n";
                            } else {
                                _a += "`" + ip + "` - `" + r['ipinfo'][ip]['country'] + "` - `" + r['ipinfo'][ip]['asn']['name'] + "`\r\n";
                            }
                        });
                    }
                    var _aaaa = '\r\n';
                    if (r['dns']['aaaa'] != null) {
                        r['dns']['aaaa'].forEach(ip => {
                            if (_aaaa == '\r\n') {
                                _aaaa = "`" + ip + "` - `" + r['ipinfo'][ip]['country'] + "` - `" + r['ipinfo'][ip]['asn']['name'] + "`\r\n";
                            } else {
                                _aaaa += "`" + ip + "` - `" + r['ipinfo'][ip]['country'] + "` - `" + r['ipinfo'][ip]['asn']['name'] + "`\r\n";
                            }
                        });
                    }
                    var _mx = '\r\n';
                    if (r['dns']['mx'] != null) {
                        r['dns']['mx'].forEach(mx => {
                            if (_mx == '\r\n') {
                                _mx = "`" + mx + "`\r\n";
                            } else {
                                _mx += "`" + mx + "`\r\n";
                            }
                        });
                    }
                    var _ns = '\r\n';
                    if (r['dns']['ns'] != null) {
                        r['dns']['ns'].forEach(ns => {
                            if (_ns == '\r\n') {
                                _ns = "`" + ns + "`\r\n";
                            } else {
                                _ns += "`" + ns + "`\r\n";
                            }
                        });
                    }
                    var embed = new Discord.MessageEmbed()
                        .setTitle(r['domain'] + ":")
                        .setDescription('**A:**\r\n' + _a + '**AAAA:**\r\n' + _aaaa + '**MX:**\r\n' + _mx + '**NS:**\r\n' + _ns)
                        .setColor('#7289da');
                    message.channel.stopTyping();
                    message.channel.send(embed);
                    return;
                });
                res.on('error', () => {
                    console.log('error');
                });
            });
        } else if (command == "hentai" || command == "nsfw" || command == "sexy") {
            if (message.channel.nsfw) {
                message.channel.startTyping();
                if (command == "hentai") {
                    https.get('https://www.reddit.com/r/hentai/random.json?limit=1', (resp0) => {
                        https.get(resp0.headers.location, (resp) => {
                            let data = '';
                            resp.on('data', chunk => {
                                data += chunk;
                            })
                            resp.on('end', () => {
                                var d = JSON.parse(data)[0]["data"]["children"][0]["data"];
                                var embed = new Discord.MessageEmbed()
                                    .setImage(d['url'])
                                    .setColor('#7289da')
                                    .setTitle(d['title'])
                                    .setURL('https://reddit.com' + d['permalink'])
                                message.channel.stopTyping();
                                message.channel.send(embed);
                                return;
                            })
                            return;
                        });

                    });
                } else if (command == "nsfw") {
                    https.get('https://www.reddit.com/r/nsfw/random.json?limit=1', (resp0) => {
                        https.get(resp0.headers.location, (resp) => {
                            let data = '';
                            resp.on('data', chunk => {
                                data += chunk;
                            })
                            resp.on('end', () => {
                                var d = JSON.parse(data)[0]["data"]["children"][0]["data"];
                                var embed = new Discord.MessageEmbed()
                                    .setImage(d['url'])
                                    .setColor('#7289da')
                                    .setTitle(d['title'])
                                    .setURL('https://reddit.com' + d['permalink'])
                                message.channel.stopTyping();
                                message.channel.send(embed);
                                return;
                            })
                            return;
                        });

                    });
                } else if (command == "sexy") {
                    https.get('https://www.reddit.com/r/SexyButNotPorn/random.json?limit=1', (resp0) => {
                        https.get(resp0.headers.location, (resp) => {
                            let data = '';
                            resp.on('data', chunk => {
                                data += chunk;
                            })
                            resp.on('end', () => {
                                var d = JSON.parse(data)[0]["data"]["children"][0]["data"];
                                var embed = new Discord.MessageEmbed()
                                    .setImage(d['url'])
                                    .setColor('#7289da')
                                    .setTitle(d['title'].replace('&amp;', '&'))
                                    .setURL('https://reddit.com' + d['permalink'])
                                message.channel.stopTyping();
                                message.channel.send(embed);
                                return;
                            })
                            return;
                        });

                    });
                }
            } else {
                return message.channel.send("This command may only be invoked in an NSFW channel.");
            }
        }
    } else {
        if (message.content == 'hi' || message.content.includes("hello") || message.content.includes("hey")) {
            return message.react('👋');
        } else if (message.content == '!d bump') {
            var rand = Math.floor(Math.random() * 2);
            if (rand == 1) {
                return message.channel.send('https://cdn.sprengel.net/bump.jpg');
            }
            return;
        } else if (message.mentions.has(client.user)) {
            if (message.channel.nsfw) {
                if (message.content.endsWith("?")) {
                    var m = ["yes daddy", "no >.<", "yes pwease", "In case you're wondering what I'm doing right now, I'm currently sexually destroying you in my head (:"];
                    var rand = Math.floor(Math.random() * 4);
                    return message.channel.send(m[rand]);
                } else {
                    var m = ["hi daddy", "what do you want from me daddy", "punish me daddy", "can you help me pwease", "daddy likies? (;", "murr~~", "rawrrr", "I just want to be happy. ||And naked.||", "oh my gawd. I'm so hard", "hehe ;) *rubbies your bulgy wolgy*"];
                    var rand = Math.floor(Math.random() * 10);
                    return message.channel.send(m[rand]);
                }
            } else {
                if (message.content.endsWith("?")) {
                    var m = ["yeah i agree", "lmao no", "yes", "bruh what", "what?", "no"];
                    var rand = Math.floor(Math.random() * 6);
                    return message.channel.send(m[rand]);
                } else {
                    var m = ["huh?", "that's me i guess..", "hi", "?", "k", "stfu", "???", "hey"];
                    var rand = Math.floor(Math.random() * 8);
                    return message.channel.send(m[rand]);
                }
            }
        } else if (message.content.toLowerCase() == 'f') {
            var m = ["F", "f"];
            var rand = Math.floor(Math.random() * 2);
            return message.channel.send(m[rand]);
        } else if (message.content.toLowerCase().includes("uwu") || message.content.toLowerCase().includes("owo") || message.content.toLowerCase().includes("x3") || message.content.toLowerCase().includes(":3")) {
            var m = ["OwO", "uwu", ":3", "x3", "Rawr", "*nuzzles*", "Rawr x3", "rawrr", ">.<"];
            var rand = Math.floor(Math.random() * 9);
            return message.channel.send(m[rand]);
        }
    }
});

client.login('TOKEN');
