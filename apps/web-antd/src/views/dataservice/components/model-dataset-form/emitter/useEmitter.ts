import { mitt } from '@vben/utils';

export const emitter = mitt();

export enum EMITTER_EVENT {
  DELETE_NODE = 'DELETE_NODE',
  NODE_CONTEXT_MENU = 'NODE_CONTEXT_MENU',
  SELECT_TABLE = 'SELECT_TABLE'
}
