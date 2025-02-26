-- 添加允许用户创建自己配置文件的策略
CREATE POLICY "Users can create own profile"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);
