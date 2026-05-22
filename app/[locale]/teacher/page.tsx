import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/** /[locale]/teacher — redirect to new teacher dashboard */
export default async function TeacherRedirect({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/teacher/dashboard`);
}
