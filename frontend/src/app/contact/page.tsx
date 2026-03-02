export default function ContactPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-8 tracking-tight">Contact Us</h1>
            <div className="prose prose-invert prose-emerald max-w-none space-y-6">
                <p className="text-xl text-neutral-300 leading-relaxed font-medium">
                    Have questions, feedback, or need support? We're here to help you navigate your job search journey.
                </p>
                <div className="grid md:grid-cols-2 gap-8 mt-12">
                    <div className="p-8 bg-neutral-900/60 border border-neutral-800 rounded-3xl backdrop-blur-md">
                        <h2 className="text-2xl font-bold text-white mb-2">Support</h2>
                        <p className="text-neutral-400 mb-4">For technical issues or account questions.</p>
                        <a href="mailto:support@macroresumepro.com" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">support@macroresumepro.com</a>
                    </div>
                    <div className="p-8 bg-neutral-900/60 border border-neutral-800 rounded-3xl backdrop-blur-md">
                        <h2 className="text-2xl font-bold text-white mb-2">Collaborations</h2>
                        <p className="text-neutral-400 mb-4">Interested in partnering with us?</p>
                        <a href="mailto:partners@macroresumepro.com" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">partners@macroresumepro.com</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
