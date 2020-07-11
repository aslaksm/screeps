// memory extension samples
interface CreepMemory {
  role: Role;
  room?: string;
  working?: boolean;
  building?: boolean;
  upgrading?: boolean;
}

declare const enum Role {
  IDLE = 'idle',
  HARVESTER = 'harvester',
  BUILDER = 'builder',
  UPGRADER = 'upgrader'
}

declare const enum Priority {
  NONE = 0,
  LOW = 0.5,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 1000
}

interface Memory {
  uuid: number;
  log: any;
  roles: { [key in Role]: Priority };
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}

type StorageStructure = StructureExtension | StructureContainer | StructureSpawn | StructureTower;
