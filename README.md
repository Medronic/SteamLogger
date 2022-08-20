# SteamLogger
### Start saving your steam message history with Steam Logger.

![image](https://user-images.githubusercontent.com/38893379/185757691-26f2f24d-7b4b-4a08-8e18-fa407c68eeba.png)
![image](https://user-images.githubusercontent.com/38893379/185759371-30a4f7a8-beda-455f-a63d-f5da9c16b631.png)

---

# Requirements
To this work 24/7 and save your energy, I recommend you buy a VPS.

- NodeJS
- MySQL (Cloud or Local)
- PM2 (Opcional, but i recommend)

# Configuring

MySQL

Create a database and then create table "receveid". Code below.

```sh
CREATE TABLE `received` (
	`msg_id` INT(11) NOT NULL AUTO_INCREMENT,
	`steamID3` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',
	`steamID64` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',
	`personaname` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',
	`avatar` TEXT NOT NULL COLLATE 'utf8_general_ci',
	`message` TEXT NOT NULL COLLATE 'utf8_general_ci',
	`date` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
	PRIMARY KEY (`msg_id`) USING BTREE
)
```

Adding Steam Account and Database Connection

1. Open SteamLogger.js with some text editor.
1. Edit value of const inicitalizing with steam_ and db_ (Line 15 - 24)
1. After that, you can launch SteamLogger. Process below.

# Starting

`$ node SteamLogger.js`
