import { Maintenance } from '../type';

export const getMaintenance = () => {
  return async function isMaintenance(): Promise<Maintenance> {
    return {
      onMaintenance: false,
    };
  };
};
