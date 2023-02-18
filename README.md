# 🚨 Discord Statuspage
Welcome to `discord-statuspage`. This is a little side-project which uses the API of StatusPage.io to send a message via a discord webhook into a channel if a new incident happens.

## ⚙️ Configuration
To customize the messages and more you can create a config called `config.ts`.
To create a `config.ts` simply copy the `example.config.ts` and rename it.

`APIS`: An array of all the statuspage domains you want to watch. Just add the domain names as a string into this array. <br>
`CheckTime` The time in ms the page should be checked. <br>
`Colors`: To customize the colors just edit the HEX-Codes after `0x`. <br>
`Language`: The language of all the messages and logs. (Available languages: `de`, `en`) <br>
`Webhook`: The url of the webhook where the incident updates should be send to. <br>

## 💬 Translations
To add a translation just create a `.ts` file (like `de.ts`) in `/translations` and enable it in `index.ts` by adding it into the switch statement. Then you can submit a pull request on this and I'll add the translation. Thank you for contributing 💚 

## 🎧 Support
Since this is just a little side-project of myself, there won't be any big support on this project.
If you find any errors and bugs, please create an issue. If you need anything else, have a look at the repository diecussions.
For more help have a look into the wiki.

© 2023 fh.prv - MIT Licence
