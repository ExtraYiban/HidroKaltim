import { DesktopSidebar } from "@/app/components/navigation/desktop-sidebar";
import { MobileNavigation } from "@/app/components/navigation/mobile-navigation";

type PublicShellProps = {
  children: React.ReactNode;
};

export function PublicShell({ children }: PublicShellProps) {
  return (
    <div className="min-h-screen">
      <div className="hidden min-h-screen md:flex">
        <DesktopSidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>

      <div className="md:hidden">
        <MobileNavigation />
        <main className="px-4 pb-24 pt-4">{children}</main>
      </div>
    </div>
  );
}
