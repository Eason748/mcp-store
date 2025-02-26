-- 删除旧的插入策略（如果存在）
DROP POLICY IF EXISTS "Users can create own profile" ON public.profiles;

-- 添加支持 upsert 的新策略
CREATE POLICY "Users can upsert own profile"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- 添加更新策略（如果不存在）
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles' 
        AND policyname = 'Users can update own profile'
    ) THEN
        CREATE POLICY "Users can update own profile"
            ON public.profiles
            FOR UPDATE
            USING (auth.uid() = id);
    END IF;
END $$;
