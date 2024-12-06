export type TKabupatenModel = {
  kode_kabupaten: string;
  nama_kabupaten: string;
};

export function toKabupatenResponse(data: TKabupatenModel) {
  return {
    kode_kabupaten: data.kode_kabupaten,
    nama_kabupaten: data.nama_kabupaten,
  };
}
