import { z } from 'zod';
export const initialPlans = [{ name: 'Morning Shift', price: 699 }, { name: 'Evening Shift', price: 799 }, { name: 'Full Day Shift', price: 1199 }, { name: 'Night Shift', price: 499 }];
export const enquirySchema = z.object({ student_name: z.string().trim().min(2, 'Please enter your full name.').max(100), mobile: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number.'), email: z.string().email().or(z.literal('')).default(''), kind: z.enum(['contact', 'membership']), plan_name: z.string().max(100).default(''), preferred_shift: z.string().max(100).default(''), message: z.string().trim().max(2000).default(''), website: z.string().max(0).optional() });
export const canPublishFacility = (f) => f.enabled && f.confirmed;
export const statuses = ['New', 'Contacted', 'Converted', 'Rejected'];
