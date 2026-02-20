import React from 'react';
import {
    Check,
    X,
    AlertCircle,
    Info,
    ChevronRight,
    ExternalLink,
    Search,
    Bell,
    User,
    Home
} from 'lucide-react';

export const ComponentLibraryPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold font-serif text-gray-900 mb-4">Design System & Component Library</h1>
                    <p className="text-xl text-gray-600">
                        A collection of reusable components, design tokens, and style guides for AffittoChiaro developers and designers.
                    </p>
                </div>

                {/* 1. COLORS */}
                <section className="bg-white rounded-2xl shadow-sm p-8 mb-8" id="colors">
                    <h2 className="text-2xl font-bold mb-6 border-b pb-2">1. Color Palette</h2>

                    <div className="space-y-8">
                        {/* Primary Colors */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-gray-700">Primary Brand Colors</h3>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                                    <div key={shade} className="space-y-2">
                                        <div className={`h-16 w-full rounded-lg shadow-sm bg-primary-${shade} flex items-center justify-center text-xs font-mono ${shade > 400 ? 'text-white' : 'text-gray-900'}`}>
                                            bg-primary-{shade}
                                        </div>
                                        <div className="text-xs text-gray-500 text-center">
                                            --color-primary-{shade}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Secondary Colors */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-gray-700">Secondary / Accent</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <div className="h-16 w-full rounded-lg shadow-sm bg-secondary-500 flex items-center justify-center text-xs font-mono text-white">
                                        bg-secondary-500
                                    </div>
                                    <div className="text-xs text-gray-500 text-center">Teal / Brand</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-16 w-full rounded-lg shadow-sm bg-orange-500 flex items-center justify-center text-xs font-mono text-white">
                                        bg-orange-500
                                    </div>
                                    <div className="text-xs text-gray-500 text-center">Attention</div>
                                </div>
                            </div>
                        </div>

                        {/* Neutrals */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-gray-700">Neutrals & Grays</h3>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                                    <div key={shade} className="space-y-2">
                                        <div className={`h-16 w-full rounded-lg shadow-sm bg-gray-${shade} flex items-center justify-center text-xs font-mono ${shade > 400 ? 'text-white' : 'text-gray-900'}`}>
                                            bg-gray-{shade}
                                        </div>
                                        <div className="text-xs text-gray-500 text-center">
                                            --color-gray-{shade}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Semantic Status */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-gray-700">Semantic Status Colors</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <div className="h-16 w-full rounded-lg shadow-sm bg-green-500 flex items-center justify-center text-xs font-mono text-white">Success</div>
                                    <div className="text-xs text-gray-500 text-center">Green-500</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-16 w-full rounded-lg shadow-sm bg-red-500 flex items-center justify-center text-xs font-mono text-white">Error</div>
                                    <div className="text-xs text-gray-500 text-center">Red-500</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-16 w-full rounded-lg shadow-sm bg-yellow-500 flex items-center justify-center text-xs font-mono text-white">Warning</div>
                                    <div className="text-xs text-gray-500 text-center">Yellow-500</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-16 w-full rounded-lg shadow-sm bg-blue-500 flex items-center justify-center text-xs font-mono text-white">Info</div>
                                    <div className="text-xs text-gray-500 text-center">Blue-500</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. TYPOGRAPHY */}
                <section className="bg-white rounded-2xl shadow-sm p-8 mb-8" id="typography">
                    <h2 className="text-2xl font-bold mb-6 border-b pb-2">2. Typography</h2>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Headings (Font: Poppins / Serif)</h3>
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-5xl font-bold font-serif text-gray-900">Heading 1</h1>
                                    <code className="text-xs text-gray-400 block mt-1">.text-5xl .font-bold .font-serif</code>
                                </div>
                                <div>
                                    <h2 className="text-4xl font-bold font-serif text-gray-900">Heading 2</h2>
                                    <code className="text-xs text-gray-400 block mt-1">.text-4xl .font-bold .font-serif</code>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold font-serif text-gray-900">Heading 3</h3>
                                    <code className="text-xs text-gray-400 block mt-1">.text-3xl .font-bold .font-serif</code>
                                </div>
                                <div>
                                    <h4 className="text-2xl font-bold font-serif text-gray-900">Heading 4</h4>
                                    <code className="text-xs text-gray-400 block mt-1">.text-2xl .font-bold .font-serif</code>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Body & Utilities (Font: Inter)</h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xl text-gray-600">Lead Paragraph text used for introductions and hero descriptions.</p>
                                    <code className="text-xs text-gray-400 block mt-1">.text-xl .text-gray-600</code>
                                </div>
                                <div>
                                    <p className="text-base text-gray-600">Standard body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                    <code className="text-xs text-gray-400 block mt-1">.text-base .text-gray-600</code>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Small text for secondary information, metadata, or captions.</p>
                                    <code className="text-xs text-gray-400 block mt-1">.text-sm .text-gray-500</code>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Overline Text</p>
                                    <code className="text-xs text-gray-400 block mt-1">.text-xs .uppercase .tracking-wider .font-bold</code>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. BUTTONS */}
                <section className="bg-white rounded-2xl shadow-sm p-8 mb-8" id="buttons">
                    <h2 className="text-2xl font-bold mb-6 border-b pb-2">3. Buttons & Interactions</h2>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Styles</h3>
                            <div className="flex flex-wrap gap-4 items-center">
                                <button className="btn btn-primary">Primary Button</button>
                                <button className="btn btn-outline">Outline Button</button>
                                <button className="btn bg-white border border-gray-200 hover:bg-gray-50">Secondary / White</button>
                                <button className="text-primary-600 font-bold hover:underline">Link Button</button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Sizes</h3>
                            <div className="flex flex-wrap gap-4 items-center">
                                <button className="btn btn-primary btn-lg">Large Button</button>
                                <button className="btn btn-primary">Default Button</button>
                                <button className="btn btn-primary btn-sm">Small Button</button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">States</h3>
                            <div className="flex flex-wrap gap-4 items-center">
                                <button className="btn btn-primary opacity-50 cursor-not-allowed">Disabled</button>
                                <button className="btn btn-primary animate-pulse">Loading...</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. FORM ELEMENTS */}
                <section className="bg-white rounded-2xl shadow-sm p-8 mb-8" id="forms">
                    <h2 className="text-2xl font-bold mb-6 border-b pb-2">4. Form Elements</h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Text Input</label>
                                <input type="text" placeholder="Placeholder text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Input</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500">@</span>
                                    </div>
                                    <input type="email" placeholder="example@email.com" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Input</label>
                                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
                                    <option>Option 1</option>
                                    <option>Option 2</option>
                                    <option>Option 3</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" defaultChecked />
                                    <span className="text-gray-700">Checkbox Option Selected</span>
                                </label>
                            </div>
                            <div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                                    <span className="text-gray-700">Checkbox Option</span>
                                </label>
                            </div>

                            <div className="pt-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="radio-demo" className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500" defaultChecked />
                                    <span className="text-gray-700">Radio Option 1</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer mt-2">
                                    <input type="radio" name="radio-demo" className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500" />
                                    <span className="text-gray-700">Radio Option 2</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. UI COMPONENTS */}
                <section className="bg-white rounded-2xl shadow-sm p-8 mb-8" id="components">
                    <h2 className="text-2xl font-bold mb-6 border-b pb-2">5. UI Components</h2>

                    <div className="grid lg:grid-cols-2 gap-12">

                        {/* Badges */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Badges</h3>
                            <div className="flex flex-wrap gap-2">
                                <span className="badge bg-primary-100 text-primary-700">Primary</span>
                                <span className="badge bg-green-100 text-green-700">Success</span>
                                <span className="badge bg-red-100 text-red-700">Error</span>
                                <span className="badge bg-yellow-100 text-yellow-700">Warning</span>
                                <span className="badge bg-gray-100 text-gray-700">Neutral</span>

                                {/* Pill style */}
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-500 text-white">Filled</span>
                            </div>
                        </div>

                        {/* Icons */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Common Icons (Lucide React)</h3>
                            <div className="flex gap-4 text-gray-600">
                                <Home className="w-6 h-6" />
                                <User className="w-6 h-6" />
                                <Search className="w-6 h-6" />
                                <Bell className="w-6 h-6" />
                                <ChevronRight className="w-6 h-6" />
                                <ExternalLink className="w-6 h-6" />
                                <AlertCircle className="w-6 h-6" />
                            </div>
                        </div>

                        {/* Cards */}
                        <div className="lg:col-span-2">
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Cards</h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Standard Card */}
                                <div className="card p-6 bg-white border border-gray-100 rounded-xl shadow-card hover:shadow-card-hover transition-shadow">
                                    <h4 className="font-bold text-lg mb-2">Standard Card</h4>
                                    <p className="text-gray-600 mb-4">This is a standard card component with shadow styling and hover effect.</p>
                                    <button className="text-primary-600 text-sm font-bold hover:underline">Action Link</button>
                                </div>

                                {/* Listing Card Preview */}
                                <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
                                    <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-400">Image Placeholder</div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="font-bold text-lg">Listing Title</div>
                                            <div className="text-primary-600 font-bold">€1.200</div>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-4">Short description or address...</p>
                                        <button className="btn btn-outline btn-sm w-full">View Details</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

            </div>
        </div>
    );
};
