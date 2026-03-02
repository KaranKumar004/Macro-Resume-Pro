'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, Send, Loader2, CheckCircle2, Copy, Check, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ResumeBuilder() {
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const [pdfTheme, setPdfTheme] = useState<'dark' | 'light'>('dark');

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type !== 'application/pdf') {
                setError('Please upload a valid PDF file.');
                return;
            }
            setFile(selectedFile);
            setError('');
        }
    };

    const handleCopy = async () => {
        if (result?.optimized_resume) {
            try {
                await navigator.clipboard.writeText(result.optimized_resume);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        }
    };

    const handleDownload = async () => {
        if (result?.optimized_resume && contentRef.current) {
            try {
                // Dynamically import html2pdf to avoid Next.js SSR "window is not defined" issues
                const html2pdf = (await import('html2pdf.js')).default;

                const element = contentRef.current;
                const opt: any = {
                    margin: [15, 15, 15, 15],
                    filename: 'Optimized_Resume.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true, backgroundColor: pdfTheme === 'dark' ? '#171717' : '#ffffff' }, // matches bg-neutral-900 / white
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                };

                html2pdf().set(opt).from(element).save();
            } catch (err) {
                console.error('Failed to generate PDF:', err);
                setError('Failed to generate PDF file.');
            }
        }
    };

    const optimizeResume = async () => {
        if (!file || !jobDescription) {
            setError('Please upload your resume and provide a job description.');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('resume', file);
            formData.append('job_description', jobDescription);

            // Call the FastAPI Python Backend
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/api/optimize-resume`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Failed to optimize resume');
            }

            setResult(data);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12">
            <div className="grid xl:grid-cols-2 gap-8 items-start">
                {/* Left Column: Inputs */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                >
                    {/* Step 1: Upload Resume */}
                    <div className="bg-neutral-900/60 border border-neutral-800/60 rounded-3xl p-6 lg:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <div className="flex items-center gap-4 mb-6 relative z-10">
                            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 p-3 rounded-2xl border border-emerald-500/20 shadow-inner">
                                <Upload className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold tracking-tight text-white">Upload Resume</h2>
                                <p className="text-neutral-400 text-sm mt-1">Provide your current PDF resume</p>
                            </div>
                        </div>

                        <label className="block w-full cursor-pointer relative z-10">
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${file
                                    ? 'border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_30px_-10px_rgba(16,185,129,0.2)]'
                                    : 'border-neutral-700/80 hover:border-emerald-500/50 hover:bg-neutral-800/80'
                                    }`}
                            >
                                <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
                                <AnimatePresence mode="wait">
                                    {file ? (
                                        <motion.div
                                            key="file-selected"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="flex flex-col items-center gap-3"
                                        >
                                            <div className="bg-emerald-500/20 p-4 rounded-full">
                                                <FileText className="w-8 h-8 text-emerald-400" />
                                            </div>
                                            <span className="font-semibold text-emerald-50 text-lg tracking-tight">{file.name}</span>
                                            <span className="text-sm text-emerald-400/80 font-medium">Click or drag to replace</span>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="no-file"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="flex flex-col items-center gap-3 text-neutral-400"
                                        >
                                            <div className="bg-neutral-800 p-4 rounded-full mb-2">
                                                <Upload className="w-8 h-8 text-neutral-300" />
                                            </div>
                                            <span className="font-semibold text-neutral-200 text-lg tracking-tight">Drag & drop your PDF</span>
                                            <span className="text-sm font-medium">or click to browse local files</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </label>
                    </div>

                    {/* Step 2: Job Description */}
                    <div className="bg-neutral-900/60 border border-neutral-800/60 rounded-3xl p-6 lg:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <div className="flex items-center gap-4 mb-6 relative z-10">
                            <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 p-3 rounded-2xl border border-cyan-500/20 shadow-inner">
                                <FileText className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold tracking-tight text-white">Target Job</h2>
                                <p className="text-neutral-400 text-sm mt-1">Paste the description or URL</p>
                            </div>
                        </div>

                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the full job description here (responsibilities, required skills, etc.) or just drop a link to the job posting."
                            className="w-full h-48 bg-neutral-950/80 border border-neutral-700/80 rounded-2xl p-5 text-base text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 resize-none transition-all relative z-10 custom-scrollbar shadow-inner"
                        />
                    </div>

                    {/* Error Display */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-start gap-3 backdrop-blur-sm"
                            >
                                <div className="min-w-4 mt-0.5">•</div>
                                <span className="font-medium">{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Step 3: Action Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={optimizeResume}
                        disabled={loading || !file || !jobDescription}
                        className="w-full group relative flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-neutral-950 font-extrabold text-lg py-5 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_40px_-10px_rgba(16,185,129,0.4)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.6)]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin text-neutral-900" />
                                <span className="tracking-wide">Analyzing Profile...</span>
                            </>
                        ) : (
                            <>
                                <span className="tracking-wide">Optimize My Resume</span>
                                <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </>
                        )}
                    </motion.button>
                </motion.div>

                {/* Right Column: Results */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-neutral-900/60 border border-neutral-800/60 rounded-3xl p-6 lg:p-8 xl:min-h-[800px] backdrop-blur-md shadow-2xl flex flex-col relative overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full flex flex-col items-center justify-center text-center space-y-8 absolute inset-0 bg-neutral-900/80 backdrop-blur-sm z-50"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                                    <Loader2 className="w-16 h-16 text-emerald-400 animate-spin relative z-10" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                                        Crafting Your Pitch
                                    </h3>
                                    <p className="text-neutral-400 font-medium max-w-xs mx-auto">
                                        Our AI recruiter is analyzing your experience against the target role requirements...
                                    </p>
                                </div>
                            </motion.div>
                        ) : result ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="h-full flex flex-col"
                            >
                                <div className="flex items-center justify-between mb-8 pb-6 border-b border-neutral-800/80">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 p-3 rounded-2xl border border-emerald-500/20">
                                            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white tracking-tight">Optimized Output</h2>
                                            <p className="text-emerald-400/80 text-sm font-medium mt-1">Tailored for maximum ATS compatibility.</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 mt-4 sm:mt-0">
                                        <div className="flex items-center bg-neutral-900/80 p-1 rounded-xl border border-neutral-700/50 mr-2">
                                            <button
                                                onClick={() => setPdfTheme('dark')}
                                                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${pdfTheme === 'dark' ? 'bg-neutral-700 text-white shadow' : 'text-neutral-400 hover:text-white'}`}
                                            >
                                                Dark
                                            </button>
                                            <button
                                                onClick={() => setPdfTheme('light')}
                                                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${pdfTheme === 'light' ? 'bg-neutral-200 text-neutral-900 shadow' : 'text-neutral-400 hover:text-white'}`}
                                            >
                                                Light
                                            </button>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleDownload}
                                            className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border border-neutral-700/50 hover:border-neutral-600"
                                        >
                                            <Download className="w-4 h-4" />
                                            <span className="hidden sm:inline">Download</span>
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleCopy}
                                            className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border border-emerald-500/20 hover:border-emerald-500/30"
                                        >
                                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            {copied ? 'Copied!' : 'Copy'}
                                        </motion.button>
                                    </div>
                                </div>

                                <div ref={contentRef} className={`flex-1 overflow-auto custom-scrollbar pr-4 -mr-4 prose max-w-none ${pdfTheme === 'dark' ? 'prose-invert prose-emerald' : 'prose-emerald bg-white p-8 rounded-2xl shadow-inner'}`}>
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            h1: ({ node, ...props }) => <h1 className={`text-2xl font-bold mb-4 mt-8 pb-2 border-b first:mt-0 ${pdfTheme === 'dark' ? 'text-white border-neutral-800' : 'text-neutral-900 border-neutral-200'}`} {...props} />,
                                            h2: ({ node, ...props }) => <h2 className={`text-xl font-bold mb-4 mt-8 pb-2 border-b ${pdfTheme === 'dark' ? 'text-white border-neutral-800/50' : 'text-neutral-800 border-neutral-200'}`} {...props} />,
                                            h3: ({ node, ...props }) => <h3 className={`text-lg font-semibold mb-3 mt-6 ${pdfTheme === 'dark' ? 'text-emerald-50' : 'text-neutral-900'}`} {...props} />,
                                            p: ({ node, ...props }) => <p className={`mb-4 leading-relaxed font-medium ${pdfTheme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`} {...props} />,
                                            ul: ({ node, ...props }) => <ul className="space-y-3 mb-6" {...props} />,
                                            li: ({ node, ...props }) => (
                                                <li className={`flex gap-3 items-start p-3.5 rounded-xl border transition-colors ${pdfTheme === 'dark'
                                                    ? 'text-neutral-300 bg-neutral-950/40 border-neutral-800/40 hover:border-emerald-500/20 hover:bg-neutral-900/60'
                                                    : 'text-neutral-700 bg-neutral-50/50 border-neutral-200 hover:border-emerald-500/20 hover:bg-emerald-50/50'
                                                    }`}>
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                                    <span className="leading-relaxed font-medium block flex-1" {...props} />
                                                </li>
                                            ),
                                            strong: ({ node, ...props }) => <strong className={`font-bold px-1 py-0.5 rounded ${pdfTheme === 'dark' ? 'text-white bg-neutral-800/50' : 'text-neutral-900 bg-emerald-50'}`} {...props} />,
                                            a: ({ node, ...props }) => <a className={`underline underline-offset-2 decoration-emerald-500/30 ${pdfTheme === 'dark' ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'}`} {...props} />
                                        }}
                                    >
                                        {result.optimized_resume}
                                    </ReactMarkdown>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center opacity-60"
                            >
                                <div className="w-24 h-24 mb-8 rounded-full border-2 border-dashed border-neutral-600 flex items-center justify-center bg-neutral-900/50">
                                    <FileText className="w-10 h-10 text-neutral-500" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-3 tracking-tight text-white">Ready to Optimize</h3>
                                <p className="text-neutral-400 max-w-md text-base leading-relaxed">
                                    Upload your current resume and a target job description on the left. Our AI will analyze the requirements and re-write your experience to get you past the ATS.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Stratfolio Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gradient-to-r from-purple-500/10 via-emerald-500/5 to-cyan-500/10 border border-neutral-800 rounded-3xl p-8 lg:p-12 relative overflow-hidden group mb-12"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-4">
                            Next Steps
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">Build your full Portfolio</h2>
                        <p className="text-neutral-400 max-w-xl text-lg lg:text-xl">
                            Take your optimized resume and instantly turn it into a stunning, deployed online portfolio with Stratfolio.
                        </p>
                    </div>
                    <a
                        href="https://stratfolio.onrender.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 bg-white hover:bg-neutral-200 text-neutral-950 font-extrabold text-lg px-8 py-5 rounded-2xl transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] whitespace-nowrap"
                    >
                        Try Stratfolio Free
                    </a>
                </div>
            </motion.div>
        </div>
    );
}
