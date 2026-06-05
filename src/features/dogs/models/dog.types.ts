export interface Dog {
  id: string;
  name: string;
  breed: 'australian_shepherd' | 'pomeranian' | 'rottweiler';
  age: string;
  birth_date: string;
  color: string;
  gender: 'male' | 'female';
  status: 'garanhao' | 'reprodutora' | 'jovem_promessa' | 'aposentado' | 'disponivel';
  weight: number;
  height: number;
  image_url?: string;
  images?: string[];
  description: string;
  temperament: string;
  health_status: string;
  vaccination_status: string;
  microchip?: string;
  pedigree?: string;
  achievements: string[];
  parents?: {
    father?: string;
    mother?: string;
  };
  offspring?: string[];
  medical_records?: {
    exams: string[];
    vaccinations: string[];
    treatments: string[];
  };
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_available_for_breeding: boolean;
  price?: number;
  notes?: string;
}

export type DogFormData = Omit<Dog, 'id' | 'created_at' | 'updated_at'>;
