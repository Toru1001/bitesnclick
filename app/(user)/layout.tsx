import PageHeader from "@/app/components/header/pageHeader";
import Chatbot from "@/app/components/chatbot/chatbot";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <PageHeader />
      <Chatbot />
      <main>{children}</main>
    </div>
  );
}
