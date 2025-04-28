import Navbar from "@/components/custom/Navbar";

export default function UserLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
