import Image from "next/image";

export default function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full items-center justify-center lg:min-h-[600px] xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">{children}</div>
    </div>
  );
}
