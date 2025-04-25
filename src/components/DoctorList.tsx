import React from 'react';
import { Doctor, FilterState } from '@/types/doctor';
import DoctorCard from './DoctorCard';

interface DoctorListProps {
  doctors: Doctor[];
  filters: FilterState;
}

const DoctorList: React.FC<DoctorListProps> = ({ doctors, filters }) => {
  const filteredDoctors = React.useMemo(() => {
    let result = [...doctors];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchLower) ||
          doctor.specialities.some((s) => s.name.toLowerCase().includes(searchLower))
      );
    }

    // Apply consultation type filter
    if (filters.consultationType) {
      result = result.filter((doctor) => {
        if (filters.consultationType === 'Video Consult') {
          return doctor.video_consult;
        } else if (filters.consultationType === 'In Clinic') {
          return doctor.in_clinic;
        }
        return true;
      });
    }

    // Apply specialities filter
    if (filters.specialities.length > 0) {
      result = result.filter((doctor) =>
        doctor.specialities.some((s) => filters.specialities.includes(s.name))
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      result.sort((a, b) => {
        if (filters.sortBy === 'fees') {
          const feeA = parseInt(a.fees.replace(/[^0-9]/g, ''));
          const feeB = parseInt(b.fees.replace(/[^0-9]/g, ''));
          return feeA - feeB;
        } else if (filters.sortBy === 'experience') {
          const expA = parseInt(a.experience.replace(/[^0-9]/g, ''));
          const expB = parseInt(b.experience.replace(/[^0-9]/g, ''));
          return expB - expA;
        }
        return 0;
      });
    }

    return result;
  }, [doctors, filters]);

  if (!doctors.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No doctors available.</p>
      </div>
    );
  }

  if (!filteredDoctors.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No doctors match the selected filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1">
      {filteredDoctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
};

export default DoctorList; 