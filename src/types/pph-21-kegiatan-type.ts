export type TPPh21KegiatanCreateFormSchema = {
  kode_kegiatan_penghasilan_orang_pribadi: string;
  kode_jenis_pajak: number;
  jenis_penghasilan: string;
  uraian_kegiatan: string;
  no_pengajuan: string;
  pic_pencairan_penghasilan: string;
  minta_billing_sendiri: string;
  idl: string;
  tanggal_input: Date;
};

export type TPPh21KegiatanUpdateFormSchema = {
  kode_jenis_pajak: number;
  jenis_penghasilan: string;
  uraian_kegiatan: string;
  no_pengajuan: string;
  pic_pencairan_penghasilan: string;
  minta_billing_sendiri: string;
  idl: string;
};

export type TPPh21KegiatanModel = {
  kode_kegiatan_penghasilan_orang_pribadi: string;
  tanggal_input: Date;
  uraian_kegiatan: string;
  no_pengajuan: string;
  jenis_penghasilan: string;
  total_potongan_pajak: string;
  total_penghasilan_bruto: string;
};

export type TPPh21KegiatanSingleModel = {
  kode_kegiatan_penghasilan_orang_pribadi: string;
  kode_jenis_pajak: number;
  jenis_penghasilan: string;
  uraian_kegiatan: string;
  no_pengajuan: string;
  pic_pencairan_penghasilan: string;
  minta_billing_sendiri: string;
  idl: string;
  tanggal_input: Date;
};

export type TPPh21KegiatanModelPagedResult = {
  result: TPPh21KegiatanModel[];
  current_page: number;
  total_page: number;
  total_count: number;
};

export function toPPh21KegiatanResponse(data: TPPh21KegiatanModel) {
  return {
    kode_kegiatan_penghasilan_orang_pribadi:
      data.kode_kegiatan_penghasilan_orang_pribadi,
    tanggal_input: data.tanggal_input,
    uraian_kegiatan: data.uraian_kegiatan,
    no_pengajuan: data.no_pengajuan,
    jenis_penghasilan: data.jenis_penghasilan,
    total_potongan_pajak: data.total_potongan_pajak,
    total_penghasilan_bruto: data.total_penghasilan_bruto,
  };
}

export function toPPh21KegiatanSingleResponse(data: TPPh21KegiatanSingleModel) {
  return {
    kode_kegiatan_penghasilan_orang_pribadi:
      data.kode_kegiatan_penghasilan_orang_pribadi,
    kode_jenis_pajak: data.kode_jenis_pajak,
    jenis_penghasilan: data.jenis_penghasilan,
    uraian_kegiatan: data.uraian_kegiatan,
    no_pengajuan: data.no_pengajuan,
    pic_pencairan_penghasilan: data.pic_pencairan_penghasilan,
    minta_billing_sendiri: data.minta_billing_sendiri,
    idl: data.idl,
    tanggal_input: data.tanggal_input,
  };
}

export function toPagedPPh21KegiatanResponse(pagedResult: {
  result: TPPh21KegiatanModel[];
  current_page: number;
  total_page: number;
  total_count: number;
}): TPPh21KegiatanModelPagedResult {
  return {
    result: pagedResult.result.map(toPPh21KegiatanResponse),
    current_page: pagedResult.current_page,
    total_page: pagedResult.total_page,
    total_count: pagedResult.total_count,
  };
}
