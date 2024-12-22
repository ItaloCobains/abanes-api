import z from "zod";

export const getAllStatesDocs = {
  tags: ["states"],
  description: "Get all states",
  response: {
    200: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        acronym: z.string(),
      })
    ),
  },
};

export const getStatesDocs = {
  tags: ["states"],
  description: "Get a state",
  params: z.object({
    id: z.string().refine((val) => !isNaN(Number(val)), {
      message: "ID must be a number",
    }),
  }),
  response: {
    200: z.object({
      id: z.number(),
      name: z.string(),
      acronym: z.string(),
    }),
    404: z.object({
      message: z.string(),
    }),
  },
};

export const createStateDocs = {
  tags: ["states"],
  description: "Create a state",
  body: z.object({
    name: z.string(),
    acronym: z.string().min(2),
  }),
  response: {
    201: z.null(),
    400: z.object({
      message: z.string(),
    }),
  },
};

export const updateStateDocs = {
  tags: ["states"],
  description: "Update a state",
  params: z.object({
    id: z.string().refine((val) => !isNaN(Number(val)), {
      message: "ID must be a number",
    }),
  }),
  body: z.object({
    name: z.string(),
    acronym: z.string().min(2),
  }),
  response: {
    404: z.object({
      message: z.string(),
    }),
    204: z.null(),
  },
};

export const deleteStateDocs = {
  tags: ["states"],
  description: "Delete a state",
  params: z.object({
    id: z.string().refine((val) => !isNaN(Number(val)), {
      message: "ID must be a number",
    }),
  }),
  response: {
    204: z.null(),
    404: z.object({
      message: z.string(),
    }),
  },
};
