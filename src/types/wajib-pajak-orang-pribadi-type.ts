type StatusPegawai =
  | 'Pegawai Tetap'
  | 'Pegawai Tidak Tetap'
  | 'Bukan Pegawai'
  | 'Dewan Komisaris'
  | 'Mantan Pegawai'
  | 'Warga Negara Asing';

type Kewarganegaraan = 'WNI' | 'WNA';

export type TWajibPajakOrangPribadiCreateFormSchema = {
  kode_wajib_pajak_orang_pribadi: string;
  nama: string;
  email: string;
  status_pegawai: StatusPegawai;
  nip?: string | null;
  kewarganegaraan: Kewarganegaraan;
  nama_negara: string;
  nik?: string | null;
  nama_ktp?: string | null;
  file_foto_ktp?: string | null;
  nama_bank: string;
  no_rekening?: string | null;
  nama_rekening?: string | null;
  file_foto_bukti_rekening?: string | null;
  ada_npwp: string;
  npwp?: string | null;
  nama_npwp?: string | null;
  provinsi_npwp?: string | null;
  kabupaten_npwp?: string | null;
  file_foto_npwp?: string | null;
  no_passport?: string | null;
  nama_passport?: string | null;
  masa_berlaku_passport?: Date | null;
  file_foto_passport?: string | null;
  ptkp: string;
  disetujui: string;
  tanggal_input: Date;
};

export type TWajibPajakOrangPribadiUpdateFormSchema = {
  nama: string;
  email: string;
  status_pegawai: StatusPegawai;
  nip?: string;
  kewarganegaraan: Kewarganegaraan;
  nama_negara: string;
  nik?: string;
  nama_ktp?: string;
  file_foto_ktp?: string;
  nama_bank: string;
  no_rekening: string;
  nama_rekening: string;
  file_foto_bukti_rekening?: string;
  ada_npwp: string;
  npwp?: string;
  nama_npwp?: string;
  provinsi_npwp?: string;
  kabupaten_npwp?: string;
  file_foto_npwp?: string;
  no_passport?: string;
  nama_passport?: string;
  masa_berlaku_passport?: Date;
  file_foto_passport?: string;
  ptkp: string;
  disetujui: string;
};

export type TWajibPajakOrangPribadiSingleModel = {
  kode_wajib_pajak_orang_pribadi: string;
  nama: string;
  email: string;
  status_pegawai: string;
  nip?: string;
  kewarganegaraan: string;
  nama_negara: string;
  nik?: string;
  nama_ktp?: string;
  file_foto_ktp?: string;
  nama_bank: string;
  no_rekening: string;
  nama_rekening: string;
  file_foto_bukti_rekening?: string;
  ada_npwp: string;
  npwp?: string;
  nama_npwp?: string;
  provinsi_npwp?: string;
  kabupaten_npwp?: string;
  file_foto_npwp?: string;
  no_passport?: string;
  nama_passport?: string;
  masa_berlaku_passport?: string;
  file_foto_passport?: string;
  ptkp: string;
  disetujui: string;
  tanggal_input: string;
};

export type TWajibPajakOrangPribadiOptionModel = {
  status_pegawai: string;
  kewarganegaraan: string;
  nik?: string;
  nama_bank: string;
  no_rekening: string;
  nama_rekening: string;
  npwp?: string;
  no_passport?: string;
};

export type TWajibPajakOrangPribadiModelPagedResult = {
  result: TWajibPajakOrangPribadiSingleModel[];
  current_page: number;
  total_page: number;
  total_count: number;
};

export function toWajibPajakOrangPribadiOptionResponse(
  data: TWajibPajakOrangPribadiOptionModel
) {
  return {
    status_pegawai: data.status_pegawai,
    kewarganegaraan: data.kewarganegaraan,
    nik: data.nik,
    nama_bank: data.nama_bank,
    no_rekening: data.no_rekening,
    nama_rekening: data.nama_rekening,
    npwp: data.npwp,
    no_passport: data.no_passport,
  };
}

export function toWajibPajakOrangPribadiSingleResponse(
  data: TWajibPajakOrangPribadiSingleModel
) {
  return {
    kode_wajib_pajak_orang_pribadi: data.kode_wajib_pajak_orang_pribadi,
    nama: data.nama,
    email: data.email,
    status_pegawai: data.status_pegawai,
    nip: data.nip,
    kewarganegaraan: data.kewarganegaraan,
    nama_negara: data.nama_negara,
    nik: data.nik,
    nama_ktp: data.nama_ktp,
    file_foto_ktp: data.file_foto_ktp,
    nama_bank: data.nama_bank,
    no_rekening: data.no_rekening,
    nama_rekening: data.nama_rekening,
    file_foto_bukti_rekening: data.file_foto_bukti_rekening,
    ada_npwp: data.ada_npwp,
    npwp: data.npwp,
    nama_npwp: data.nama_npwp,
    provinsi_npwp: data.provinsi_npwp,
    kabupaten_npwp: data.kabupaten_npwp,
    file_foto_npwp: data.file_foto_npwp,
    no_passport: data.no_passport,
    nama_passport: data.nama_passport,
    masa_berlaku_passport: data.masa_berlaku_passport,
    file_foto_passport: data.file_foto_passport,
    ptkp: data.ptkp,
    disetujui: data.disetujui,
    tanggal_input: data.tanggal_input,
  };
}

export function toPagedWajibPajakOrangPribadiResponse(pagedResult: {
  result: TWajibPajakOrangPribadiSingleModel[];
  current_page: number;
  total_page: number;
  total_count: number;
}): TWajibPajakOrangPribadiModelPagedResult {
  return {
    result: pagedResult.result.map(toWajibPajakOrangPribadiSingleResponse),
    current_page: pagedResult.current_page,
    total_page: pagedResult.total_page,
    total_count: pagedResult.total_count,
  };
}
