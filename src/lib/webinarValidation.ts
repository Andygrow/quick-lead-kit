import { z } from 'zod';

export const webinarRegistrationSchema = z.object({
  name: z.string()
    .trim()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(100, { message: "El nombre no puede exceder 100 caracteres" }),
  email: z.string()
    .trim()
    .email({ message: "Por favor, ingresa un email válido" })
    .max(255, { message: "El email no puede exceder 255 caracteres" }),
  phone: z.string()
    .trim()
    .min(7, { message: "El teléfono debe tener al menos 7 dígitos" })
    .max(20, { message: "El teléfono no puede exceder 20 caracteres" }),
});

export type WebinarRegistrationData = z.infer<typeof webinarRegistrationSchema>;

export const programRegistrationSchema = z.object({
  name: z.string()
    .trim()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(100, { message: "El nombre no puede exceder 100 caracteres" }),
  email: z.string()
    .trim()
    .email({ message: "Por favor, ingresa un email válido" })
    .max(255, { message: "El email no puede exceder 255 caracteres" }),
  phone: z.string()
    .trim()
    .min(7, { message: "El teléfono debe tener al menos 7 dígitos" })
    .max(20, { message: "El teléfono no puede exceder 20 caracteres" }),
  isAlternateDate: z.boolean().optional(), // For March waitlist
  linkedinProfile: z.string()
    .trim()
    .url({ message: "Por favor, ingresa una URL válida de LinkedIn" })
    .refine((url) => url.includes('linkedin.com'), {
      message: "Debe ser un enlace de LinkedIn válido"
    })
    .optional()
    .or(z.literal('')),
  courseObjective: z.string()
    .trim()
    .min(10, { message: "Por favor, cuéntanos más sobre tu objetivo (mínimo 10 caracteres)" })
    .max(500, { message: "El objetivo no puede exceder 500 caracteres" }),
});

export type ProgramRegistrationData = z.infer<typeof programRegistrationSchema>;
