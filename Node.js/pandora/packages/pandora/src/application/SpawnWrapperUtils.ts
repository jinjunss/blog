import wrap = require('pandora-spawn-wrap');
import {PANDORA_PROCESS} from '../const';
import {ProcessRepresentation} from '../domain';
import {ProcessContext} from './ProcessContext';
import {Facade} from '../Facade';

const wrapFile = require.resolve('./spawnWrapper');
const DEFAULT_WRAP_MAX_DEPTH = 2; // Level 2 means first level children

export class SpawnWrapperUtils {
  private static unwrapFn: () => void;

  static wrap() {
    if (!SpawnWrapperUtils.unwrapFn) {
      SpawnWrapperUtils.unwrapFn = wrap([wrapFile]);
    }
  }

  static unwrap() {
    if (SpawnWrapperUtils.unwrapFn) {
      this.unwrapFn();
      this.unwrapFn = null;
    }
  }

  static setAsFirstLevel() {
    process.env.PANDORA_CURRENT_WRAP_LEVEL = '1';
    process.env.PANDORA_DO_NOT_FOLLOW_NPM = 'true';
    process.env.PANDORA_DO_NOT_FOLLOW_SHEBANG = 'true';
  }

  static increaseLevel() {
    const currentLevel = process.env.PANDORA_CURRENT_WRAP_LEVEL
      ? parseInt(process.env.PANDORA_CURRENT_WRAP_LEVEL, 10)
      : null;

    if(currentLevel) {
      process.env.PANDORA_CURRENT_WRAP_LEVEL = (currentLevel + 1) + '';
    }
  }

  static decideFollow(): boolean {

    const maxLevel: number = process.env.PANDORA_WRAP_MAX_DEPTH
      ? parseInt(process.env.PANDORA_WRAP_MAX_DEPTH, 10)
      : null || DEFAULT_WRAP_MAX_DEPTH;

    const currentLevel = process.env.PANDORA_CURRENT_WRAP_LEVEL
      ? parseInt(process.env.PANDORA_CURRENT_WRAP_LEVEL, 10)
      : null;

    if(!currentLevel) {
      return false;
    }

    return !(currentLevel >= maxLevel);

  }

  static shimProcessContext() {
    let processRepresentation: ProcessRepresentation = <any> {};
    try {
      processRepresentation = JSON.parse(process.env[PANDORA_PROCESS]);
    } catch (err) {
      // ignore
    }
    const context = new ProcessContext(processRepresentation);
    Facade.set('processContext', context.processContextAccessor);
    return context;
  }

}
