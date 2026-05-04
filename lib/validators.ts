import { z } from 'zod';

const trimmedString = (max: number) =>
  z.string().trim().min(1).max(max);

const optionalTrimmedString = (max: number) =>
  z.string().trim().max(max).nullish().transform((value) => value || undefined);

export const welcomeEmailSchema = z.object({
  name: optionalTrimmedString(100),
  email: z.string().trim().email().max(320),
  businessType: optionalTrimmedString(100),
  businessName: optionalTrimmedString(250),
  budget: optionalTrimmedString(100),
  services: z.array(z.string().trim().min(1).max(100)).max(10).optional().nullable(),
});

export const generateEmailSchema = z.object({
  businessName: trimmedString(250),
  ownerName: optionalTrimmedString(100),
  city: optionalTrimmedString(80),
  industry: trimmedString(120),
  targetService: trimmedString(120),
  // email here is only for logging — format validation happens at send time
  email: z.string().trim().max(320).nullish().transform((value) => value || undefined),
});

export const generateWhatsAppSchema = z.object({
  phone: z.string().trim().max(30),
  name: optionalTrimmedString(100),
  city: optionalTrimmedString(80),
  businessName: trimmedString(250),
  industry: trimmedString(120),
  targetService: trimmedString(120),
});

export const sendColdEmailSchema = z.object({
  to: z.string().trim().email().max(320),
  toName: optionalTrimmedString(100),
  subject: trimmedString(200),
  body: trimmedString(5000),
  outreachLogId: z.string().uuid().optional().nullable(),
});
