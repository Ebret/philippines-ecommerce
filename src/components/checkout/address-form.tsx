'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AddressFormProps {
  onSubmit?: (address: AddressData) => void;
  defaultValues?: Partial<AddressData>;
  className?: string;
}

export interface AddressData {
  fullName: string;
  phoneNumber: string;
  email: string;
  street: string;
  barangay: string;
  municipality: string;
  province: string;
  postalCode: string;
  isDefault?: boolean;
}

const PHILIPPINES_PROVINCES = [
  'Abra', 'Agusan del Norte', 'Agusan del Sur', 'Aklan', 'Albay',
  'Antique', 'Apayao', 'Aurora', 'Basilan', 'Bataan',
  'Batangas', 'Batanes', 'Benguet', 'Biliran', 'Bohol',
  'Bukidnon', 'Bulacan', 'Calamianes', 'Camarines Norte', 'Camarines Sur',
  'Camiguin', 'Capiz', 'Catanduanes', 'Cavite', 'Cebu',
  'Cotabato', 'Davao del Norte', 'Davao del Sur', 'Davao Oriental', 'Dinagat Islands',
  'Eastern Samar', 'Guimaras', 'Ifugao', 'Ilocos Norte', 'Ilocos Sur',
  'Iloilo', 'Isabela', 'Kalinga', 'Laguna', 'Lanao del Norte',
  'Lanao del Sur', 'La Union', 'Leyte', 'Maguindanao', 'Marinduque',
  'Masbate', 'Metro Manila', 'Misamis Occidental', 'Misamis Oriental', 'Mountain Province',
  'Negros Occidental', 'Negros Oriental', 'Northern Samar', 'Nueva Ecija', 'Nueva Vizcaya',
  'Palawan', 'Pampanga', 'Pangasinan', 'Quezon', 'Quirino',
  'Rizal', 'Romblon', 'Samar', 'Sarangani', 'Siquijor',
  'Sorsogon', 'South Cotabato', 'Southern Leyte', 'Sultan Kudarat', 'Sulu',
  'Surigao del Norte', 'Surigao del Sur', 'Tarlac', 'Tawi-Tawi', 'Ifugao',
  'Zambales', 'Zamboanga del Norte', 'Zamboanga del Sur', 'Zamboanga Sibugay',
];

const AddressForm = React.forwardRef<HTMLDivElement, AddressFormProps>(
  ({ onSubmit, defaultValues, className }, ref) => {
    const [formData, setFormData] = React.useState<AddressData>({
      fullName: defaultValues?.fullName || '',
      phoneNumber: defaultValues?.phoneNumber || '',
      email: defaultValues?.email || '',
      street: defaultValues?.street || '',
      barangay: defaultValues?.barangay || '',
      municipality: defaultValues?.municipality || '',
      province: defaultValues?.province || '',
      postalCode: defaultValues?.postalCode || '',
      isDefault: defaultValues?.isDefault || false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit?.(formData);
    };

    return (
      <Card ref={ref} className={className}>
        <CardHeader>
          <CardTitle>Delivery Address</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 focus:border-primary-600 focus:outline-none"
                placeholder="Juan Dela Cruz"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 focus:border-primary-600 focus:outline-none"
                placeholder="juan@example.com"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 focus:border-primary-600 focus:outline-none"
                placeholder="+63 9XX XXX XXXX"
              />
            </div>

            {/* Street Address */}
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Street Address *
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 focus:border-primary-600 focus:outline-none"
                placeholder="123 Main Street"
              />
            </div>

            {/* Barangay */}
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Barangay *
              </label>
              <input
                type="text"
                name="barangay"
                value={formData.barangay}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 focus:border-primary-600 focus:outline-none"
                placeholder="Barangay Name"
              />
            </div>

            {/* Municipality */}
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Municipality/City *
              </label>
              <input
                type="text"
                name="municipality"
                value={formData.municipality}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 focus:border-primary-600 focus:outline-none"
                placeholder="City/Municipality"
              />
            </div>

            {/* Province */}
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Province *
              </label>
              <select
                name="province"
                value={formData.province}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 focus:border-primary-600 focus:outline-none"
              >
                <option value="">Select Province</option>
                {PHILIPPINES_PROVINCES.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>

            {/* Postal Code */}
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Postal Code *
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 focus:border-primary-600 focus:outline-none"
                placeholder="1000"
              />
            </div>

            {/* Set as Default */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isDefault"
                id="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                className="rounded border-neutral-300"
              />
              <label htmlFor="isDefault" className="text-sm text-neutral-700">
                Set as default address
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-primary-600 py-2 font-medium text-white transition-colors hover:bg-primary-700"
            >
              Save Address
            </button>
          </form>
        </CardContent>
      </Card>
    );
  }
);
AddressForm.displayName = 'AddressForm';

export { AddressForm };

