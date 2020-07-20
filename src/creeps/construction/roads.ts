import { getFirstRoom, SpawnableOrNull } from 'creeps/utils';

const buildRoad = (room: Room, from: RoomPosition, to: RoomPosition) => {
    const tiles = room.findPath(from, to, { ignoreCreeps: true });
    tiles.map((tile) => room.createConstructionSite(tile.x, tile.y, STRUCTURE_ROAD));
};

export const buildRoadsSpawnToSources = (room: Room) => {
    const sources = room.find(FIND_SOURCES);
    const spawn = room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure instanceof StructureSpawn;
        }
    })[0];
    sources.map((source) => buildRoad(room, source.pos, spawn.pos));
};
