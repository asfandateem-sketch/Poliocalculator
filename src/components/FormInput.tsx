import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormInputProps {
  id: string;
  label: string;
  value: number | string;
  onChange: (val: number | string) => void;
  type?: 'number' | 'text';
  placeholder?: string;
  error?: string;
  helper?: string;
  min?: number;
  max?: number;
  step?: number;
  increments?: number[];
  readOnly?: boolean;
  unit?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  value,
  onChange,
  type = 'number',
  placeholder = '0',
  error,
  helper,
  min = 0,
  max,
  step = 1,
  increments,
  readOnly = false,
  unit,
}) => {
  const handleIncrement = (inc: number) => {
    const current = typeof value === 'number' ? value : Number(value) || 0;
    const next = Math.max(min, current + inc);
    onChange(next);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-sm font-semibold text-slate-800">
          {label}
        </label>
        {unit && <span className="text-xs text-slate-500 font-medium">{unit}</span>}
      </div>

      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          min={min}
          max={max}
          step={step}
          readOnly={readOnly}
          placeholder={placeholder}
          onChange={(e) => {
            if (type === 'number') {
              const val = e.target.value;
              onChange(val === '' ? '' : Number(val));
            } else {
              onChange(e.target.value);
            }
          }}
          className={`w-full text-lg sm:text-xl font-bold rounded-xl px-4 py-3 bg-white border transition-colors outline-none focus:ring-2 ${
            error
              ? 'border-rose-500 focus:ring-rose-200 text-rose-900 bg-rose-50/20'
              : 'border-slate-300 focus:border-teal-600 focus:ring-teal-100 text-slate-900'
          }`}
        />
      </div>

      {/* Quick increments for field convenience */}
      {increments && increments.length > 0 && !readOnly && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {increments.map((inc) => (
            <button
              key={inc}
              type="button"
              onClick={() => handleIncrement(inc)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-300 text-slate-700 border border-slate-200 transition active:scale-95"
            >
              +{inc >= 1000 ? `${inc / 1000}k` : inc}
            </button>
          ))}
        </div>
      )}

      {helper && !error && <p className="text-xs text-slate-500">{helper}</p>}

      {error && (
        <p className="flex items-center gap-1 text-xs font-medium text-rose-600 pt-0.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
