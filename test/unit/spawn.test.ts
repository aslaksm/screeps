import { assert } from 'chai';
import { maxSpawnableSize, getCost, Template } from '../../src/utils/spawn';

describe('getCost', () => {
    it('should give the correct cost', () => {
        const parts = [WORK, CARRY, MOVE];
        assert.equal(getCost(parts), 200);
    });
});

describe('MaxSpawnableSize', () => {
    it('should give the correct size', () => {
        const resources = 640;
        assert.equal(maxSpawnableSize(resources, Template.WORKER), 2);
    });
});
