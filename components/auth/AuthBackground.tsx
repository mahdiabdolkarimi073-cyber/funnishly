export default function AuthBackground() {
    return (
        <>
            {/* soft background blobs */}
            <div className="pointer-events-none absolute -left-24 top-8 h-80 w-80 rounded-full bg-blue-200/35 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-purple-200/25 blur-3xl" />
            <div className="pointer-events-none absolute left-[40%] top-[5%] h-64 w-64 rounded-full bg-pink-100/30 blur-3xl" />

            {/* dot pattern overlay */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.1] [background-image:radial-gradient(#c7d2fe_1.5px,transparent_1.5px)] [background-size:28px_28px]" />

            {/* scattered sparkles */}
            <div className="pointer-events-none absolute left-[10%] top-[15%] fn-float-slow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-blue-300">
                    <path d="M12 2l1.5 7.5L21 12l-7.5 2.5L12 22l-1.5-7.5L3 12l7.5-2.5z" fill="currentColor" />
                </svg>
            </div>
            <div className="pointer-events-none absolute right-[8%] bottom-[18%] fn-float">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-pink-300">
                    <path d="M12 2l1.5 7.5L21 12l-7.5 2.5L12 22l-1.5-7.5L3 12l7.5-2.5z" fill="currentColor" />
                </svg>
            </div>
        </>
    );
}
