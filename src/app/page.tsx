'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AutocompleteSearch from '../components/AutocompleteSearch';
import FilterPanel from '../components/FilterPanel';
import DoctorCard from '../components/DoctorCard';
import { Doctor, FilterState } from '../types/doctor';

function DoctorListContent() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    consultationType: '',
    specialities: [],
    sortBy: ''
  });
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json');
        if (!response.ok) {
          throw new Error('Failed to fetch doctors data');
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received');
        }
        setDoctors(data);
        setFilteredDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError(error instanceof Error ? error.message : 'An error occurred while fetching doctors');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    // Update URL with current filters
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.consultationType) params.set('consultationType', filters.consultationType);
    if (filters.specialities.length > 0) params.set('specialities', filters.specialities.join(','));
    if (filters.sortBy) params.set('sortBy', filters.sortBy);

    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.push(newUrl, { scroll: false });
  }, [filters, router]);

  useEffect(() => {
    // Initialize filters from URL
    const search = searchParams.get('search') || '';
    const consultationType = (searchParams.get('consultationType') as 'Video Consult' | 'In Clinic') || '';
    const specialities = searchParams.get('specialities')?.split(',').filter(Boolean) || [];
    const sortBy = (searchParams.get('sortBy') as 'fees' | 'experience') || '';

    setFilters({
      search,
      consultationType,
      specialities,
      sortBy
    });
  }, [searchParams]);

  useEffect(() => {
    if (!Array.isArray(doctors) || doctors.length === 0) return;

    let result = [...doctors];

    // Apply search filter
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(doctor =>
        doctor?.name?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply consultation type filter
    if (filters.consultationType) {
      result = result.filter(doctor => {
        if (filters.consultationType === 'Video Consult') {
          return doctor.video_consult;
        }
        if (filters.consultationType === 'In Clinic') {
          return doctor.in_clinic;
        }
        return true;
      });
    }

    // Apply specialities filter
    if (filters.specialities.length > 0) {
      result = result.filter(doctor =>
        doctor.specialities.some(spec => 
          filters.specialities.includes(spec.name)
        )
      );
    }

    // Apply sorting
    if (filters.sortBy === 'fees') {
      result.sort((a, b) => {
        const feeA = parseInt(a.fees.replace(/[^0-9]/g, ''));
        const feeB = parseInt(b.fees.replace(/[^0-9]/g, ''));
        return feeA - feeB;
      });
    } else if (filters.sortBy === 'experience') {
      result.sort((a, b) => {
        const expA = parseInt(a.experience.replace(/[^0-9]/g, ''));
        const expB = parseInt(b.experience.replace(/[^0-9]/g, ''));
        return expB - expA;
      });
    }

    setFilteredDoctors(result);
  }, [doctors, filters]);

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // Add this new code to extract unique specialties
  const availableSpecialities = useMemo(() => {
    if (!doctors.length) return [];
    const specialtiesSet = new Set<string>();
    doctors.forEach(doctor => {
      doctor.specialities.forEach(specialty => {
        specialtiesSet.add(specialty.name);
      });
    });
    return Array.from(specialtiesSet);
  }, [doctors]);

  // Loading skeleton for doctor cards
  const renderLoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
          <div className="p-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error message component
  const renderError = () => (
    <div className="text-center py-12 bg-red-50 rounded-lg">
      <div className="text-red-600 text-xl font-semibold mb-2">Error loading doctors</div>
      <div className="text-red-500">{error}</div>
    </div>
  );

  return (
    <>
      <div className="mb-12 max-w-2xl mx-auto">
        <AutocompleteSearch
          doctors={doctors || []}
          onSearch={handleSearch}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          availableSpecialities={availableSpecialities}
        />

        <div className="flex-1">
          {isLoading ? (
            renderLoadingSkeleton()
          ) : error ? (
            renderError()
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="text-gray-600">
                  Found {filteredDoctors.length} doctors
                </div>
                {filters.sortBy && (
                  <div className="text-sm text-gray-500">
                    Sorted by: {filters.sortBy === 'fees' ? 'Fees (Low to High)' : 'Experience (High to Low)'}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map(doctor => (
                  <DoctorCard key={doctor?.id || Math.random()} doctor={doctor} />
                ))}
              </div>
              {filteredDoctors.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="text-gray-500 text-lg">No doctors found matching your criteria</div>
                  <button 
                    onClick={() => setFilters({
                      search: '',
                      consultationType: '',
                      specialities: [],
                      sortBy: ''
                    })}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Doctor</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Search from our extensive network of qualified healthcare professionals and book your appointment today
          </p>
        </div>
        
        <Suspense fallback={
          <div className="text-center py-12">
            <div className="text-gray-500">Loading...</div>
          </div>
        }>
          <DoctorListContent />
        </Suspense>
      </div>
    </main>
  );
}
