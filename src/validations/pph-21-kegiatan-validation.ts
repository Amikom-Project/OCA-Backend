import { z } from 'zod';

export const PPh21KegiatanValidation = z.object({
  jenis_penghasilan: z.string({
    required_error: 'Jenis Penghasilan tidak boleh kosong !',
  }),
  uraian_kegiatan: z
    .string()
    .min(1, { message: 'Uraian Kegiatan tidak boleh kosong !' })
    .max(255, {
      message: 'Uraian Kegiatan tidak bisa lebih dari 255 karakter !',
    }),
  no_pengajuan: z.string({
    required_error: 'Pengajuan Anggaran tidak boleh kosong !',
  }),
  pic_pencairan_penghasilan: z.string({
    required_error: 'PIC (Pencairan Penghasilan) tidak boleh kosong !',
  }),
  minta_billing_sendiri: z.enum(['Ya', 'Tidak'], {
    required_error: 'Menghendaki Billing Terpisah tidak boleh kosong !',
  }),
  idl: z.string({
    required_error: 'IDL tidak boleh kosong !',
  }),
});
