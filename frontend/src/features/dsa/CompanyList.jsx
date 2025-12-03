import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import googleLogo from "../../assets/googleLogo.png";
import amazonLogo from "../../assets/amazonLogo.png";
import infosysLogo from "../../assets/infosysLogo.png";
import tcsLogo from "../../assets/tcsLogo.png";

const COMPANIES = [
    { name: "Google", logo: googleLogo, path: "google" },
    { name: "Amazon", logo: amazonLogo, path: "amazon" },
    { name: "Infosys", logo: infosysLogo, path: "infosys" },
    { name: "TCS", logo: tcsLogo, path: "tcs" }
];

export default function CompanyList() {
    const navigate = useNavigate();

    return (
        <>
            <Header />
            <div
                className="flex flex-col justify-center items-center bg-black text-white relative overflow-hidden"
                style={{ minHeight: "calc(100vh - 96px)" }}
            >
                <h2 className="text-3xl font-bold mt-6 mb-10 text-center text-orange-400">Top Companies</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-3xl">
                    {COMPANIES.map(c => (
                        <button
                            key={c.name}
                            onClick={() => navigate(`/dsa/company/${c.path}`)}
                            className="bg-gray-900 border border-gray-700 rounded-lg flex flex-col items-center justify-center gap-4 py-8 hover:bg-orange-900/20 shadow-lg group transition"
                        >
                            <img src={c.logo} alt={c.name} className="h-14 w-14 object-contain mb-2" />
                            <span className="text-xl font-semibold group-hover:text-orange-400 transition">{c.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}
