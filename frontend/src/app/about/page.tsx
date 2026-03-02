export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-8 tracking-tight">About Us</h1>
            <div className="prose prose-invert prose-emerald max-w-none space-y-6">
                <p className="text-xl text-neutral-300 leading-relaxed font-medium">
                    We built Macro-Resume Pro because we believe your experience deserves to be seen. Too many highly qualified candidates are automatically rejected by Applicant Tracking Systems (ATS) simply because they didn't use the exact phrasing an algorithm was looking for.
                </p>
                <div className="p-8 bg-neutral-900/60 border border-neutral-800 rounded-3xl backdrop-blur-md">
                    <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
                    <p className="text-neutral-400">
                        To level the playing field between job seekers and automated screening tools using state-of-the-art AI. We analyze target job descriptions and dynamically re-write your existing experience to highlight the exact skills and keywords recruiters are searching for.
                    </p>
                </div>
            </div>
        </div>
    );
}
