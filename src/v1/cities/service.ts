import { db, citiesTable } from "../../db";
import { eq } from "drizzle-orm";

export class CitiesService {
  static async getAllCities() {
    return db.select().from(citiesTable);
  }

  static async getCity(id: number) {
    return db.select().from(citiesTable).where(eq(citiesTable.id, id)).limit(1);
  }

  static async createCity(name: string, state_id: number) {
    return db.insert(citiesTable).values({ name, state_id: state_id });
  }

  static async updateCity(id: number, name: string, state_id: number) {
    return db
      .update(citiesTable)
      .set({ name, state_id: state_id })
      .where(eq(citiesTable.id, id));
  }

  static async deleteCity(id: number) {
    return db.delete(citiesTable).where(eq(citiesTable.id, id));
  }
}
