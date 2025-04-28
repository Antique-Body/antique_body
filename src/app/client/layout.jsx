import { Navbar } from "@/components/custom";

export default function ClientLayout({ children }) {
    return (
        <div>
            <Navbar />
            <main>{children}</main>
        </div>
    );
}
