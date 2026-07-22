import React from 'react';
import { CustomerAddress } from '../types';
import { INDIAN_STATES } from '../data/defaultData';
import { MapPin, User, Phone, Mail, Building, Home, ShieldCheck } from 'lucide-react';

interface AddressFormProps {
  address: CustomerAddress;
  onChange: (updated: CustomerAddress) => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({ address, onChange }) => {
  const handleChange = (field: keyof CustomerAddress, value: string) => {
    onChange({
      ...address,
      [field]: value,
    });
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl border border-slate-100 space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="pb-3 sm:pb-4 border-b border-slate-100">
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-red-600 block mb-1">
          STEP 2 OF 3
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Delivery Address & Customer Info
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Provide complete dispatch details for doorstep courier delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-red-600" /> Full Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Rahul Sharma"
            value={address.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-red-600 focus:outline-none transition"
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-red-600" /> Mobile Number *
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
              +91
            </span>
            <input
              type="tel"
              required
              maxLength={10}
              placeholder="9876543210"
              value={address.phone}
              onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, ''))}
              className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-red-600 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-red-600" /> Email Address *
          </label>
          <input
            type="email"
            required
            placeholder="rahul.sharma@example.com"
            value={address.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-red-600 focus:outline-none transition"
          />
        </div>

        {/* House / Flat No */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-red-600" /> House / Flat / Plot No *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. B-402, Royal Residency"
            value={address.houseNo}
            onChange={(e) => handleChange('houseNo', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-red-600 focus:outline-none transition"
          />
        </div>

        {/* Village / Area */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-red-600" /> Village / Locality / Street *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Sector 62 / Rampur"
            value={address.village}
            onChange={(e) => handleChange('village', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-red-600 focus:outline-none transition"
          />
        </div>

        {/* Post Office */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Post Office (PO) *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Noida Head PO"
            value={address.postOffice}
            onChange={(e) => handleChange('postOffice', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-red-600 focus:outline-none transition"
          />
        </div>

        {/* Police Station */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Police Station (PS) *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Sector 58 PS"
            value={address.policeStation}
            onChange={(e) => handleChange('policeStation', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-red-600 focus:outline-none transition"
          />
        </div>

        {/* District */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            District *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Gautam Buddha Nagar"
            value={address.district}
            onChange={(e) => handleChange('district', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-red-600 focus:outline-none transition"
          />
        </div>

        {/* State Dropdown */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            State *
          </label>
          <select
            required
            value={address.state}
            onChange={(e) => handleChange('state', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs font-medium bg-white focus:ring-2 focus:ring-red-600 focus:outline-none transition"
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* PIN Code */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-red-600" /> PIN Code *
          </label>
          <input
            type="text"
            required
            maxLength={6}
            placeholder="6-digit PIN code (e.g. 201301)"
            value={address.pinCode}
            onChange={(e) => handleChange('pinCode', e.target.value.replace(/\D/g, ''))}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-red-600 focus:outline-none transition"
          />
        </div>

        {/* Landmark (Optional) */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Landmark (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Near Fortis Hospital / Opposite Water Tank"
            value={address.landmark || ''}
            onChange={(e) => handleChange('landmark', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-red-600 focus:outline-none transition"
          />
        </div>
      </div>
    </div>
  );
};
