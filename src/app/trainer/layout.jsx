export default function TrainerLayout({ children }) {
  return (
    <div>
      <Navbar />

      <main>{children}</main>
    </div>
  );
}
