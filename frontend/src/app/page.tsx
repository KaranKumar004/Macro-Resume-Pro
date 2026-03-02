import Link from 'next/link';
import { ArrowRight, CheckCircle2, Zap, Shield, FileText, Target } from 'lucide-react';

export default function Home() {
  return (
    <div className="overflow-hidden">

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 px-4">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            AI-Powered Optimization
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8">
            Get Past the ATS <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Land the Interview.</span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop guessing what recruiters want. Upload your resume, paste the target job description, and our AI will rewrite your experience to perfectly match the keywords and requirements.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/builder"
              className="group flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-neutral-950 font-bold text-lg px-8 py-4 rounded-xl transition-all shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)]"
            >
              Optimize Your Resume
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 rounded-xl font-medium text-white bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 transition-colors"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="how-it-works" className="py-24 bg-neutral-900/30 border-t border-b border-neutral-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Official Tools for Serious Candidates</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">Built with state-of-the-art AI to ensure your resume stands out to both applicant tracking systems and human recruiters.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-neutral-900/60 p-8 rounded-3xl border border-neutral-800">
              <div className="bg-emerald-500/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Instant Tailoring</h3>
              <p className="text-neutral-400 leading-relaxed">
                Generate a custom-tailored resume in seconds. We analyze the job description to find missing keywords and smoothly integrate them into your experience bullets.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-neutral-900/60 p-8 rounded-3xl border border-neutral-800">
              <div className="bg-cyan-500/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">ATS Compatibility</h3>
              <p className="text-neutral-400 leading-relaxed">
                We format your output in clean, readable lists that Applicant Tracking Systems can parse instantly without breaking character encoding.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-neutral-900/60 p-8 rounded-3xl border border-neutral-800">
              <div className="bg-purple-500/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Pristine Markdown</h3>
              <p className="text-neutral-400 leading-relaxed">
                Copy and paste perfection. Our AI returns robust, perfectly formatted markdown you can paste straight into Google Docs or Word.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto bg-gradient-to-b from-neutral-900 to-neutral-800/50 p-10 md:p-14 rounded-3xl border border-neutral-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <Target className="w-64 h-64 text-emerald-400" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">Stop Applying into the Void.</h2>
          <p className="text-lg text-neutral-400 mb-10 relative z-10">
            Join thousands of candidates who started getting call-backs after tailoring their resume.
          </p>
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 bg-white hover:bg-neutral-200 text-neutral-950 font-bold text-lg px-8 py-4 rounded-xl transition-colors relative z-10"
          >
            Start Building Now
          </Link>
        </div>
      </section>

    </div>
  );
}
