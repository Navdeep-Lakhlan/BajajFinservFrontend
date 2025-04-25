import { useState } from 'react';

interface Doctor {
  id: string;
  name: string;
  name_initials: string;
  photo: string;
  doctor_introduction: string;
  specialities: Array<{ name: string }>;
  fees: string;
  experience: string;
  languages: string[];
  clinic: {
    name: string;
    address: {
      locality: string;
      city: string;
    }
  };
  video_consult: boolean;
  in_clinic: boolean;
}

interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const generateAvatarUrl = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&size=200&font-size=0.35`;
  };

  const imageUrl = imageError || !doctor.photo ? generateAvatarUrl(doctor.name) : doctor.photo;

  const formatExperience = (exp: string) => {
    const years = exp.match(/\d+/)?.[0] || '';
    return `${years}+ Years Experience`;
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md border border-gray-100 relative group"
      data-testid="doctor-card"
    >
      {/* Top Banner */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-xs py-1.5 text-center font-medium z-10">
        Available Today
      </div>

      <div className="relative">
        {/* Image Section */}
        <div className="h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
          <img
            src={imageUrl}
            alt={`Dr. ${doctor.name}'s photo`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            data-testid="doctor-image"
            loading="lazy"
          />
          {/* Consultation Badges */}
          <div className="absolute top-14 right-4 flex flex-col gap-2 z-20">
            {doctor.video_consult && (
              <div className="px-3 py-1.5 bg-emerald-500 text-white text-sm rounded-full flex items-center shadow-lg backdrop-blur-sm bg-opacity-90 whitespace-nowrap">
                <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Online Available
              </div>
            )}
            {doctor.in_clinic && (
              <div className="px-3 py-1.5 bg-violet-500 text-white text-sm rounded-full flex items-center shadow-lg backdrop-blur-sm bg-opacity-90 whitespace-nowrap">
                <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Clinic Open
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-semibold text-gray-900" data-testid="doctor-name">
                Dr. {doctor.name}
              </h2>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                Verified
              </span>
            </div>
            <p className="text-sm text-gray-600">{formatExperience(doctor.experience)}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-emerald-600">₹ {doctor.fees.replace(/[^0-9]/g, '')}</p>
            <p className="text-xs text-gray-500">Per Consultation</p>
          </div>
        </div>

        {/* Languages */}
        <div className="flex flex-wrap gap-1 mb-4">
          {doctor.languages.map((lang, index) => (
            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded bg-gray-50 text-gray-600 text-xs">
              {lang}
            </span>
          ))}
        </div>
        
        {/* Specializations */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Specializations</h3>
          <div className="flex flex-wrap gap-2">
            {doctor.specialities.map((specialty, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full"
                data-testid="doctor-specialty"
              >
                {specialty.name}
              </span>
            ))}
          </div>
        </div>

        {/* Clinic Location */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 text-gray-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{doctor.clinic.name}</h3>
              <p className="text-sm text-gray-600">{doctor.clinic.address.locality}, {doctor.clinic.address.city}</p>
              <button className="text-blue-500 text-sm mt-1 hover:text-blue-600 focus:outline-none inline-flex items-center">
                Get Directions
                <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Doctor Introduction */}
        {doctor.doctor_introduction && (
          <div className="mb-6">
            <p className={`text-sm text-gray-600 ${!isExpanded ? 'line-clamp-2' : ''}`}>
              {doctor.doctor_introduction}
            </p>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-500 text-sm mt-1 hover:text-blue-600 focus:outline-none inline-flex items-center"
            >
              {isExpanded ? 'Show Less' : 'Read More'}
              <svg
                className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          {doctor.video_consult && (
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Video Consult
            </button>
          )}
          {doctor.in_clinic && (
            <button className="bg-violet-500 hover:bg-violet-600 text-white py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Visit Clinic
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 