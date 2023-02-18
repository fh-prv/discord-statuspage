/* eslint-disable no-console */
import { LoggerLogLevel } from '../constants/Interfaces';

export class Logger {
    private static _log(str: string, lvl: LoggerLogLevel) {
        switch (lvl) {
            case 'DEBUG': {
                console.log(str);
                break;
            }
            case 'ERROR': {
                console.log(str);
                break;
            }
            case 'LOG': {
                console.log(str);
                break;
            }
            case 'WARNING': {
                console.log(str);
                break;
            }
        }
    }

    public static debug(str: string): Logger {
        this._log(str, 'DEBUG');
        return this;
    }

    public static error(str: string): Logger {
        this._log(str, 'ERROR');
        return this;
    }

    public static log(str: string): Logger {
        this._log(str, 'LOG');
        return this;
    }

    public static warn(str: string): Logger {
        this._log(str, 'WARNING');
        return this;
    }
}
