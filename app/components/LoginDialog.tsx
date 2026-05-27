'use client';

import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { signIn } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface LoginDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSwitchToRegister: () => void;
}

export function LoginDialog({
    open,
    onOpenChange,
    onSwitchToRegister = () => {},
}: LoginDialogProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            setError('邮箱或密码错误');
        } else {
            onOpenChange(false);
            setEmail('');
            setPassword('');
        }
    };

    const handleGoogleLogin = () => {
        signIn('google', { redirect: true });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="p-0">
                <DialogTitle className="sr-only">登录</DialogTitle>
                <Card className="border-0 shadow-none">
                    <CardHeader>
                        <CardTitle>登录</CardTitle>
                        <CardDescription>使用账号密码或 Google 账号登录</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCredentialsLogin}>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="login-email">邮箱</FieldLabel>
                                    <Input
                                        id="login-email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="login-password">密码</FieldLabel>
                                    <Input
                                        id="login-password"
                                        type="password"
                                        placeholder="输入密码"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Field>
                                {error && <p className="text-sm text-destructive">{error}</p>}
                                <Field>
                                    <Button type="submit" disabled={loading}>
                                        <LogIn data-icon="inline-start" />
                                        {loading ? '登录中...' : '登录'}
                                    </Button>
                                    <Separator />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleGoogleLogin}
                                    >
                                        <svg className="size-4" viewBox="0 0 24 24">
                                            <path
                                                fill="currentColor"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                        Google 登录
                                    </Button>
                                    <p className="text-center text-sm text-muted-foreground">
                                        没有账号？{' '}
                                        <button
                                            type="button"
                                            className="text-primary underline underline-offset-2"
                                            onClick={() => {
                                                onOpenChange(false);
                                                onSwitchToRegister();
                                            }}
                                        >
                                            注册
                                        </button>
                                    </p>
                                </Field>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
}
