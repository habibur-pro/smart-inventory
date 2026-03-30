import { z } from 'zod'

const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Product name is required.' }),
  }),
})

export const ProductValidation = {
  createProductValidationSchema,
}
