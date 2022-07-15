var config = require('./config');

const SteamUser = require("steam-user");
const SteamTotp = require("steam-totp");
const SteamCommunity = require('steamcommunity');

const path = require('path');
const request = require('request');

var mysql = require('mysql');

let user = new SteamUser();
let community = new SteamCommunity();

console.log("Starting SteamLogger...");

const steam_user = ``;
const steam_pass = ``;
const steam_shared_secret = "";
const steam_api = ``;

const db_host = `localhost`;
const db_user = `root`;
const db_pass = ``;
const db_database = `steamlogger`;
const db_port = 3306;
const db_multipleStatements = false;

var connection = mysql.createConnection({
      host: `${db_host}`,
      user: `${db_user}`,
      password: `${db_pass}`,
      database: `${db_database}`,
      port: `${db_port}`,
      multipleStatements: db_multipleStatements
})

connection.connect(function(err) {
    if (err) throw err

});

function handleDisconnect(connection) {
  connection.on('error', function(err) {
    if (!err.fatal) {
      return;
    }

    if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
      throw err;
    }

    console.log('Re-connecting lost connection: ' + err.stack);

    connection = mysql.createConnection(connection.config);
    handleDisconnect(connection);
    connection.connect();
  });
}
handleDisconnect(connection);

const colors = {
    red: "\x1b[31m%s\x1b[0m",
    purple: "\x1b[35m%s\x1b[0m",
    green: "\x1b[32m%s\x1b[0m",
    cyan: "\x1b[36m%s\x1b[0m",
    yellow: "\x1b[33m%s\x1b[0m"
}

function login(){

    user.logOn({
        "accountName": `${steam_user}`,
        "password": `${steam_pass}`,
        "twoFactorCode": SteamTotp.getAuthCode(`${steam_shared_secret}`)
    })

    user.on("loggedOn", function() {
    console.log(colors.green, "Successfully logged into Steam!");
    user.on('Profile', function(communityitemid) {
        console.log(communityitemid);
    })

    user.on("webSession", function(sessionID, cookies) {
        community.setCookies(cookies);

        user.setPersona(SteamUser.EPersonaState.Online);

        user.on('friendMessage', function(steamID, message) {
            var steamID3 = steamID.getSteam3RenderedID();
            var steamID64 = steamID.getSteamID64();

            let Sprofile = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steam_api}&steamids=${steamID64}`;
            let options = {json: true};

            console.log("Friend message from " + steamID.getSteam3RenderedID() + ": " + message);

            function InsertDATA(Sid3, Sid64, Spersonaname, Savatar, Smsg) {
                // connection.query(`INSERT INTO friends (steamID3, steamID64, personaname) VALUES (?,?,?, (WHERE NOT EXISTS (SELECT * FROM friends WHERE steamID64 = (?)))) `, [Sid3, Sid64, Spersonaname, Sid64], function(err, result) {
                //     if (err) throw err
                // });
               
                connection.query(`INSERT INTO received (steamID3, steamID64, personaname, avatar, message) VALUES (?,?,?,?,?)`, [Sid3, Sid64, Spersonaname, Savatar, Smsg], function(err, result) {
                    if (err) throw err
                });
            }

            request(Sprofile, options, (error, res, body) => {
                var personaname = body["response"]["players"][0]["personaname"];
                var avatar = body["response"]["players"][0]["avatarfull"];
                if (error) {
                    return  console.log(error)
                };

                if (!error && res.statusCode == 200) {
                    InsertDATA(steamID3, steamID64, personaname, avatar, message);

                };
            });

        });
        
    });
});
}

login();
