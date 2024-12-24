import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} from "vitest";
import { db, citiesTable, statesTable } from "../../src/db";
import { CitiesService } from "../../src/v1/cities/service";

describe("CitiesService", () => {
  beforeAll(async () => {
    await db.delete(statesTable);
    await db.delete(citiesTable);
  });

  afterAll(async () => {
    await db.delete(statesTable);
    await db.delete(citiesTable);
  });

  describe("getAllCities", () => {
    beforeEach(async () => {
      const acre = await db
        .insert(statesTable)
        .values({ name: "Acre", acronym: "AC" })
        .returning();
      const alagoas = await db
        .insert(statesTable)
        .values({ name: "Alagoas", acronym: "AL" })
        .returning();

      await db
        .insert(citiesTable)
        .values({ name: "Rio Branco", state_id: acre[0].id });
      await db
        .insert(citiesTable)
        .values({ name: "Maceió", state_id: alagoas[0].id });
    });

    afterEach(async () => {
      await db.delete(citiesTable);
      await db.delete(statesTable);
    });

    it("should return all cities", async () => {
      const cities = await CitiesService.getAllCities();
      expect(cities).toHaveLength(2);
    });
  });

  describe("getCity", () => {
    let cityId: number = 1;

    beforeEach(async () => {
      const acre = await db
        .insert(statesTable)
        .values({ name: "Acre", acronym: "AC" })
        .returning();

      const result = await db
        .insert(citiesTable)
        .values({ name: "Rio Branco", state_id: acre[0].id })
        .returning();

      cityId = result[0].id;
    });

    afterEach(async () => {
      await db.delete(citiesTable);
      await db.delete(statesTable);
    });

    it("should return a city", async () => {
      const city = await CitiesService.getCity(cityId);
      expect(city).toBeDefined();
    });
  });

  describe("createCity", () => {
    afterEach(async () => {
      await db.delete(citiesTable);
      await db.delete(statesTable);
    });

    it("should create a city", async () => {
      const acre = await db
        .insert(statesTable)
        .values({ name: "Acre", acronym: "AC" })
        .returning();
      const result = await CitiesService.createCity("Rio Branco", acre[0].id);
      expect(result).toBeDefined();
    });
  });

  describe("updateCity", () => {
    let cityId: number = 1;

    beforeEach(async () => {
      const acre = await db
        .insert(statesTable)
        .values({ name: "Acre", acronym: "AC" })
        .returning();

      const result = await db
        .insert(citiesTable)
        .values({ name: "Rio Branco", state_id: acre[0].id })
        .returning();

      cityId = result[0].id;
    });

    afterEach(async () => {
      await db.delete(citiesTable);
      await db.delete(statesTable);
    });

    it("should update a city", async () => {
      const alagoas = await db
        .insert(statesTable)
        .values({ name: "Alagoas", acronym: "AL" })
        .returning();
      const result = await CitiesService.updateCity(
        cityId,
        "Rio Branco",
        alagoas[0].id
      );
      expect(result).toBeDefined();
    });
  });

  describe("deleteCity", () => {
    let cityId: number = 1;

    beforeEach(async () => {
      const acre = await db
        .insert(statesTable)
        .values({ name: "Acre", acronym: "AC" })
        .returning();

      const result = await db
        .insert(citiesTable)
        .values({ name: "Rio Branco", state_id: acre[0].id })
        .returning();

      cityId = result[0].id;
    });

    afterEach(async () => {
      await db.delete(citiesTable);
      await db.delete(statesTable);
    });

    it("should delete a city", async () => {
      const result = await CitiesService.deleteCity(cityId);
      expect(result).toBeDefined();
    });
  });
});
