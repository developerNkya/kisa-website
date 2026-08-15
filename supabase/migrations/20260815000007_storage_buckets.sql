-- Create public storage buckets used by the app
-- 'covers' – story cover images uploaded from the admin panel

insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do nothing;

-- Allow authenticated admins (service-role / anon with RLS bypass) to upload
-- and allow the public to read from the bucket.

create policy "Public read covers"
  on storage.objects for select
  using (bucket_id = 'covers');

create policy "Authenticated upload covers"
  on storage.objects for insert
  with check (
    bucket_id = 'covers'
    and auth.role() = 'authenticated'
  );

create policy "Authenticated update covers"
  on storage.objects for update
  using (
    bucket_id = 'covers'
    and auth.role() = 'authenticated'
  );

create policy "Authenticated delete covers"
  on storage.objects for delete
  using (
    bucket_id = 'covers'
    and auth.role() = 'authenticated'
  );
