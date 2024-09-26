"use client";

// 导入useOrganization钩子
import { useOrganization } from "@clerk/nextjs";

// 导入EmptyOrg和BoardList组件
import { EmptyOrg } from "./_components/empty-org";
import { BoardList } from "./_components/board-list";

// 定义DashboardPageProps接口
interface DashboardPageProps {
  searchParams: {
    search: string;
    favorites: string;
  };
}

// 定义DashboardPage组件
const DashboardPage = ({ searchParams }: DashboardPageProps) => {
  // 使用useOrganization钩子获取organization
  const { organization } = useOrganization();

  // 返回组件内容
  return (
    <div className=" flex-1 h-[calc(100%-80px)] p-6">
      {!organization ? (
        // 如果organization不存在，则渲染EmptyOrg组件
        <EmptyOrg />
      ) : (
        // 如果organization存在，则渲染BoardList组件
        <BoardList orgId={organization.id} query={searchParams} />
      )}
    </div>
  );
};

// 导出DashboardPage组件
export default DashboardPage;