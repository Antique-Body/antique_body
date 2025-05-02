import { Navbar } from "@/components";

export default function ClientLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
