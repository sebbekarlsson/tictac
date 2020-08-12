import { AppState } from './appTypes';
import { TAction } from './types';
import { getActionHandler } from './actions';

const ACTION_HANDLER = getActionHandler();

export const dispatch = (action: TAction) => ACTION_HANDLER.actions.push(action);
