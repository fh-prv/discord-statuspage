/* eslint-disable no-console */
import { resolve } from 'node:path';
import { APIS, Language } from './config';
import { version } from './package.json';
import { StatusPageChecker } from './structures/StatusPageChecker';
import TranslationsDE from './translations/de';
import TranslationsEN from './translations/en';

console.log('─────────────────────────────────────────────────────');
console.log(' ');
console.log(`
╔═══╗─────────────╔╗──╔═══╗╔╗───╔╗
╚╗╔╗║─────────────║║──║╔═╗╠╝╚╗─╔╝╚╗
─║║║╠╦══╦══╦══╦═╦═╝║──║╚══╬╗╔╬═╩╗╔╬╗╔╦══╦══╦══╦══╦══╗
─║║║╠╣══╣╔═╣╔╗║╔╣╔╗╠══╬══╗║║║║╔╗║║║║║║══╣╔╗║╔╗║╔╗║║═╣
╔╝╚╝║╠══║╚═╣╚╝║║║╚╝╠══╣╚═╝║║╚╣╔╗║╚╣╚╝╠══║╚╝║╔╗║╚╝║║═╣
╚═══╩╩══╩══╩══╩╝╚══╝──╚═══╝╚═╩╝╚╩═╩══╩══╣╔═╩╝╚╩═╗╠══╝
────────────────────────────────────────║║────╔═╝║
────────────────────────────────────────╚╝────╚══╝`);
console.log(' ');
console.log(`by fh.prv <info@fhprv.de> ・ v${version} ・ © 2023 fh.prv - MIT Licence`);
console.log(' ');
console.log('─────────────────────────────────────────────────────');

let translations = TranslationsEN;

switch (Language) {
    case 'de': {
        translations = TranslationsDE;
        break;
    }
    case 'en':
    default: {
        translations = TranslationsEN;
        break;
    }
}

for (const API of APIS) {
    const name = new URL(API).hostname.split('.')[0];

    new StatusPageChecker({
        db: resolve(__dirname, `./db/${name}.json`),
        name,
        translations,
        url: API,
    });
}
