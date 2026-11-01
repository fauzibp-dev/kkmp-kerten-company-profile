# KKMP Kerten — React Motion Experience

Company profile interaktif Koperasi Kelurahan Merah Putih Kerten.

## Stack
- React 19 + TypeScript
- Vite 7
- Motion for React: kinetic typography, scroll reveal, parallax, hover, timeline motion, and lightbox
- Supabase Auth, PostgreSQL, and Storage
- Static hosting target: Cloudflare Pages Free

## Local development
```bash
npm install
npm run dev
npm run build
npm run preview
```

## Routes
- `/` — profil publik React.
- `/admin/` — Content Studio yang menggunakan Supabase Auth.
- `/showcase/` — redirect ke homepage baru.

## Deploy ke Cloudflare Pages (gratis)
1. Connect repository GitHub `fauzibp-dev/kkmp-kerten-company-profile`.
2. Untuk QA, pilih branch `redesign/react-motion-v1`; setelah disetujui, merge ke branch produksi.
3. Framework preset: **Vite**.
4. Build command: `npm run build`.
5. Build output directory: `dist`.
6. Tidak perlu server-side runtime atau environment variable tambahan. Konfigurasi browser Supabase berada di `public/config.js` dan hanya berisi publishable key.
7. Tambahkan custom domain bila diperlukan.

Vercel preview dipakai hanya untuk QA sementara. Paket Vercel Hobby memiliki batasan penggunaan non-komersial; jangan menjadikannya hosting produksi untuk profil koperasi tanpa paket yang sesuai.

## Supabase
- Project: `fiakmfqxyneccpudjngj`
- Struktur tabel, RLS, grants, dan bucket: `supabase/schema.sql`.
- Konten awal: `supabase/seed.sql`.
- Bucket foto: `kkmp-media`.
- Browser config: `public/config.js`; publishable key aman ditampilkan di browser selama RLS benar. Jangan pernah memasukkan service-role/secret key ke frontend.

### Admin pertama
Audit terakhir menemukan belum ada akun di `auth.users` dan belum ada baris admin aktif di `public.admin_users`. Buat user email/password melalui Supabase Auth, lalu jalankan:

```sql
insert into public.admin_users(user_id, role, is_active)
values ('UUID_USER_AUTH', 'super_admin', true)
on conflict (user_id) do update
set role = 'super_admin', is_active = true;
```

Setelah itu login melalui `/admin/`.

## Foto dokumentasi
- Website tidak memakai foto stok atau gambar wajah buatan.
- Galeri publik membaca foto yang telah diunggah ke tabel `gallery_items` dan bucket `kkmp-media`.
- Galeri database saat audit masih kosong; foto lampiran percakapan belum tersalin ke bucket Supabase.
- Admin dapat mengunggah beberapa foto JPG/PNG/WebP sekaligus; batas 10 MB per file.
- Setelah foto diunggah, pilih salah satu sebagai foto sampul/hero dari Content Studio.

## Motion dan aksesibilitas
- Preloader dengan exit transition.
- Kinetic headline word reveal.
- Orbital identity artwork bergerak.
- Scroll progress dan parallax.
- Staggered section reveals.
- Continuous values marquee.
- Hover motion untuk bidang usaha.
- Scroll-linked timeline progress.
- Gallery lightbox dengan keyboard navigation.
- Fullscreen presentation mode dengan tombol panah, Page Up/Down, Space, dan Esc.
- Menghormati pengaturan `prefers-reduced-motion`.

## Free-tier considerations
Supabase Free has quotas for database, storage, and egress, and may pause low-activity projects after one week. Monitor usage and check current provider terms before launch.
