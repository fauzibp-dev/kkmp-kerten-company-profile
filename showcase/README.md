# KKMP Kerten — Showcase Interaktif
Versi baru ditambahkan pada route **/showcase/**. Halaman lama di `/` tidak ditimpa.

## Route
- `/showcase/` — company profile interaktif dan mode presentasi fullscreen.
- `/admin/` — dashboard pengelolaan konten, bidang usaha, linimasa, foto, pengurus, dan testimoni.
- `/` — halaman lama tetap dipertahankan.

## Stack & biaya
Static HTML/CSS/JS, Supabase Auth/Postgres/Storage, dan Vercel Hobby. Tidak ada build step, service berbayar, atau service-role key di browser. Batas penggunaan gratis Supabase/Vercel tetap berlaku.

## Foto asli
Showcase tidak memakai foto stok, ilustrasi pengganti, atau wajah hasil AI. Galeri hanya merender file foto yang diunggah ke bucket Supabase. File asli diunggah langsung dari browser tanpa filter, penggantian wajah, atau generative edit. Jika bucket belum berisi foto, halaman menampilkan empty state, bukan gambar ilustrasi.
1. Masuk ke `/admin/` → **Galeri foto**.
2. Pilih beberapa file JPG/PNG/WebP sekaligus (maksimum 10 MB per file).
3. Isi judul/kategori, simpan. Tiap file menjadi item galeri tersendiri.
4. Klik **Jadikan sampul** untuk memilih foto hero.

## Setup admin pertama
1. Buat user email/password di [Supabase Auth Users](https://supabase.com/dashboard/project/fiakmfqxyneccpudjngj/auth/users).
2. Salin UUID user.
3. Jalankan di SQL Editor:
```sql
insert into public.admin_users(user_id,role,is_active)
values ('UUID-USER-DARI-AUTH','super_admin',true)
on conflict(user_id) do update set role='super_admin',is_active=true;
```
4. Authentication → URL Configuration: set Site URL ke domain Vercel dan Redirect URLs ke `https://DOMAIN/admin/`.
5. Login di `/admin/`.

## Database
- Struktur, RLS, grants, bucket, dan Storage policies: `supabase/schema.sql`.
- Starter content: `supabase/seed.sql`.
- URL dan publishable key berada di `showcase/config.js`. Publishable key memang untuk browser. Jangan pernah memasukkan secret/service-role key ke frontend.

## Data sumber
- NIB **2507250093543**, diterbitkan 25 Juli 2025.
- Badan hukum **AHU-0013109.AH.01.29.TAHUN 2025**.
- Alamat **Jl. Ahmad Yani No. 377, Kerten, Laweyan, Kota Surakarta, Jawa Tengah 57143**.
- Status PJP dan USP ditulis sesuai lampiran NIB; tidak diasumsikan sudah beroperasi.
- Nomor telepon awal memakai nomor pada NIB (**0812 2572 2106**); konfirmasikan sebelum publikasi final karena ada nomor berbeda pada dokumen laporan periode lain.
- Nama pengurus, jumlah anggota, testimoni, dan angka finansial tidak dipublikasikan otomatis tanpa verifikasi/persetujuan.

## Mode presentasi
Buka `/showcase/?present=1` atau klik **Mode presentasi**. Navigasi: `← / →`, `Page Up / Page Down`, `Space`; `F` fullscreen; `Esc` keluar.
