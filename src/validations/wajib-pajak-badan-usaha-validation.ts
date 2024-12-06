import { z } from 'zod';

export const baseSchema = z.object({
  nama_badan_usaha: z
    .string({
      required_error: 'Nama Badan Usaha tidak boleh kosong !',
    })
    .max(100, {
      message: 'Nama Badan Usaha tidak bisa lebih dari 100 karakter !',
    }),
  email: z
    .string({
      required_error: 'Email tidak boleh kosong !',
    })
    .email({
      message: 'Format Email tidak valid !',
    }),
  file_foto_identitas_badan: z.string({
    required_error: 'File Foto Identitas Badan Usaha tidak boleh kosong !',
  }),
  npwp: z
    .string({
      required_error: 'NPWP tidak boleh kosong !',
    })
    .min(15, { message: 'NPWP tidak bisa kurang dari 15 karakter !' })
    .max(16, {
      message: 'NPWP tidak bisa lebih dari 16 karakter !',
    }),
  nama_npwp: z
    .string({
      required_error: 'Nama NPWP tidak boleh kosong !',
    })
    .max(100, {
      message: 'Nama NPWP tidak bisa lebih dari 100 karakter !',
    }),
  provinsi_npwp: z.string({
    required_error: 'Provinsi NPWP tidak boleh kosong !',
  }),
  kabupaten_npwp: z.string({
    required_error: 'Kabupaten NPWP tidak boleh kosong !',
  }),
  file_foto_npwp: z.string({
    required_error: 'File Foto NPWP tidak boleh kosong !',
  }),
  nama_bank: z.string({
    required_error: 'Nama Bank tidak boleh kosong !',
  }),
  nama_narahubung: z
    .string({ required_error: 'Nama Narahubung tidak boleh kosong !' })
    .max(100, {
      message: 'Nama Narahubung tidak bisa lebih dari 100 karakter !',
    }),
  kontak_narahubung: z
    .string({
      required_error: 'Kontak Narahubung tidak boleh kosong !',
    })
    .min(1, { message: 'Kontak Narahubung tidak bisa kurang dari 1 digit !' })
    .max(30, { message: 'Kontak Narahubung tidak bisa lebih dari 30 digit !' }),
  ada_skb_pph23: z.enum(['Ya', 'Tidak'], {
    required_error:
      'Ada SKB PPh 23 (Surat Keterangan Bebas PPh 23) tidak boleh kosong !',
  }),
  status_pkp: z.enum(['Ya', 'Tidak'], {
    required_error: 'Status PKP tidak boleh kosong !',
  }),
});

const bankSchema = z.union([
  z.object({
    nama_bank: z.literal('TUNAI'),
    no_rekening: z.string().optional(),
    nama_rekening: z.string().optional(),
    file_foto_bukti_rekening: z.string().optional(),
  }),
  z.object({
    nama_bank: z.string({ required_error: 'Nama Bank tidak boleh kosong !' }),
    no_rekening: z.string({
      required_error: 'No Rekening tidak boleh kosong !',
    }),
    nama_rekening: z
      .string({ required_error: 'Nama Rekening tidak boleh kosong !' })
      .max(100, 'Nama Rekening tidak boleh lebih dari 100 karakter !'),
    file_foto_bukti_rekening: z.string().optional(),
  }),
]);

const skbPPh23Schema = z.discriminatedUnion('ada_skb_pph23', [
  z.object({
    ada_skb_pph23: z.literal('Ya'),
    masa_berlaku_bebas_pph23: z.preprocess(
      (val) => (typeof val === 'string' ? new Date(val) : val),
      z.date({
        required_error: 'Masa Berlaku PPh 23 tidak boleh kosong !',
      })
    ),
    file_surat_bebas_pph23: z.string({
      required_error: 'File Foto KTP tidak boleh kosong !',
    }),
  }),
  z.object({
    ada_skb_pph23: z.literal('Tidak'),
    masa_berlaku_bebas_pph23: z.date().optional(),
    file_surat_bebas_pph23: z.string().optional(),
  }),
]);

export const WajibPajakBadanUsahaValidation = baseSchema
  .and(bankSchema)
  .and(skbPPh23Schema);
