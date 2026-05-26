'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function ContactFloat() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    size="icon"
                    className="fixed right-6 bottom-6 z-50 h-12 w-12 rounded-full shadow-lg"
                >
                    <MessageCircle className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-85">
                <SheetHeader>
                    <SheetTitle>联系客服</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4 text-sm text-muted-foreground">
                    <p>如有任何问题，请通过以下方式联系我们：</p>
                    <div className="rounded-lg border p-4">
                        <p className="font-medium text-foreground">企业微信</p>
                        <p className="mt-1">扫描二维码添加客服，在线为您解答</p>
                        <div className="mt-3 flex h-36 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
                            二维码占位
                        </div>
                    </div>
                    <div className="rounded-lg border p-4">
                        <p className="font-medium text-foreground">邮箱</p>
                        <p className="mt-1">support@paymodels.com</p>
                    </div>
                    <p className="text-xs">工作时间：周一至周五 9:00 - 21:00</p>
                </div>
            </SheetContent>
        </Sheet>
    );
}
