import { findCreepsByRole, getRoomFreeCapacity, getRoomCapacity, findAllCreeps } from "creeps/utils";
import { Role } from "creeps/types";

enum Constants {
  HARVEST_THRESHOLD = 0.5
}

export enum Mode {
  NORMAL = 0,
  NO_HARVEST = 1,
  NO_BUILD = 2,
  NO_UPGRADE = 3,
  HARVEST_ONLY = 4,
  BUILD_ONLY = 5,
  UPGRADE_ONLY = 6
}
const modeArray = [
  [0.3, 0.4, 0.4],
  [0.0, 0.5, 0.5],
  [0.5, 0.0, 0.5],
  [0.5, 0.5, 0.0],
  [1.0, 0.0, 0.0],
  [0.0, 1.0, 0.0],
  [0.0, 0.0, 1.0]
];

/* TODO: Currently takes in an array. Will improve this with new FSM
 * Also arbitrarily rebalances regardless of last creep role, potentially disturbing
 * ongoing activities
 * Basically just a dumb solution
 */
const balanceToRatio = (ratios: number[]) => {
  const creeps = findAllCreeps();
  const amount = creeps.length;
  const harvesters = Math.floor(ratios[0] * amount);
  const builders = Math.floor((ratios[0] + ratios[1]) * amount);
  const upgraders = Math.floor((ratios[0] + ratios[1] + ratios[2]) * amount);

  creeps.slice(0, harvesters).map((creep) => (creep.memory.role = Role.HARVESTER));
  creeps.slice(harvesters, builders).map((creep) => (creep.memory.role = Role.BUILDER));
  creeps.slice(builders, upgraders).map((creep) => (creep.memory.role = Role.UPGRADER));
};

const shouldStopHarvest = (room: Room) => getRoomFreeCapacity(room) === 0;
const shouldStopBuild = (room: Room) => room.find(FIND_CONSTRUCTION_SITES).length === 0;
// Should we ever stop upgrading?
const shouldStopUpgrade = (room: Room) => false;

const shouldResumeHarvest = (room: Room) =>
  getRoomFreeCapacity(room) / getRoomCapacity(room) > Constants.HARVEST_THRESHOLD;
const shouldResumeBuild = (room: Room) => room.find(FIND_CONSTRUCTION_SITES).length > 0;
const shouldResumeUpgrade = (room: Room) => true;

// This could all EASILY be one function

const normal = () => {
  balanceToRatio(modeArray[Mode.NORMAL]);
  return Mode.NORMAL;
};

const noHarvest = () => {
  balanceToRatio(modeArray[Mode.NO_HARVEST]);
  return Mode.NO_HARVEST;
};

const noBuild = () => {
  balanceToRatio(modeArray[Mode.NO_BUILD]);
  return Mode.NO_BUILD;
};

const noUpgrade = () => {
  balanceToRatio(modeArray[Mode.NO_UPGRADE]);
  return Mode.NO_UPGRADE;
};

const harvestOnly = () => {
  balanceToRatio(modeArray[Mode.HARVEST_ONLY]);
  return Mode.HARVEST_ONLY;
};

const buildOnly = () => {
  balanceToRatio(modeArray[Mode.BUILD_ONLY]);
  return Mode.BUILD_ONLY;
};

const upgradeOnly = () => {
  balanceToRatio(modeArray[Mode.UPGRADE_ONLY]);
  return Mode.UPGRADE_ONLY;
};

/*
 * Check if some harvesters need to be rebalanced
 * TODO: This is an FSM. Figure out a better way to design FSM's in TS that allows us to extend
 *  The roles easily
 */
export const balanceCreeps = (room: Room, mode: Mode): Mode => {
  switch (mode) {
    case Mode.NORMAL: {
      if (shouldStopHarvest(room)) mode = noHarvest();
      else if (shouldStopBuild(room)) mode = noBuild();
      else if (shouldStopUpgrade(room)) mode = noUpgrade();
      break;
    }

    case Mode.NO_HARVEST: {
      if (shouldResumeHarvest(room)) mode = normal();
      else if (shouldStopBuild(room)) mode = upgradeOnly();
      else if (shouldStopUpgrade(room)) mode = buildOnly();
      break;
    }
    case Mode.NO_BUILD: {
      if (shouldResumeBuild(room)) mode = normal();
      else if (shouldStopHarvest(room)) mode = upgradeOnly();
      else if (shouldStopUpgrade(room)) mode = harvestOnly();
      break;
    }
    case Mode.NO_UPGRADE: {
      if (shouldResumeUpgrade(room)) mode = normal();
      else if (shouldStopHarvest(room)) mode = buildOnly();
      else if (shouldStopBuild(room)) mode = harvestOnly();
      break;
    }

    case Mode.HARVEST_ONLY: {
      if (shouldResumeBuild(room)) mode = noUpgrade();
      else if (shouldResumeUpgrade(room)) mode = noBuild();
      break;
    }
    case Mode.BUILD_ONLY: {
      if (shouldResumeHarvest(room)) mode = noUpgrade();
      else if (shouldResumeUpgrade(room)) mode = noHarvest();
      break;
    }
    case Mode.UPGRADE_ONLY: {
      if (shouldResumeHarvest(room)) mode = noBuild();
      else if (shouldResumeBuild(room)) mode = noHarvest();
      break;
    }

    default:
      break;
  }

  return mode;
};
