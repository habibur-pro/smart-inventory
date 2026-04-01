import { z } from 'zod'

const createOrderValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Order name is required.' }),
  }),
})

export const OrderValidation = {
  createOrderValidationSchema,
}
