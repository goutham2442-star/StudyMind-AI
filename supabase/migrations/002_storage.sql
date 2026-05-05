-- StudyMind AI Storage Configuration

-- Create the "papers" bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('papers', 'papers', true, 20971520, '{application/pdf}');

-- Storage Policies for "papers" bucket

-- Allow public read access to all files in the "papers" bucket
create policy "Anyone can view papers" on storage.objects for select
  using (bucket_id = 'papers');

-- Allow authenticated users to upload files to the "papers" bucket
create policy "Authenticated users can upload papers" on storage.objects for insert
  with check (bucket_id = 'papers' and auth.role() = 'authenticated');

-- Allow users to update/delete their own uploaded files
create policy "Users can manage own paper files" on storage.objects for update
  using (bucket_id = 'papers' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete own paper files" on storage.objects for delete
  using (bucket_id = 'papers' and auth.uid()::text = (storage.foldername(name))[1]);
