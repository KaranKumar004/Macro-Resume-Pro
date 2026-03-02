import ResumeBuilder from '../components/ResumeBuilder';

export default function BuilderPage() {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="mb-10 text-center">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    AI Resume Optimizer
                </h1>
                <p className="text-neutral-400 mt-2 text-base max-w-2xl mx-auto">
                    Upload your resume and the target job description. Our AI will automatically rewrite your experience to highlight the perfect keywords.
                </p>
            </div>

            <ResumeBuilder />
        </div>
    );
}
