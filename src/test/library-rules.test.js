import { describe, it, expect } from 'vitest';
import { initialPlans, canPublishFacility, enquirySchema, statuses } from '@/lib/library-rules';
describe('Library business rules', () => {
    it.each([['Morning Shift', 699], ['Evening Shift', 799], ['Full Day Shift', 1199], ['Night Shift', 499]])('prices %s at ₹%i', (name, price) => expect(initialPlans.find(p => p.name === name)?.price).toBe(price));
    it('only publishes confirmed enabled facilities', () => { expect(canPublishFacility({ confirmed: false, enabled: true })).toBe(false); expect(canPublishFacility({ confirmed: true, enabled: false })).toBe(false); expect(canPublishFacility({ confirmed: true, enabled: true })).toBe(true); });
    it('validates Indian enquiry phone numbers', () => { expect(enquirySchema.safeParse({ student_name: 'Student', mobile: '123', kind: 'contact' }).success).toBe(false); expect(enquirySchema.safeParse({ student_name: 'Student', mobile: '9450537777', kind: 'contact' }).success).toBe(true); });
    it('supports the four requested enquiry states', () => expect(statuses).toEqual(['New', 'Contacted', 'Converted', 'Rejected']));
});
