'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from '@/lib/utils';
import { LoginDialog } from '@/app/components/LoginDialog';

interface Comment {
    id: string;
    content: string;
    created_at: string;
    user: {
        id: string;
        name: string | null;
        avatar_url: string | null;
    };
}

interface DocCommentsProps {
    slug: string;
}

export function DocComments({ slug }: DocCommentsProps) {
    const { data: session, status } = useSession();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showLoginDialog, setShowLoginDialog] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`/api/docs/comments?slug=${slug}`);
                if (response.ok) {
                    const data = await response.json();
                    setComments(data.comments || []);
                }
            } catch (error) {
                console.error('Failed to fetch comments:', error);
            }
        };
        fetchComments();
    }, [slug]);

    const handleSubmit = async () => {
        if (!newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/docs/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug, content: newComment }),
            });

            if (response.ok) {
                const data = await response.json();
                setComments((prev) => [data.comment, ...prev]);
                setNewComment('');
            }
        } catch (error) {
            console.error('Failed to submit comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-16 pt-8 border-t border-border">
            <h2 className="text-2xl font-bold mb-6">评论区</h2>

            {/* 评论输入区 */}
            {status === 'loading' ? (
                <div className="text-muted-foreground">加载中...</div>
            ) : session?.user ? (
                <div className="flex gap-4 mb-8">
                    <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage src={session.user.image || undefined} />
                        <AvatarFallback>{session.user.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex flex-col gap-3">
                        <Textarea
                            placeholder="发表您的评论..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="min-h-[100px] resize-none"
                        />
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                以 {session.user.name || '用户'} 发表评论
                            </span>
                            <Button
                                onClick={handleSubmit}
                                disabled={!newComment.trim() || isSubmitting}
                                size="sm"
                            >
                                {isSubmitting ? '发表中...' : '发表评论'}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-muted/50 rounded-lg p-6 text-center mb-8">
                    <p className="text-muted-foreground mb-4">登录后发表评论</p>
                    <Button variant="outline" onClick={() => setShowLoginDialog(true)}>
                        登录
                    </Button>
                </div>
            )}

            {/* 登录弹窗 */}
            <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />

            {/* 评论列表 */}
            <div className="flex flex-col gap-6">
                {comments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                        暂无评论，成为第一个评论的人吧！
                    </p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4">
                            <Avatar className="h-10 w-10 shrink-0">
                                <AvatarImage src={comment.user.avatar_url || undefined} />
                                <AvatarFallback>
                                    {comment.user.name?.charAt(0) || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm">
                                        {comment.user.name || '匿名用户'}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(comment.created_at))}
                                    </span>
                                </div>
                                <p className="text-sm text-foreground leading-relaxed">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
