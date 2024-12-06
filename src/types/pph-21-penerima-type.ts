export type TPPh21PenerimaCreateFormSchema = {
  kode_item_kegiatan_penghasilan_orang_pribadi: string;
  kode_kegiatan_penghasilan_orang_pribadi: string;
  nama: string;
  status_pegawai: string;
  nik?: string | null;
  no_passport?: string | null;
  npwp?: string | null;
  nama_bank: string;
  no_rekening: string;
  nama_rekening: string;
  metode_potong: string;
  kode_objek_pajak: string;
  penghasilan_bruto: number;
  tarif_berlaku: number;
  potongan_pajak: number;
  penghasilan_diterima: number;
  status: string;
  idl: string;
  tanggal_input: Date;
};

export type TPPh21PenerimaUpdateFormSchema = {
  nama: string;
  status_pegawai: string;
  nik?: string | null;
  no_passport?: string | null;
  npwp?: string | null;
  nama_bank: string;
  no_rekening: string;
  nama_rekening: string;
  metode_potong: string;
  kode_objek_pajak: string;
  penghasilan_bruto: number;
  tarif_berlaku: number;
  potongan_pajak: number;
  penghasilan_diterima: number;
  idl: string;
};

export type TPPh21PenerimaSingleModel = {
  kode_item_kegiatan_penghasilan_orang_pribadi: string;
  kode_kegiatan_penghasilan_orang_pribadi: string;
  nama: string;
  status_pegawai: string;
  nik?: string | null;
  no_passport?: string | null;
  npwp?: string | null;
  nama_bank: string;
  no_rekening: string;
  nama_rekening: string;
  metode_potong: string;
  kode_objek_pajak: string;
  penghasilan_bruto: number;
  tarif_berlaku: number;
  potongan_pajak: number;
  penghasilan_diterima: number;
  status: string;
  idl: string;
  tanggal_input: Date;
};

export type TPPh21PenerimaModelPagedResult = {
  result: TPPh21PenerimaSingleModel[];
  current_page: number;
  total_page: number;
  total_count: number;
};

export function toPPh21PenerimaSingleResponse(data: TPPh21PenerimaSingleModel) {
  return {
    kode_item_kegiatan_penghasilan_orang_pribadi:
      data.kode_item_kegiatan_penghasilan_orang_pribadi,
    kode_kegiatan_penghasilan_orang_pribadi:
      data.kode_kegiatan_penghasilan_orang_pribadi,
    nama: data.nama,
    status_pegawai: data.status_pegawai,
    nik: data.nik,
    no_passport: data.no_passport,
    npwp: data.npwp,
    nama_bank: data.nama_bank,
    no_rekening: data.no_rekening,
    nama_rekening: data.nama_rekening,
    metode_potong: data.metode_potong,
    kode_objek_pajak: data.kode_objek_pajak,
    penghasilan_bruto: data.penghasilan_bruto,
    tarif_berlaku: data.tarif_berlaku,
    potongan_pajak: data.potongan_pajak,
    penghasilan_diterima: data.penghasilan_diterima,
    status: data.status,
    idl: data.idl,
    tanggal_input: data.tanggal_input,
  };
}

export function toPagedPPh21PenerimaResponse(pagedResult: {
  result: TPPh21PenerimaSingleModel[];
  current_page: number;
  total_page: number;
  total_count: number;
}): TPPh21PenerimaModelPagedResult {
  return {
    result: pagedResult.result.map(toPPh21PenerimaSingleResponse),
    current_page: pagedResult.current_page,
    total_page: pagedResult.total_page,
    total_count: pagedResult.total_count,
  };
}
