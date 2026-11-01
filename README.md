# KKMP Kerten — Company Profile

A cinematic, interactive company profile for **Koperasi Kelurahan Merah Putih Kerten, Kecamatan Laweyan, Kota Surakarta**.

## Experience
- Editorial, cinematic one-page profile with scroll reveals and presentation mode.
- Keyboard navigation and fullscreen controls for auditorium / video recording.
- Gallery, business scope, cooperative story, contact and timeline.
- Protected admin workspace for content, gallery, business units, board members and testimonials.
- Supabase Auth + Row Level Security for admin access and editable content.

## Local preview
This is a static site. Open `index.html` with a local static server.

## Backend setup
1. Create a Supabase project.
2. Apply `supabase/schema.sql` in the Supabase SQL editor.
3. Set the one-time admin setup key generated during project provisioning in the database setup SQL, then use it at `/admin/setup/`.
4. Add the Supabase project URL and publishable key to `config.js`.
5. Deploy the repository to Vercel.

See the Admin & Supabase Setup section in this README after project provisioning.
