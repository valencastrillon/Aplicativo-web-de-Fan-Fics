CREATE TABLE public.story_collaborators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id text NOT NULL,
  story_title text NOT NULL,
  owner_id uuid NOT NULL,
  owner_name text NOT NULL,
  invitee_email text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (story_id, owner_id, invitee_email)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.story_collaborators TO authenticated;
GRANT ALL ON public.story_collaborators TO service_role;
ALTER TABLE public.story_collaborators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage their invites" ON public.story_collaborators FOR ALL TO authenticated
  USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Invitees view their invites" ON public.story_collaborators FOR SELECT TO authenticated
  USING (lower(invitee_email) = lower(auth.jwt() ->> 'email'));
CREATE POLICY "Invitees respond to invites" ON public.story_collaborators FOR UPDATE TO authenticated
  USING (lower(invitee_email) = lower(auth.jwt() ->> 'email'))
  WITH CHECK (lower(invitee_email) = lower(auth.jwt() ->> 'email') AND status IN ('accepted','declined'));