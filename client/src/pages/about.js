import Head from 'next/head';
import Link from 'next/link';
import Header from "@/components/Landing_Page_partials/Header";
import Footer from "@/components/Landing_Page_partials/Footer";

export default function About() {
    return (
        <div className="flex flex-col min-h-screen overflow-hidden">
            <Head>
                <title>About Us - Loop</title>
            </Head>

            <Header />

            <main className="grow pt-24">
                {/* Page illustration */}
                <div className="relative max-w-6xl mx-auto h-0 pointer-events-none -z-1" aria-hidden="true">
                    <svg className="absolute top-0 right-0 transform translate-x-1/2 -mr-16 dark:opacity-40" width="800" height="502" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="400" cy="102" r="400" fill="url(#heroglow_paint0_radial)" fillOpacity=".6" />
                        <circle cx="209" cy="289" r="170" fill="url(#heroglow_paint1_radial)" fillOpacity=".4" />
                        <defs>
                            <radialGradient id="heroglow_paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="rotate(90 149 251) scale(315.089)">
                                <stop stopColor="#3B82F6" />
                                <stop offset="1" stopColor="#3B82F6" stopOpacity=".01" />
                            </radialGradient>
                            <radialGradient id="heroglow_paint1_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="rotate(90 -40 249) scale(133.913)">
                                <stop stopColor="#667EEA" />
                                <stop offset="1" stopColor="#667EEA" stopOpacity=".01" />
                            </radialGradient>
                        </defs>
                    </svg>
                </div>

                <section className="relative">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
                            <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
                                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-4">
                                    About <span className="bg-clip-text text-transparent bg-gradient-to-r from-darker-secondary to-secondary">Loop</span>
                                </h1>
                                <p className="text-xl text-gray-600">
                                    We are dedicated to simplifying event management for everyone. From small gatherings to large conferences, Loop keeps you in the loop.
                                </p>
                            </div>

                            {/* Story */}
                            <div className="max-w-3xl mx-auto">
                                <h3 className="h3 mb-3 text-3xl font-bold leading-tight text-gray-800">Our Story</h3>
                                <p className="text-lg text-gray-600 mb-8">
                                    Started in 2026, Loop was born out of frustration with complex, expensive event platforms. We believed there had to be a better way to bring people together.
                                </p>

                                <h3 className="h3 mb-3 text-3xl font-bold leading-tight text-gray-800">Our Mission</h3>
                                <p className="text-lg text-gray-600 mb-8">
                                    To provide a seamless, intuitive, and powerful platform that empowers organizers to create memorable experiences without the technical headache.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
