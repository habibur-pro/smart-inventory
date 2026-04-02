import { z } from 'zod'

const createRestockQueueValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'RestockQueue name is required.' }),
  }),
})

export const RestockQueueValidation = {
  createRestockQueueValidationSchema,
}
