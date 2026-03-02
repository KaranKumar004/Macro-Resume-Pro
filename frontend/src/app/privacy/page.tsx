export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-8 tracking-tight">Privacy Policy</h1>
            <div className="prose prose-invert prose-emerald max-w-none space-y-6 text-neutral-400">
                <p className="text-lg">Last updated: {new Date().toLocaleDateString()}</p>

                <h2 className="text-2xl font-bold text-white mt-12 mb-4">1. Data Collection</h2>
                <p>We only process the PDF resumes and job descriptions you explicitly upload to our service for the sole purpose of AI optimization.</p>

                <h2 className="text-2xl font-bold text-white mt-12 mb-4">2. Data Processing via AI</h2>
                <p>To provide our services, your uploaded text is securely transmitted to our backend and processed by advanced Large Language Models (LLMs). The output is then immediately returned to you.</p>

                <h2 className="text-2xl font-bold text-white mt-12 mb-4">3. Data Retention</h2>
                <p>We do not store your original resumes or the AI-generated outputs on our servers after the session is closed. Your documents are processed in memory and discarded.</p>

                <h2 className="text-2xl font-bold text-white mt-12 mb-4">4. Third-Party Services</h2>
                <p>We integrate with Google's Gemini AI to process text. Their API usage is bound by strict enterprise privacy agreements that prevent them from using your personal resume data to train their public models.</p>
            </div>
        </div>
    );
}
