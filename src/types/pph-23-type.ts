export type TPPh23CreateFormSchema = {
  kode_kegiatan_penghasilan_badan_usaha: string;
  jenis_penghasilan: string;
  uraian_kegiatan: string;
  no_pengajuan: string;
  target_penerima: string;
  nama_penerima: string;
  nama_bank: string;
  no_rekening?: string | null;
  nama_rekening?: string | null;
  npwp?: string | null;
  nama_narahubung?: string | null;
  kode_objek_pajak: string;
  penghasilan_bruto: number;
  tarif_pajak: string;
  potongan_pajak: string;
  penghasilan_diterima: string;
  pic_pencairan_penghasilan: string;
  invoice: string;
  faktur_pajak?: string | null;
  dokumen_kerjasama_kegiatan?: string | null;
  idl: string;
  kode_jenis_pajak: number;
  status: string;
  tanggal_input: Date;
};

export type TPPh23UpdateFormSchema = {
  jenis_penghasilan: string;
  uraian_kegiatan: string;
  no_pengajuan: string;
  target_penerima: string;
  nama_penerima: string;
  nama_bank: string;
  no_rekening?: string | null;
  nama_rekening?: string | null;
  npwp?: string | null;
  nama_narahubung?: string | null;
  kode_objek_pajak: string;
  penghasilan_bruto: number;
  tarif_pajak: string;
  potongan_pajak: string;
  penghasilan_diterima: string;
  pic_pencairan_penghasilan: string;
  invoice: string;
  faktur_pajak: string;
  dokumen_kerjasama_kegiatan: string;
  idl: string;
};

export type TPPh23SingleModel = {
  kode_kegiatan_penghasilan_badan_usaha: string;
  jenis_penghasilan: string;
  uraian_kegiatan: string;
  no_pengajuan: string;
  target_penerima: string;
  nama_penerima: string;
  nama_bank: string;
  no_rekening?: string | null;
  nama_rekening?: string | null;
  npwp?: string | null;
  nama_narahubung?: string | null;
  kode_objek_pajak: string;
  penghasilan_bruto: number;
  tarif_pajak: string;
  potongan_pajak: string;
  penghasilan_diterima: string;
  pic_pencairan_penghasilan: string;
  invoice: string;
  faktur_pajak: string;
  dokumen_kerjasama_kegiatan: string;
  idl: string;
  kode_jenis_pajak: number;
  status: string;
  tanggal_input: Date;
};

export type TPPh23ModelPagedResult = {
  result: TPPh23SingleModel[];
  current_page: number;
  total_page: number;
  total_count: number;
};

export function toPPh23SingleResponse(data: TPPh23SingleModel) {
  return {
    kode_kegiatan_penghasilan_badan_usaha:
      data.kode_kegiatan_penghasilan_badan_usaha,
    jenis_penghasilan: data.jenis_penghasilan,
    uraian_kegiatan: data.uraian_kegiatan,
    no_pengajuan: data.no_pengajuan,
    target_penerima: data.target_penerima,
    nama_penerima: data.nama_penerima,
    nama_bank: data.nama_bank,
    no_rekening: data.no_rekening,
    nama_rekening: data.nama_rekening,
    npwp: data.npwp,
    nama_narahubung: data.nama_narahubung,
    kode_objek_pajak: data.kode_objek_pajak,
    penghasilan_bruto: data.penghasilan_bruto,
    tarif_pajak: data.tarif_pajak,
    potongan_pajak: data.potongan_pajak,
    penghasilan_diterima: data.penghasilan_diterima,
    pic_pencairan_penghasilan: data.pic_pencairan_penghasilan,
    invoice: data.invoice,
    faktur_pajak: data.faktur_pajak,
    dokumen_kerjasama_kegiatan: data.dokumen_kerjasama_kegiatan,
    idl: data.idl,
    kode_jenis_pajak: data.kode_jenis_pajak,
    status: data.status,
    tanggal_input: data.tanggal_input,
  };
}

export function toPagedPPh23Response(pagedResult: {
  result: TPPh23SingleModel[];
  current_page: number;
  total_page: number;
  total_count: number;
}): TPPh23ModelPagedResult {
  return {
    result: pagedResult.result.map(toPPh23SingleResponse),
    current_page: pagedResult.current_page,
    total_page: pagedResult.total_page,
    total_count: pagedResult.total_count,
  };
}
