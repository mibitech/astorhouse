// Barrel da feature Hotel — exporta apenas o necessário externamente.
export { HotelPage } from './views/HotelPage';
export { HotelManagementPage } from './views/HotelManagementPage';
export {
  useHotelPackages,
  useAllHotelPackages,
  useCreateHotelPackage,
  useUpdateHotelPackage,
  useDeleteHotelPackage,
} from './controllers/useHotelPackages';
export type { HotelPackage, HotelPackageInput } from './models/hotel.types';
