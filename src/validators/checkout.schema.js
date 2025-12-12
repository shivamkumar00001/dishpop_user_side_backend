import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  tableNumber: z.number({
    required_error: "Table number is required",
    invalid_type_error: "Table number must be a number"
  }),
  phoneNumber: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .optional(),
  description: z.string().optional(),
  items: z
    .array(
      z.object({
        itemId: z.string().min(1),
        name: z.string().min(1),
        qty: z.number().min(1),
        price: z.number().min(0),
        imageUrl: z.string().url()
      })
    )
    .min(1, "At least one item must be ordered")
});
