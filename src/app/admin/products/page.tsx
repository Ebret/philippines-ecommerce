import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminProductsClient from "./products-client";

export const metadata = {
  title: "Product Management | Admin Dashboard",
  description: "Manage products, prices, images, and inventory",
};

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  const user = session.user as any;
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    redirect("/auth/unauthorized");
  }

  return <AdminProductsClient />;
}

