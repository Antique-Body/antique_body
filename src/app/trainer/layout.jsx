import { Navbar } from "@/components/custom";

export default function TrainerLayout({ children }) {
  return (
    <div>
      <Navbar />

      <main>{children}</main>
    </div>
  );
}
