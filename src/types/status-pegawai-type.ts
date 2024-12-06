export type TStatusPegawaiModel = {
  kode_status_pegawai: number;
  status_pegawai: string;
};

export function toStatusPegawaiResponse(data: TStatusPegawaiModel) {
  return {
    kode_status_pegawai: data.kode_status_pegawai,
    status_pegawai: data.status_pegawai,
  };
}
