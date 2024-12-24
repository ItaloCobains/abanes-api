import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} from "vitest";
import { StatesService } from "../../src/v1/states/service";
import { db, statesTable } from "../../src/db";

describe("StatesService", () => {
  beforeAll(async () => {
    await db.delete(statesTable);
  });

  afterAll(async () => {
    await db.delete(statesTable);
  });

  describe("getAllStates", () => {
    beforeEach(async () => {
      await db.insert(statesTable).values({ name: "Acre", acronym: "AC" });
      await db.insert(statesTable).values({ name: "Alagoas", acronym: "AL" });
    });

    afterEach(async () => {
      await db.delete(statesTable);
    });

    it("should return all states", async () => {
      const states = await StatesService.getAllStates();
      expect(states).toHaveLength(2);
    });
  });

  describe("getState", () => {
    let stateId: number = 1;

    beforeEach(async () => {
      const result = await db
        .insert(statesTable)
        .values({ name: "Acre", acronym: "AC" })
        .returning();

      stateId = result[0].id;
    });

    afterEach(async () => {
      await db.delete(statesTable);
    });

    it("should return a state", async () => {
      const state = await StatesService.getState(stateId);
      expect(state).toBeDefined();
    });
  });

  describe("createState", () => {
    afterEach(async () => {
      await db.delete(statesTable);
    });

    it("should create a state", async () => {
      const result = await StatesService.createState("Acre", "AC");
      expect(result).toBeDefined();
    });
  });

  describe("updateState", () => {
    let stateId: number = 1;

    beforeEach(async () => {
      const result = await db
        .insert(statesTable)
        .values({ name: "Acre", acronym: "AC" })
        .returning();

      stateId = result[0].id;
    });

    afterEach(async () => {
      await db.delete(statesTable);
    });

    it("should update a state", async () => {
      const result = await StatesService.updateState(stateId, "Acre", "AC");
      expect(result).toBeDefined();
    });
  });

  describe("deleteState", () => {
    let stateId: number = 1;

    beforeEach(async () => {
      const result = await db
        .insert(statesTable)
        .values({ name: "Acre", acronym: "AC" })
        .returning();

      stateId = result[0].id;
    });

    it("should delete a state", async () => {
      const result = await StatesService.deleteState(stateId);
      expect(result).toBeDefined();
    });
  });
});
