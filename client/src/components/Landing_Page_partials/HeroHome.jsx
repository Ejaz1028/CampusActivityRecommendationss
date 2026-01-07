function HeroHome() {
    return (
        <section className="relative overflow-hidden">
            {/* Background Illustration */}
            <div
                className="absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none -z-1"
                aria-hidden="true"
            >
                <svg
                    width="1360"
                    height="578"
                    viewBox="0 0 1360 578"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient
                            x1="50%"
                            y1="0%"
                            x2="50%"
                            y2="100%"
                            id="illustration-01"
                        >
                            <stop stopColor="#FFF" offset="0%" />
                            <stop stopColor="#EAEAEA" offset="77.402%" />
                            <stop stopColor="#DFDFDF" offset="100%" />
                        </linearGradient>
                    </defs>
                    <g fill="url(#illustration-01)" fillRule="evenodd">
                        <circle cx="1232" cy="128" r="128" />
                        <circle cx="155" cy="443" r="64" />
                    </g>
                </svg>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
                {/* Hero content */}
                <div className="pt-32 pb-12 md:pt-40 md:pb-20">
                    {/* Section header */}
                    <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16 text-center">
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-4" data-aos="zoom-y-out">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-darker-secondary to-secondary">
                                Loop
                            </span>
                        </h1>
                        <p className="mt-4 text-4xl md:text-5xl font-bold text-gray-800 mb-8" data-aos="zoom-y-out" data-aos-delay="150">
                            Event Management
                        </p>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto" data-aos="zoom-y-out" data-aos-delay="300">
                            "Bringing Your Events to Life: Simplified Registration, Seamless Management, and Easy Ticketing."
                        </p>

                        <div
                            className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center"
                            data-aos="zoom-y-out"
                            data-aos-delay="450"
                        >
                            <div>
                                <a
                                    href="/users/signin"
                                    className="btn text-white bg-darker-secondary hover:bg-secondary w-full mb-4 sm:w-auto sm:mb-0 rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                                >
                                    Signin
                                </a>
                            </div>
                            <div>
                                <a
                                    className="btn text-white bg-brand-dark hover:bg-brand-muted w-full sm:w-auto sm:ml-4 rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                                    href="/users/signup"
                                >
                                    Signup
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroHome;
