export type TProvinsiModel = {
  kode_provinsi: string;
  nama_provinsi: string;
};

export function toProvinsiResponse(data: TProvinsiModel) {
  return {
    kode_provinsi: data.kode_provinsi,
    nama_provinsi: data.nama_provinsi,
  };
}
