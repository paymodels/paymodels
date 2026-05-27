import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase/server';

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
        Credentials({
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials) => {
                const { data: user } = await supabaseAdmin
                    .from('pm_users')
                    .select('*')
                    .eq('email', credentials.email as string)
                    .single();

                if (!user || !user.password_hash) return null;

                const isValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password_hash
                );
                if (!isValid) return null;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.avatar_url,
                };
            },
        }),
    ],
    callbacks: {
        signIn: async ({ user, account }) => {
            if (account?.provider === 'google') {
                const { data } = await supabaseAdmin
                    .from('pm_users')
                    .upsert(
                        {
                            email: user.email!,
                            name: user.name,
                            avatar_url: user.image,
                            google_id: account.providerAccountId,
                        },
                        { onConflict: 'email' }
                    )
                    .select('id')
                    .single();

                if (data) user.id = data.id;
            }
            return true;
        },
        jwt: async ({ token, user }) => {
            if (user) {
                token.sub = user.id;
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (session.user) {
                session.user.id = token.sub as string;
            }
            return session;
        },
    },
    pages: {
        signIn: '/',
    },
});
