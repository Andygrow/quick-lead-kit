import { z } from 'zod';

// List of free email domains
const freeEmailDomains = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
  'icloud.com', 'mail.com', 'protonmail.com', 'zoho.com', 'yandex.com',
  'gmx.com', 'live.com', 'msn.com', 'me.com', 'inbox.com', 'fastmail.com',
  'tutanota.com', 'mailinator.com', 'guerrillamail.com', 'tempmail.com'
];

export const isCorporateEmail = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? !freeEmailDomains.includes(domain) : false;
};

export const leadFormSchema = z.object({
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
  company: z.string()
    .trim()
    .min(2, { message: "El nombre de la empresa debe tener al menos 2 caracteres" })
    .max(100, { message: "El nombre de la empresa no puede exceder 100 caracteres" }),
  role: z.string()
    .trim()
    .min(2, { message: "El rol debe tener al menos 2 caracteres" })
    .max(100, { message: "El rol no puede exceder 100 caracteres" }),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;

export const loginSchema = z.object({
  email: z.string()
    .trim()
    .email({ message: "Por favor, ingresa un email válido" }),
  password: z.string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
