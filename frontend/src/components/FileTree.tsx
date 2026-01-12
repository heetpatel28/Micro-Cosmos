import React, { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, FileCode, FileJson, FileType, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FileNode {
    name: string;
    path: string;
    type: 'file' | 'directory';
    children?: FileNode[];
}

interface FileTreeProps {
    data: FileNode[];
    onSelect: (path: string) => void;
    selectedPath?: string;
    className?: string;
}

const getFileIcon = (name: string) => {
    if (name.endsWith('.tsx') || name.endsWith('.ts') || name.endsWith('.js') || name.endsWith('.jsx')) return <FileCode className="w-4 h-4 text-blue-400" />;
    if (name.endsWith('.json') || name.endsWith('.yml')) return <FileJson className="w-4 h-4 text-yellow-400" />;
    if (name.endsWith('.css') || name.endsWith('.scss')) return <FileType className="w-4 h-4 text-pink-400" />;
    if (name.includes('config') || name.startsWith('.')) return <Settings className="w-4 h-4 text-slate-400" />;
    return <File className="w-4 h-4 text-slate-400" />;
};

const TreeNode = ({ node, onSelect, selectedPath, level = 0 }: { node: FileNode, onSelect: (p: string) => void, selectedPath?: string, level?: number }) => {
    const [isOpen, setIsOpen] = useState(level === 0); // Open root by default
    const isSelected = selectedPath === node.path;
    const hasChildren = node.type === 'directory' && node.children && node.children.length > 0;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (node.type === 'directory') {
            setIsOpen(!isOpen);
        } else {
            onSelect(node.path);
        }
    };

    return (
        <div className='select-none'>
            <div
                className={`flex items-center gap-2 py-1.5 px-2 cursor-pointer transition-colors rounded
                ${isSelected ? 'bg-neon-cyan/20 text-neon-cyan' : 'hover:bg-white/5 text-slate-300'}
            `}
                style={{ paddingLeft: `${level * 16 + 8}px` }}
                onClick={handleClick}
            >
                {node.type === 'directory' && (
                    <span className="text-slate-500">
                        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </span>
                )}
                {node.type === 'directory' ? (
                    isOpen ? <FolderOpen className="w-4 h-4 text-orange-400" /> : <Folder className="w-4 h-4 text-orange-400" />
                ) : (
                    getFileIcon(node.name)
                )}
                <span className="text-sm truncate">{node.name}</span>
            </div>
            <AnimatePresence>
                {isOpen && hasChildren && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        {node.children!.map((child) => (
                            <TreeNode key={child.path} node={child} onSelect={onSelect} selectedPath={selectedPath} level={level + 1} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FileTree: React.FC<FileTreeProps> = ({ data, onSelect, selectedPath, className = "" }) => {
    return (
        <div className={`overflow-y-auto custom-scrollbar ${className}`}>
            {data.map((node) => (
                <TreeNode key={node.path} node={node} onSelect={onSelect} selectedPath={selectedPath} />
            ))}
        </div>
    );
};

export default FileTree;
