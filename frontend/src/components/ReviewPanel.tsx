import React, { useEffect, useState, useMemo } from 'react';
import JSZip from 'jszip';
import { motion } from 'framer-motion';
import { FolderTree, FileCode, Server, BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import FileTree, { FileNode } from './FileTree';
import CodeViewer from './CodeViewer';

interface ReviewPanelProps {
    downloadUrl: string;
}

type TabType = 'structure' | 'api' | 'infra' | 'readme';

const tabs = [
    { id: 'structure', label: 'Project Structure', icon: FolderTree },
    { id: 'api', label: 'API / Core', icon: FileCode },
    { id: 'infra', label: 'Docker & Infra', icon: Server },
    { id: 'readme', label: 'README', icon: BookOpen },
];

const ReviewPanel: React.FC<ReviewPanelProps> = ({ downloadUrl }) => {
    const [activeTab, setActiveTab] = useState<TabType>('structure');
    const [files, setFiles] = useState<Record<string, string>>({});
    const [fileTree, setFileTree] = useState<FileNode[]>([]);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch and Unzip
    useEffect(() => {
        let isMounted = true;

        const fetchZip = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(downloadUrl);
                if (!response.ok) throw new Error('Failed to download package');

                const blob = await response.blob();
                const zip = await JSZip.loadAsync(blob);

                const fileContentMap: Record<string, string> = {};
                const paths: string[] = [];

                await Promise.all(
                    Object.keys(zip.files).map(async (relativePath) => {
                        const zipEntry = zip.files[relativePath];
                        if (!zipEntry.dir) {
                            // Only load text files for now
                            const content = await zipEntry.async('string');
                            fileContentMap[relativePath] = content;
                            paths.push(relativePath);
                        }
                    })
                );

                if (isMounted) {
                    setFiles(fileContentMap);
                    setFileTree(buildFileTree(paths));

                    // Auto select README if available
                    const readme = paths.find(p => p.toLowerCase().includes('readme.md'));
                    if (readme) setSelectedFile(readme);
                    else if (paths.length > 0) setSelectedFile(paths[0]);

                    setIsLoading(false);
                }

            } catch (err: any) {
                if (isMounted) {
                    setError(err.message);
                    setIsLoading(false);
                }
            }
        };

        if (downloadUrl) {
            fetchZip();
        }

        return () => { isMounted = false; };
    }, [downloadUrl]);

    // Helper to build tree
    const buildFileTree = (paths: string[]): FileNode[] => {
        const root: FileNode[] = [];

        paths.forEach(path => {
            const parts = path.split('/');
            let currentLevel = root;

            parts.forEach((part, index) => {
                const isFile = index === parts.length - 1;
                const existingNode = currentLevel.find(n => n.name === part);

                if (existingNode) {
                    if (!isFile && existingNode.children) {
                        currentLevel = existingNode.children;
                    }
                } else {
                    const newNode: FileNode = {
                        name: part,
                        path: parts.slice(0, index + 1).join('/'),
                        type: isFile ? 'file' : 'directory',
                        children: isFile ? undefined : []
                    };
                    currentLevel.push(newNode);
                    if (!isFile && newNode.children) {
                        currentLevel = newNode.children;
                    }
                }
            });
        });

        return sortTree(root);
    };

    const sortTree = (nodes: FileNode[]): FileNode[] => {
        return nodes.sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === 'directory' ? -1 : 1;
        }).map(node => {
            if (node.children) node.children = sortTree(node.children);
            return node;
        });
    };

    // Filter content based on active tab
    const getFilteredFiles = () => {
        const allPaths = Object.keys(files);
        switch (activeTab) {
            // Config case removed
            case 'api':
                return allPaths.filter(p => (p.endsWith('.ts') || p.endsWith('.js') || p.endsWith('.java')) && !p.includes('test') && !p.includes('config'));
            case 'infra':
                return allPaths.filter(p => p.includes('Dockerfile') || p.includes('docker') || p.includes('nginx'));
            case 'readme':
                return allPaths.filter(p => p.toLowerCase().includes('readme.md'));
            case 'structure':
            default:
                return allPaths;
        }
    };

    const filteredPaths = useMemo(() => getFilteredFiles(), [activeTab, files]);

    // If we switch tabs, select the first file of that type if current selection is not in list
    useEffect(() => {
        if (filteredPaths.length > 0 && selectedFile && !filteredPaths.includes(selectedFile)) {
            setSelectedFile(filteredPaths[0]);
        } else if (filteredPaths.length > 0 && !selectedFile) {
            setSelectedFile(filteredPaths[0]);
        }
    }, [activeTab, filteredPaths]);


    const getExtension = (path: string) => path.split('.').pop() || 'txt';


    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="ml-2">Loading generated code...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-red-400">
                <AlertCircle className="w-12 h-12 mb-4" />
                <p>Failed to load project preview</p>
                <p className="text-sm opacity-70">{error}</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-slate-900/50 rounded-xl overflow-hidden border border-white/10">
            {/* Tabs Header */}
            <div className="flex border-b border-white/10 bg-black/20 overflow-x-auto scroller-none">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={`
                        flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative whitespace-nowrap
                        ${isActive ? 'text-neon-cyan bg-white/5' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}
                    `}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-cyan"
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden flex">
                {/* Sidebar List (Only if not full structure, structure has its own tree) */}
                {activeTab === 'structure' ? (
                    <div className="w-1/3 border-r border-white/10 bg-black/20 flex flex-col min-w-[200px]">
                        <div className="p-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Project Files</div>
                        <FileTree
                            data={fileTree}
                            onSelect={setSelectedFile}
                            selectedPath={selectedFile || undefined}
                            className="flex-1 p-2"
                        />
                    </div>
                ) : (
                    // Simple list for other tabs
                    filteredPaths.length > 1 && (
                        <div className="w-64 border-r border-white/10 bg-black/20 flex flex-col flex-none">
                            <div className="p-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{activeTab} Files</div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                                {filteredPaths.map(path => (
                                    <button
                                        key={path}
                                        onClick={() => setSelectedFile(path)}
                                        className={`
                                    w-full text-left px-3 py-2 text-sm rounded truncate mb-1
                                    ${selectedFile === path ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-slate-400 hover:bg-white/5'}
                                `}
                                    >
                                        {path.split('/').pop()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )
                )}

                {/* Code View */}
                <div className="flex-1 bg-[#1e1e1e] overflow-hidden relative">
                    {selectedFile && files[selectedFile] ? (
                        <CodeViewer
                            code={files[selectedFile]}
                            language={getExtension(selectedFile)}
                            className="h-full border-none rounded-none"
                        />
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-500">
                            Select a file to view content
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewPanel;
