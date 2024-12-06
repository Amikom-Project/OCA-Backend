export type TMetodePotongModel = {
  kode_metode_potong: number;
  metode_potong: string;
};

export function toMetodePotongResponse(data: TMetodePotongModel) {
  return {
    kode_metode_potong: data.kode_metode_potong,
    metode_potong: data.metode_potong,
  };
}
