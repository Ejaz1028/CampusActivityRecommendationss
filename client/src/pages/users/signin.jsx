import { setUserToken } from "@/utils/setUserToken";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import Cookies from "universal-cookie";

export async function getServerSideProps(context) {
    const cookies = new Cookies(context.req.headers.cookie);
    const userId = cookies.get("user_token");
    if (!userId) {
        return {
            props: { userIdCookie: null },
        };
    }
    return {
        props: { userIdCookie: userId },
    };
}

export default function signin({ userIdCookie }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState({ errorMsg: "", successMsg: "" });
    const router = useRouter();

    useEffect(() => {
        // If cookie found, Redirect to dashboard
        if (userIdCookie) {
            setStep(2); // Skip login steps

            setTimeout(() => {
                // Set success message
                setMessage({
                    errorMsg: "",
                    successMsg: "Redirecting you ...",
                });
            }, 500);

            // Redirect to dashboard
            setTimeout(() => {
                router.push("/users/dashboard");
            }, 800);
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/signin`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            }
        );
        const data = await response.json();
        if (response.status === 200) {
            setMessage({ errorMsg: "", successMsg: data.msg });
            setStep(2);
            setUserToken(data.user_id);
        } else {
            console.error(`Failed with status code ${response.status}`);
            setMessage({ errorMsg: data.msg, successMsg: "" });

            if (data.msg && data.msg.includes("not registered")) {
                setTimeout(() => {
                    setMessage({
                        errorMsg: "Redirecting you to SignUp ...",
                        successMsg: "",
                    });
                }, 1700);

                setTimeout(() => {
                    router.push("/users/signup");
                }, 2500);
            }
        }
    };

    return (
        <div className="m-2">
            {/* back button */}
            <FiArrowLeft
                onClick={() => router.push("/")}
                size={24}
                className="cursor-pointer"
            />
            {/* Page heading */}
            <div className="text-center text-3xl font-bold">Signin Page</div>

            {/* Page Content */}
            <div className="max-w-3xl mx-auto mt-10">
                {/* Steps Nav */}
                <div className="flex items-center justify-center">
                    <div
                        className={`w-full h-24 lg:h-fit ${step === 1 ? `font-medium` : ``
                            }`}
                    >
                        <div
                            className={`h-full border-2 rounded-l-lg px-5 py-2 ${step >= 1
                                    ? `text-white bg-[color:var(--darker-secondary-color)] border-r-white border-[color:var(--darker-secondary-color)]`
                                    : `border-[color:var(--darker-secondary-color)] border-dashed`
                                }`}
                        >
                            <div>01</div>
                            Login with Credentials
                        </div>
                    </div>

                    <div
                        className={`w-full h-24 lg:h-fit ${step === 2 ? `font-medium` : ``
                            }`}
                    >
                        <div
                            className={`h-full border-2 border-l-0 rounded-r-lg px-5 py-2 ${step >= 2
                                    ? `text-white bg-[color:var(--darker-secondary-color)] border-[color:var(--darker-secondary-color)]`
                                    : `border-[color:var(--darker-secondary-color)] border-dashed`
                                }`}
                        >
                            <div>02</div>
                            Go to Dashboard!
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {message.errorMsg && (
                    <h1 className="rounded p-3 my-2 bg-red-200 text-red-600 font-medium">
                        {message.errorMsg}
                    </h1>
                )}

                {/* Success Message */}
                {message.successMsg && (
                    <h1 className="rounded p-3 my-2 bg-green-200 text-green-600 font-medium">
                        {message.successMsg}
                    </h1>
                )}

                {/* Steps Content */}
                <div className="bg-white p-5 rounded-lg mt-2">
                    {
                        step === 1 && (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4 text-left">
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Email address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={email}
                                        required
                                        className="bg-gray-100 p-2 focus:outline-none rounded-lg w-full"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="mb-4 text-left">
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={password}
                                        required
                                        className="bg-gray-100 p-2 focus:outline-none rounded-lg w-full"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="mt-4 bg-[color:var(--darker-secondary-color)] text-white py-2 px-4 rounded hover:bg-[color:var(--secondary-color)] w-full"
                                >
                                    Sign In
                                </button>

                                <div className="mt-4 text-center">
                                    <p className="text-sm text-gray-600">
                                        Don't have an account?{" "}
                                        <span
                                            className="text-blue-600 cursor-pointer font-medium hover:underline"
                                            onClick={() => router.push("/users/signup")}
                                        >
                                            Sign Up
                                        </span>
                                    </p>
                                </div>
                            </form>
                        )
                    }
                    {
                        step === 2 && (
                            <div>
                                <div className="bg-green-50 border-b border-green-400 text-green-800 text-sm p-4 flex justify-between">
                                    <div>
                                        <div className="flex items-center">
                                            <p>
                                                <span className="font-bold">
                                                    Hey there!{" "}
                                                </span>
                                                Welcome back, you're
                                                successfully signed in!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() =>
                                        router.push("/users/dashboard")
                                    }
                                    className="mt-4 bg-[color:var(--darker-secondary-color)] text-white py-2 px-4 rounded hover:bg-[color:var(--secondary-color)] transition ease-in-out w-full"
                                >
                                    Go to your dashboard
                                </button>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}
