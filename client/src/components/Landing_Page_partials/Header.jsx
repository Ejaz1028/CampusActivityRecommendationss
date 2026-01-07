import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useEffect } from "react";

function Header() {
    const router = useRouter();
    const [top, setTop] = useState(true);

    // detect whether user has scrolled the page down by 10px
    useEffect(() => {
        const scrollHandler = () => {
            window.pageYOffset > 10 ? setTop(false) : setTop(true);
        };
        window.addEventListener("scroll", scrollHandler);
        return () => window.removeEventListener("scroll", scrollHandler);
    }, [top]);

    return (
        <header
            className={`fixed w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out ${!top ? "bg-white/80 backdrop-blur-md shadow-lg" : ""
                }`}
        >
            <div className="max-w-6xl mx-auto px-5 sm:px-6">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Site branding */}
                    <div className="shrink-0 mr-4">
                        {/* Logo */}
                        <a
                            href="/"
                            className="block"
                            aria-label="Cruip"
                        >
                            <span className="text-3xl font-extrabold tracking-tighter text-brand-dark">Loop</span>
                            <span className="text-3xl font-extrabold text-darker-secondary ml-1">∞</span>
                        </a>
                    </div>

                    {/* Desktop navigation */}
                    <nav className="flex grow">
                        {/* Desktop sign in links */}
                        <ul className="flex grow justify-end flex-wrap items-center">
                            <li>
                                <Link href="/" className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={() => router.push("/admin/auth")}
                                    className="btn-sm text-white bg-darker-secondary hover:bg-secondary ml-3 cursor-pointer shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 rounded-full px-6 py-2"
                                >
                                    Event Manager
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default Header;
