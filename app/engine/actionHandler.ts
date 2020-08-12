import { TActionHandler } from './types';

export const mkActionHandler = (): TActionHandler => ({ actions: [] });

export let ACTION_HANDLER = mkActionHandler();

export const getActionHandler = () => {
    if (ACTION_HANDLER) {
        return ACTION_HANDLER;
    } else {
        ACTION_HANDLER = mkActionHandler();
    }

    return ACTION_HANDLER;
}
