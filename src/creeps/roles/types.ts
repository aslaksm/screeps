export enum Role {
    IDLE = 'idle',
    HARVESTER = 'harvester',
    BUILDER = 'builder',
    UPGRADER = 'upgrader'
}

export type RoleNoIdle = Exclude<Role, Role.IDLE>;

export enum Priority {
    NONE = 0,
    LOW = 0.5,
    NORMAL = 1,
    HIGH = 2,
    CRITICAL = 1000
}

export enum Size {
    SMALL = 1,
    MEDIUM = 2,
    LARGE = 3
}
