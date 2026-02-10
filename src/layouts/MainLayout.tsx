import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { Toaster } from "sonner";

const MainLayout = () => {
  return (
    <>
      <SidebarProvider open={false}>
        <AppSidebar />
        <main className="min-h-screen container mx-auto flex flex-col gap-12 mb-12">
          <Outlet />
        </main>
        {/* Toast con messaggio dopo un' azione */}
        <Toaster theme="dark" closeButton={true}  />
      </SidebarProvider>
    </>
  );
};

export default MainLayout;
