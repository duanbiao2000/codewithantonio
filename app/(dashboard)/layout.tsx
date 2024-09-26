// 导入导航栏组件
import { Navbar } from "./_components/navbar";
// 导入组织侧边栏组件
import { OrgSidebar } from "./_components/org-sidebar";
// 导入侧边栏组件
import { Sidebar } from "./_components/sidebar";

// 定义DashboardLayoutProps接口，包含children属性
interface DashboardLayoutProps {
  children: React.ReactNode;
}

// 定义DashboardLayout组件，接收DashboardLayoutProps类型的props
const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  // 返回一个main元素，包含侧边栏和内容区域
  return (
    <main className="h-full">
      <Sidebar />
      <div className="pl-[60px] h-full">
        <div className="flex gap-x-3 h-full">
          <OrgSidebar/>
          <div className="h-full flex-1">
            <Navbar/>
            {children}</div>
        </div>
      </div>
    </main>
  );
};

// 导出DashboardLayout组件
export default DashboardLayout;