export type TPengajuanAnggaranModel = {
  kode_pengajuan_anggaran: string;
  kegiatan: string;
  no_pengajuan: string;
};

export type TPengajuanAnggaranModelPagedResult = {
  result: TPengajuanAnggaranModel[];
  current_page: number;
  total_page: number;
  total_count: number;
};

export function toPengajuanAnggaranResponse(data: TPengajuanAnggaranModel) {
  return {
    kode_pengajuan_anggaran: data.kode_pengajuan_anggaran,
    kegiatan: data.kegiatan,
    no_pengajuan: data.no_pengajuan,
  };
}

export function toPagedPengajuanAnggaranResponse(pagedResult: {
  result: TPengajuanAnggaranModel[];
  current_page: number;
  total_page: number;
  total_count: number;
}): TPengajuanAnggaranModelPagedResult {
  return {
    result: pagedResult.result.map(toPengajuanAnggaranResponse),
    current_page: pagedResult.current_page,
    total_page: pagedResult.total_page,
    total_count: pagedResult.total_count,
  };
}
