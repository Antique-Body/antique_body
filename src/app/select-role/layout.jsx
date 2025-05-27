import { Navbar } from "@/components";

export default function SelectRoleLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b  text-white">
      <Navbar />
      {children}
    </div>
  );
}
