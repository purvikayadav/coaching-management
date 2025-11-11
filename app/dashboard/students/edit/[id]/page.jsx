"use client";
import { useParams } from "next/navigation";
import StudentForm from "../../../../components/students/StudentForm";
export default function EditStudentPage() {
  const { id } = useParams();
//   return <StudentForm studentId={id} />;
return <StudentForm studentId={id} />;
}
