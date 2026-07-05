'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input, Button } from '../primitives';

interface DiscoveryFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
}

interface FormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  challenge: string;
  preferredTime: string;
}

/**
 * DiscoveryForm Component
 * Multi-field form with validation and loading state
 * Features: real-time validation, success message, accessibility
 */
export const DiscoveryForm: React.FC<DiscoveryFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    company: '',
    email: '',
    phone: '',
    challenge: '',
    preferredTime: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.challenge.trim()) newErrors.challenge = 'Please tell us about your challenge';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onSubmit(formData);
      setSubmitted(true);
      setFormData({ name: '', company: '', email: '', phone: '', challenge: '', preferredTime: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white rounded-lg p-8"
      style={{ backgroundColor: 'var(--color-cream)' }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {submitted && (
        <motion.div
          className="mb-6 p-4 rounded-lg bg-green-50 border-2 border-green-300"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-green-800 font-semibold">
            Thank you! We'll be in touch soon.
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />

        <Input
          label="Company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          error={errors.company}
          required
        />

        <Input
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <Input
          label="Phone Number"
          name="phone"
          type="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div className="mb-6">
        <Input
          label="Tell us about your challenge"
          name="challenge"
          variant="textarea"
          value={formData.challenge}
          onChange={handleChange}
          error={errors.challenge}
          required
          rows={4}
        />
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700" style={{ color: 'var(--color-text)' }}>
          Preferred Time to Chat
        </label>
        <select
          name="preferredTime"
          value={formData.preferredTime}
          onChange={handleChange}
          className="w-full mt-2 px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-burgundy"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <option value="">Select a time slot</option>
          <option value="morning">Morning (9am-12pm)</option>
          <option value="afternoon">Afternoon (12pm-5pm)</option>
          <option value="evening">Evening (5pm-8pm)</option>
        </select>
      </div>

      <Button
        label={isLoading ? 'Sending...' : 'Send Request'}
        type="submit"
        disabled={isLoading}
        loading={isLoading}
        size="lg"
      />
    </motion.form>
  );
};

DiscoveryForm.displayName = 'DiscoveryForm';
