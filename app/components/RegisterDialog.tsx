'use client';

import { useState } from 'react';
import { z } from 'zod';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

const registerSchema = z
    .object({
        email: z.string().email('请输入有效的邮箱地址'),
        password: z.string().min(6, '密码长度不能少于 6 位'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: '两次输入的密码不一致',
        path: ['confirmPassword'],
    });

interface RegisterDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSwitchToLogin: () => void;
}

export function RegisterDialog({ open, onOpenChange, onSwitchToLogin }: RegisterDialogProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});

        const result = registerSchema.safeParse({ email, password, confirmPassword });
        if (!result.success) {
            const errors: Record<string, string> = {};
            for (const issue of result.error.issues) {
                errors[issue.path[0] as string] = issue.message;
            }
            setFieldErrors(errors);
            return;
        }

        setLoading(true);

        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            setError(data.error || '注册失败');
            return;
        }

        setSuccess(true);
        setTimeout(() => {
            onOpenChange(false);
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setSuccess(false);
        }, 1500);
    };

    const handleSwitch = () => {
        onOpenChange(false);
        onSwitchToLogin();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="p-0">
                <DialogTitle className="sr-only">注册</DialogTitle>
                <Card className="border-0 shadow-none">
                    <CardHeader>
                        <CardTitle>注册</CardTitle>
                        <CardDescription>创建账号以使用完整功能</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {success ? (
                            <p className="text-center text-sm text-primary">注册成功，请登录</p>
                        ) : (
                            <form onSubmit={handleRegister}>
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="register-email">邮箱</FieldLabel>
                                        <Input
                                            id="register-email"
                                            type="email"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                setFieldErrors((prev) => {
                                                    const next = { ...prev };
                                                    delete next.email;
                                                    return next;
                                                });
                                            }}
                                            required
                                        />
                                        {fieldErrors.email && (
                                            <p className="text-sm text-destructive">{fieldErrors.email}</p>
                                        )}
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="register-password">密码</FieldLabel>
                                        <Input
                                            id="register-password"
                                            type="password"
                                            placeholder="至少 6 位密码"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                setFieldErrors((prev) => {
                                                    const next = { ...prev };
                                                    delete next.password;
                                                    return next;
                                                });
                                            }}
                                            required
                                        />
                                        {fieldErrors.password && (
                                            <p className="text-sm text-destructive">{fieldErrors.password}</p>
                                        )}
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="register-confirm-password">确认密码</FieldLabel>
                                        <Input
                                            id="register-confirm-password"
                                            type="password"
                                            placeholder="再次输入密码"
                                            value={confirmPassword}
                                            onChange={(e) => {
                                                setConfirmPassword(e.target.value);
                                                setFieldErrors((prev) => {
                                                    const next = { ...prev };
                                                    delete next.confirmPassword;
                                                    return next;
                                                });
                                            }}
                                            required
                                        />
                                        {fieldErrors.confirmPassword && (
                                            <p className="text-sm text-destructive">{fieldErrors.confirmPassword}</p>
                                        )}
                                    </Field>
                                    {error && <p className="text-sm text-destructive">{error}</p>}
                                    <Field>
                                        <Button type="submit" disabled={loading}>
                                            <UserPlus data-icon="inline-start" />
                                            {loading ? '注册中...' : '注册'}
                                        </Button>
                                        <p className="text-center text-sm text-muted-foreground">
                                            已有账号？{' '}
                                            <button
                                                type="button"
                                                className="text-primary underline underline-offset-2"
                                                onClick={handleSwitch}
                                            >
                                                登录
                                            </button>
                                        </p>
                                    </Field>
                                </FieldGroup>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
}
