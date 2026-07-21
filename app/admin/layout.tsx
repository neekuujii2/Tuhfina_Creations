import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session) {
        redirect("/login?redirect=/admin");
    }

    if (session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    return <AdminLayoutClient>{children}</AdminLayoutClient>;
}