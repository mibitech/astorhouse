export interface Puppy {
  id: string;
  name: string;
  breed: 'australian_shepherd' | 'pomeranian' | 'rottweiler';
  age: string;
  birth_date: string;
  color: string;
  gender: 'male' | 'female';
  status: 'disponivel' | 'reservado' | 'vendido' | 'nao_disponivel';
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
  medical_records?: {
    exams: string[];
    vaccinations: string[];
    treatments: string[];
  };
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_available_for_sale: boolean;
  price?: number;
  notes?: string;
}

export interface PuppyFormData extends Omit<Puppy, 'id' | 'created_at' | 'updated_at'> {}