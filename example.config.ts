/** ! Please rename this file from "example.config.ts" to "config.ts" to use this code ! */

import { Languages } from './constants/Interfaces';

export const APIS = []; // The URLs of the Statuspages
export const CheckTime = 60_000; // Default: 60_000
export const Colors = {
    GRAY: 0x282c34,
    GREEN: 0x38A736,
    ORANGE: 0xEA7D17,
    RED: 0xD44D44,
    YELLOW: 0xFFC327,
};
export const Language: Languages = 'en'; // Available langs: de en
export const Webhook = ''; // The Webhook URL
