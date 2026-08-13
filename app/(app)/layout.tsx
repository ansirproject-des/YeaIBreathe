export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen flex flex-col items-center overflow-hidden">
      {children}
    </div>
  );
}