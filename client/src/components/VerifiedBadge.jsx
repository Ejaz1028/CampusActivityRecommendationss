import { HiCheckCircle } from "react-icons/hi";

const VerifiedBadge = ({ isVerified }) => {
    if (!isVerified) return null;

    return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100 uppercase tracking-wider">
            <HiCheckCircle className="w-3 h-3" />
            Verified
        </span>
    );
};

export default VerifiedBadge;
