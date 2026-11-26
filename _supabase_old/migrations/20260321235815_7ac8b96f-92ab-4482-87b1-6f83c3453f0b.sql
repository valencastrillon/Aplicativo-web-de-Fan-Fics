CREATE POLICY "Users can update their own comments"
  ON public.comments FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);