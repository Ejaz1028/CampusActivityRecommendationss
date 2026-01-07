import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="grid sm:grid-cols-12 gap-8 py-8 md:py-12 border-t border-gray-200 lg:ml-11">
                    {/* 1st block */}
                    <div className="sm:col-span-12 lg:col-span-3 lg:mr-16">
                        <div className="mb-2">
                            {/* Logo */}
                            <Link href="/" className="inline-block" aria-label="Loop">
                                <span className="text-3xl font-extrabold tracking-tighter text-brand-dark">Loop</span>
                                <span className="text-3xl font-extrabold text-darker-secondary ml-1">∞</span>
                            </Link>
                        </div>
                        <div className="text-sm text-gray-600">
                            <Link href="#" className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
                                Terms
                            </Link> · <Link href="#" className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
                                Privacy Policy
                            </Link>
                        </div>
                    </div>

                    {/* 2nd block */}
                    <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
                        <h6 className="text-gray-800 font-medium mb-2">Company</h6>
                        <ul className="text-sm">
                            <li className="mb-2">
                                <Link href="/about" className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
                                    About us
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="#" className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
                                    Careers
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* 3rd block */}
                    <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
                        <h6 className="text-gray-800 font-medium mb-2">Resources</h6>
                        <ul className="text-sm">
                            <li className="mb-2">
                                <Link href="#" className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
                                    Documentation
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="#" className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
                                    Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* 4th block */}
                    <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
                        <h6 className="text-gray-800 font-medium mb-2">Social</h6>
                        <ul className="text-sm">
                            <li className="mb-2">
                                <Link href="#" className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
                                    Twitter
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="#" className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
                                    Instagram
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom area */}
                <div className="md:flex md:items-center md:justify-between py-4 md:py-8 border-t border-gray-200">
                    {/* Copyrights */}
                    <div className="text-sm text-center md:text-left text-gray-600 mr-4">
                        &copy; {new Date().getFullYear()} Loop. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
