import { TAction } from './types';
import { getActionHandler } from './actionHandler';

const ACTION_HANDLER = getActionHandler();

export const dispatch = (action: TAction) => ACTION_HANDLER.actions.push(action);
