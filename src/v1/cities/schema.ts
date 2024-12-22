import { z } from "zod";

export const getAllCitiesDocs = {
  tags: ["cities"],
  description: "Get all cities",
  response: {
    200: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        state_id: z.number(),
      })
    ),
  },
};

export const getCityDocs = {
  tags: ["cities"],
  description: "Get city by id",
  params: z.object({
    id: z.string(),
  }),
  response: {
    200: z.object({
      id: z.number(),
      name: z.string(),
      state_id: z.number(),
    }),
    404: z.object({
      message: z.string(),
    }),
  },
};

export const createCityDocs = {
  tags: ["cities"],
  description: "Create city",
  body: z.object({
    name: z.string(),
    state_id: z.number(),
  }),
  response: {
    201: z.null(),
    400: z.object({
      message: z.string(),
    }),
  },
};

export const updateCityDocs = {
  tags: ["cities"],
  description: "Update city",
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    name: z.string(),
    state_id: z.number(),
  }),
  response: {
    200: z.null(),
    400: z.object({
      message: z.string(),
    }),
  },
};

export const deleteCityDocs = {
  tags: ["cities"],
  description: "Delete city",
  params: z.object({
    id: z.string(),
  }),
  response: {
    200: z.null(),
    400: z.object({
      message: z.string(),
    }),
  },
};
