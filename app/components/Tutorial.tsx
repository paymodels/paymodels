export default function Tutorial() {
    return (
        <section className="py-16 sm:py-24">
            <div className="mx-auto max-w-3xl px-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">充值教程</h2>
                    <p className="mt-4 text-muted-foreground">
                        只需简单几步，即可完成 ChatGPT Plus / Pro 充值
                    </p>
                </div>

                <div
                    className="relative mt-10 overflow-hidden rounded-xl border shadow-lg"
                    style={{ aspectRatio: '1662 / 1080' }}
                >
                    <video
                        controls
                        playsInline
                        preload="metadata"
                        className="absolute inset-0 h-full w-full"
                        poster="/assets/videoframe_0.png"
                    >
                        <source src="https://cdn.how2cs.cn/files/getgptpro.mp4" type="video/mp4" />
                        您的浏览器不支持视频播放
                    </video>
                </div>
            </div>
        </section>
    );
}
