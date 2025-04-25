import React from 'react';
import { FilterState } from '@/types/doctor';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableSpecialities: string[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  availableSpecialities,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleConsultationTypeChange = (type: FilterState['consultationType']) => {
    onFilterChange({ ...filters, consultationType: type });
  };

  const handleSpecialityChange = (speciality: string) => {
    const updatedSpecialities = filters.specialities.includes(speciality)
      ? filters.specialities.filter((s) => s !== speciality)
      : [...filters.specialities, speciality];
    onFilterChange({ ...filters, specialities: updatedSpecialities });
  };

  const handleSortChange = (sortBy: FilterState['sortBy']) => {
    onFilterChange({ ...filters, sortBy });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>
        <input
          type="text"
          id="search"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Search by name..."
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Consultation Type</h3>
        <div className="space-y-2">
          {['Video Consult', 'In Clinic'].map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="radio"
                checked={filters.consultationType === type}
                onChange={() => handleConsultationTypeChange(type as FilterState['consultationType'])}
                className="mr-2"
              />
              <span className="text-sm text-gray-600">{type}</span>
            </label>
          ))}
          <label className="flex items-center">
            <input
              type="radio"
              checked={filters.consultationType === ''}
              onChange={() => handleConsultationTypeChange('')}
              className="mr-2"
            />
            <span className="text-sm text-gray-600">All</span>
          </label>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Specialities</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {availableSpecialities.map((speciality) => (
            <label key={speciality} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.specialities.includes(speciality)}
                onChange={() => handleSpecialityChange(speciality)}
                className="mr-2"
              />
              <span className="text-sm text-gray-600">{speciality}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Sort By</h3>
        <div className="space-y-2">
          {[
            { value: 'fees', label: 'Fees' },
            { value: 'experience', label: 'Experience' },
          ].map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                checked={filters.sortBy === option.value}
                onChange={() => handleSortChange(option.value as FilterState['sortBy'])}
                className="mr-2"
              />
              <span className="text-sm text-gray-600">{option.label}</span>
            </label>
          ))}
          <label className="flex items-center">
            <input
              type="radio"
              checked={filters.sortBy === ''}
              onChange={() => handleSortChange('')}
              className="mr-2"
            />
            <span className="text-sm text-gray-600">None</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel; 