export type TInventarisasiPajakCreateFormSchema = {
  kode_inventarisasi_pajak: string;
  uraian_kegiatan: string;
  no_pengajuan?: string | null;
  nominal_dpp: number;
  jenis_pajak: string;
  kode_objek_pajak: string;
  nominal_pajak: number;
  nama_pemotong: string;
  npwp_pemotong: string;
  file_bukti: string;
  idl: string;
  tanggal_input: Date;
};

export type TInventarisasiPajakUpdateFormSchema = {
  uraian_kegiatan: string;
  no_pengajuan: string;
  nominal_dpp: number;
  jenis_pajak: string;
  kode_objek_pajak: string;
  nominal_pajak: number;
  nama_pemotong: string;
  npwp_pemotong: string;
  file_bukti: string;
  idl: string;
};

export type TInventarisasiPajakSingleModel = {
  kode_inventarisasi_pajak: string;
  uraian_kegiatan: string;
  no_pengajuan: string;
  nominal_dpp: number;
  jenis_pajak: string;
  kode_objek_pajak: string;
  nominal_pajak: number;
  nama_pemotong: string;
  npwp_pemotong: string;
  file_bukti: string;
  idl: string;
  tanggal_input: Date;
};

export type TInventarisasiPajakModelPagedResult = {
  result: TInventarisasiPajakSingleModel[];
  current_page: number;
  total_page: number;
  total_count: number;
};

export function toInventarisasiPajakSingleResponse(
  data: TInventarisasiPajakSingleModel
) {
  return {
    kode_inventarisasi_pajak: data.kode_inventarisasi_pajak,
    uraian_kegiatan: data.uraian_kegiatan,
    no_pengajuan: data.no_pengajuan,
    nominal_dpp: data.nominal_dpp,
    jenis_pajak: data.jenis_pajak,
    kode_objek_pajak: data.kode_objek_pajak,
    nominal_pajak: data.nominal_pajak,
    nama_pemotong: data.nama_pemotong,
    npwp_pemotong: data.npwp_pemotong,
    file_bukti: data.file_bukti,
    idl: data.idl,
    tanggal_input: data.tanggal_input,
  };
}

export function toPagedInventarisasiPajakResponse(pagedResult: {
  result: TInventarisasiPajakSingleModel[];
  current_page: number;
  total_page: number;
  total_count: number;
}): TInventarisasiPajakModelPagedResult {
  return {
    result: pagedResult.result.map(toInventarisasiPajakSingleResponse),
    current_page: pagedResult.current_page,
    total_page: pagedResult.total_page,
    total_count: pagedResult.total_count,
  };
}
