import React, { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
// Import common languages
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-docker";
import "prismjs/components/prism-java";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-css";

interface CodeViewerProps {
    code: string;
    language: string;
    className?: string;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ code, language, className = "" }) => {
    useEffect(() => {
        Prism.highlightAll();
    }, [code, language]);

    return (
        <div className={`relative h-full overflow-hidden rounded-lg bg-[#1e1e1e] border border-white/10 ${className}`}>
            <div className="absolute top-0 right-0 p-2 bg-black/50 text-xs text-slate-400 rounded-bl">
                {language}
            </div>
            <pre className="h-full overflow-auto p-4 text-sm font-mono custom-scrollbar m-0">
                <code className={`language-${language}`}>{code}</code>
            </pre>
        </div>
    );
};

export default CodeViewer;
