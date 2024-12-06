export type TWajibPajakBadanUsahaCreateFormSchema = {
  kode_wajib_pajak_badan_usaha: string;
  nama_badan_usaha: string;
  email: string;
  file_foto_identitas_badan: string;
  npwp: string;
  nama_npwp: string;
  provinsi_npwp: string;
  kabupaten_npwp: string;
  file_foto_npwp: string;
  nama_bank: string;
  no_rekening: string;
  nama_rekening: string;
  file_foto_bukti_rekening: string;
  nama_narahubung: string;
  kontak_narahubung: string;
  ada_skb_pph23: string;
  masa_berlaku_bebas_pph23: Date;
  file_surat_bebas_pph23: string;
  status_pkp: string;
  tanggal_input: Date;
};

export type TWajibPajakBadanUsahaUpdateFormSchema = {
  nama_badan_usaha: string;
  email: string;
  file_foto_identitas_badan: string;
  npwp: string;
  nama_npwp: string;
  provinsi_npwp: string;
  kabupaten_npwp: string;
  file_foto_npwp: string;
  nama_bank: string;
  no_rekening: string;
  nama_rekening: string;
  file_foto_bukti_rekening: string;
  nama_narahubung: string;
  kontak_narahubung: string;
  ada_skb_pph23: string;
  masa_berlaku_bebas_pph23: Date;
  file_surat_bebas_pph23: string;
  status_pkp: string;
};

export type TWajibPajakBadanUsahaSingleModel = {
  kode_wajib_pajak_badan_usaha: string;
  nama_badan_usaha: string;
  email: string;
  file_foto_identitas_badan: string;
  npwp: string;
  nama_npwp: string;
  provinsi_npwp: string;
  kabupaten_npwp: string;
  file_foto_npwp: string;
  nama_bank: string;
  no_rekening: string;
  nama_rekening: string;
  file_foto_bukti_rekening: string;
  nama_narahubung: string;
  kontak_narahubung: string;
  ada_skb_pph23: string;
  masa_berlaku_bebas_pph23: Date;
  file_surat_bebas_pph23: string;
  status_pkp: string;
  tanggal_input: Date;
};

export type TWajibPajakBadanUsahaModelPagedResult = {
  result: TWajibPajakBadanUsahaSingleModel[];
  current_page: number;
  total_page: number;
  total_count: number;
};

export function toWajibPajakBadanUsahaSingleResponse(
  data: TWajibPajakBadanUsahaSingleModel
) {
  return {
    kode_wajib_pajak_badan_usaha: data.kode_wajib_pajak_badan_usaha,
    nama_badan_usaha: data.nama_badan_usaha,
    email: data.email,
    file_foto_identitas_badan: data.file_foto_identitas_badan,
    npwp: data.npwp,
    nama_npwp: data.nama_npwp,
    provinsi_npwp: data.provinsi_npwp,
    kabupaten_npwp: data.kabupaten_npwp,
    file_foto_npwp: data.file_foto_npwp,
    nama_bank: data.nama_bank,
    no_rekening: data.no_rekening,
    nama_rekening: data.nama_rekening,
    file_foto_bukti_rekening: data.file_foto_bukti_rekening,
    nama_narahubung: data.nama_narahubung,
    kontak_narahubung: data.kontak_narahubung,
    ada_skb_pph23: data.ada_skb_pph23,
    masa_berlaku_bebas_pph23: data.masa_berlaku_bebas_pph23,
    file_surat_bebas_pph23: data.file_surat_bebas_pph23,
    status_pkp: data.status_pkp,
    tanggal_input: data.tanggal_input,
  };
}

export function toPagedWajibPajakBadanUsahaResponse(pagedResult: {
  result: TWajibPajakBadanUsahaSingleModel[];
  current_page: number;
  total_page: number;
  total_count: number;
}): TWajibPajakBadanUsahaModelPagedResult {
  return {
    result: pagedResult.result.map(toWajibPajakBadanUsahaSingleResponse),
    current_page: pagedResult.current_page,
    total_page: pagedResult.total_page,
    total_count: pagedResult.total_count,
  };
}
