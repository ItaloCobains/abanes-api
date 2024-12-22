import { db, statesTable } from "../../db";
import { eq } from "drizzle-orm";

export class StatesService {
  static async getAllStates() {
    return db.select().from(statesTable);
  }

  static async getState(id: number) {
    return db.select().from(statesTable).where(eq(statesTable.id, id)).limit(1);
  }

  static async createState(name: string, acronym: string) {
    return db.insert(statesTable).values({ name, acronym });
  }

  static async updateState(id: number, name: string, acronym: string) {
    return db
      .update(statesTable)
      .set({ name, acronym })
      .where(eq(statesTable.id, id));
  }

  static async deleteState(id: number) {
    return db.delete(statesTable).where(eq(statesTable.id, id));
  }
}
