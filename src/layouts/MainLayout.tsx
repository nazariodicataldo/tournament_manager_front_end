import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <>
      <SidebarProvider open={false}>
        <AppSidebar />
        <main className="min-h-screen container mx-auto flex flex-col gap-12 mb-12">
          <Outlet />
        </main>
      </SidebarProvider>
    </>
  );
};

export default MainLayout;
