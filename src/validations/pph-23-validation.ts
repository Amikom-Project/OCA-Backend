import { z } from 'zod';

export const PPh23Validation = z.object({
  jenis_penghasilan: z.string({
    required_error: 'Jenis Penghasilan tidak boleh kosong !',
  }),
  uraian_kegiatan: z
    .string({
      required_error: 'Uraian Kegiatan tidak boleh kosong !',
    })
    .min(1, { message: 'Uraian Kegiatan tidak bisa kurang dari 1 karakter !' })
    .max(255, {
      message: 'Uraian Kegiatan tidak bisa lebih dari 255 karakter !',
    }),
  no_pengajuan: z.string({
    required_error: 'No Pengajuan Anggaran tidak boleh kosong !',
  }),
  target_penerima: z.string({
    required_error: 'Target Penerima tidak boleh kosong !',
  }),
  nama_penerima: z.string({
    required_error: 'Nama Penerima tidak boleh kosong !',
  }),
  kode_objek_pajak: z.string({
    required_error: 'Objek Pajak tidak boleh kosong !',
  }),
  penghasilan_bruto: z
    .number({
      required_error: 'Penghasilan Bruto tidak boleh kosong !',
    })
    .positive(),
  pic_pencairan_penghasilan: z.string({
    required_error: 'PIC (Pencairan Penghasilan) tidak boleh kosong !',
  }),
  invoice: z.string({
    required_error: 'File Dokumen Invoice tidak boleh kosong !',
  }),
  faktur_pajak: z.string().optional(),
  dokumen_kerjasama_kegiatan: z.string().optional(),
  idl: z.string({
    required_error: 'IDL tidak boleh kosong !',
  }),
});
