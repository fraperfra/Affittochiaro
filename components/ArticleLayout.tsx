import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Share2, Calendar, User, Clock, ChevronRight } from 'lucide-react';

interface ArticleLayoutProps {
    title: string;
    description: string;
    publishDate: string;
    readTime: string;
    author: string;
    category: string;
    image: string;
    toc: { id: string; title: string }[];
    children: React.ReactNode;
}

export const ArticleLayout: React.FC<ArticleLayoutProps> = ({
    title,
    description,
    publishDate,
    readTime,
    author,
    category,
    image,
    toc,
    children
}) => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState("");

    // Handle scroll progress and active TOC section
    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = totalScroll / windowHeight;
            setScrollProgress(scroll);

            // Active section logic
            const sections = toc.map(item => document.getElementById(item.id));
            const scrollPosition = window.scrollY + 100;

            for (const section of sections) {
                if (section && section.offsetTop <= scrollPosition && (section.offsetTop + section.offsetHeight) > scrollPosition) {
                    setActiveSection(section.id);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [toc]);

    return (
        <div className="bg-white min-h-screen">
            {/* Reading Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 z-50">
                <div
                    className="h-full bg-primary-500 transition-all duration-100 ease-out"
                    style={{ width: `${scrollProgress * 100}%` }}
                />
            </div>

            {/* Hero Section */}
            <header className="relative h-[60vh] min-h-[500px] flex items-end pb-20 text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 w-full">
                    <div className="flex flex-wrap gap-3 mb-6 animate-fade-in-up">
                        <span className="bg-primary-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            {category}
                        </span>
                        <span className="flex items-center gap-1 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">
                            <Clock className="w-3 h-3" /> {readTime}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6 leading-tight animate-fade-in-up delay-100">
                        {title}
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl animate-fade-in-up delay-200">
                        {description}
                    </p>

                    <div className="flex items-center gap-6 animate-fade-in-up delay-300">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-lg">
                                {author.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-white text-sm">{author}</p>
                                <div className="flex items-center gap-2 text-gray-400 text-xs">
                                    <Calendar className="w-3 h-3" /> {publishDate}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-16 grid lg:grid-cols-12 gap-12">
                {/* Sidebar - Table of Contents (Sticky) */}
                <aside className="hidden lg:block lg:col-span-3">
                    <div className="sticky top-24 space-y-8">
                        <div>
                            <h4 className="font-bold font-serif text-gray-900 mb-4 uppercase text-sm tracking-wider">In questo articolo</h4>
                            <nav className="space-y-1 relative border-l-2 border-gray-100">
                                {toc.map((item) => (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        className={`block pl-4 py-1 text-sm transition-colors duration-200 border-l-2 -ml-[2px] ${activeSection === item.id
                                                ? 'border-primary-500 text-primary-600 font-bold'
                                                : 'border-transparent text-gray-500 hover:text-gray-900'
                                            }`}
                                    >
                                        {item.title}
                                    </a>
                                ))}
                            </nav>
                        </div>

                        <div className="pt-8 border-t border-gray-100">
                            <h4 className="font-bold font-serif text-gray-900 mb-4 uppercase text-sm tracking-wider">Condividi</h4>
                            <div className="flex gap-2">
                                <button className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-600 transition-colors">
                                    <Facebook className="w-4 h-4" />
                                </button>
                                <button className="p-2 rounded-full bg-gray-100 hover:bg-sky-100 hover:text-sky-500 transition-colors">
                                    <Twitter className="w-4 h-4" />
                                </button>
                                <button className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-700 transition-colors">
                                    <Linkedin className="w-4 h-4" />
                                </button>
                                <button className="p-2 rounded-full bg-gray-100 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <article className="lg:col-span-6 prose prose-lg prose-headings:font-serif prose-headings:font-bold prose-a:text-primary-600 prose-img:rounded-2xl max-w-none">
                    {children}
                </article>

                {/* Sidebar Right - Newsletter & Related */}
                <aside className="lg:col-span-3 space-y-8">
                    {/* Newsletter Widget */}
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 sticky top-24">
                        <h3 className="font-bold font-serif text-xl mb-2">Guide Esclusive</h3>
                        <p className="text-sm text-gray-500 mb-4">Ricevi i consigli dei nostri esperti direttamente nella tua inbox.</p>
                        <form className="space-y-3">
                            <input type="email" placeholder="La tua email" className="input bg-white w-full text-sm" />
                            <button className="btn btn-primary w-full text-sm font-bold">Iscriviti alla Newsletter</button>
                        </form>
                    </div>

                    {/* Related Articles */}
                    <div>
                        <h3 className="font-bold font-serif text-lg mb-4">Potrebbe Interessarti</h3>
                        <div className="space-y-4">
                            <Link to="#" className="block group">
                                <div className="aspect-video rounded-lg overflow-hidden mb-2">
                                    <img src="https://placehold.co/400x250/e2e8f0/64748b?text=Contratti" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </div>
                                <h4 className="font-bold text-gray-900 text-sm group-hover:text-primary-600 leading-tight">
                                    Contratto 4+4 vs 3+2: quale scegliere?
                                </h4>
                            </Link>
                            <Link to="#" className="block group">
                                <div className="aspect-video rounded-lg overflow-hidden mb-2">
                                    <img src="https://placehold.co/400x250/e2e8f0/64748b?text=Caparra" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </div>
                                <h4 className="font-bold text-gray-900 text-sm group-hover:text-primary-600 leading-tight">
                                    Caparra Confirmatoria: come funziona la restituzione
                                </h4>
                            </Link>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
};
