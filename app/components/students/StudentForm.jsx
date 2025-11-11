"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/app/firebaseConfig";
import { addDoc, collection, serverTimestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { ArrowLeft } from "lucide-react";

export default function StudentForm({ studentId }) {
  const router = useRouter();
  const isEdit = !!studentId;

  const [student, setStudent] = useState({
    name: "",
    class: "",
    session: "",
    fees: "",
    contact: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);

  const classOptions = [
    "Class 1","Class 2","Class 3","Class 4","Class 5","Class 6",
    "Class 7","Class 8","Class 9","Class 10","Class 11","Class 12",
  ];

  const sessionOptions = [
    "2020-2021","2021-2022","2022-2023","2023-2024","2024-2025","2025-2026",
  ];

  // Fetch student data for editing
  useEffect(() => {
    if (!isEdit) return;
    const fetchStudent = async () => {
      try {
        const docRef = doc(db, "students", studentId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStudent(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching student:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchStudent();
  }, [studentId, isEdit]);

  const handleChange = (e) => {
    setStudent(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    NProgress.start();

    try {
      if (isEdit) {
        await updateDoc(doc(db, "students", studentId), student);
      } else {
        await addDoc(collection(db, "students"), {
          ...student,
          fees: parseFloat(student.fees),
          createdAt: serverTimestamp(),
        });
      }
      router.push("/dashboard/students");
    } catch (error) {
      console.error("Error saving student:", error);
    } finally {
      setLoading(false);
      NProgress.done();
    }
  };

  if (initialLoading) return <div>Loading...</div>;

  return (
    <main className="min-h-screen flex flex-col bg-gray-100 p-6">
      {/* Back Arrow + Title */}
      <div
        className="flex items-center gap-2 mb-6 cursor-pointer"
        onClick={() => router.push("/dashboard/students")}
      >
        <ArrowLeft className="w-5 h-5 text-blue-600" />
        <h1 className="text-3xl font-semibold text-blue-600">{isEdit ? "Edit Student" : "Add New Student"}</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md max-w-md w-full mx-auto flex flex-col gap-4"
      >
        {/* Name */}
        <label className="text-gray-700 font-medium">Student Name</label>
        <input
          type="text"
          name="name"
          value={student.name}
          onChange={handleChange}
          placeholder="Enter student name"
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
        />

        {/* Class */}
        <label className="text-gray-700 font-medium">Class</label>
        <select
          name="class"
          value={student.class}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
        >
          <option value="">Select class</option>
          {classOptions.map(cls => <option key={cls} value={cls}>{cls}</option>)}
        </select>

        {/* Session */}
        <label className="text-gray-700 font-medium">Session / Year</label>
        <select
          name="session"
          value={student.session}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
        >
          <option value="">Select session</option>
          {sessionOptions.map(sess => <option key={sess} value={sess}>{sess}</option>)}
        </select>

        {/* Fees */}
        <label className="text-gray-700 font-medium">Fees</label>
        <input
          type="number"
          name="fees"
          value={student.fees}
          onChange={handleChange}
          placeholder="Enter fees"
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
        />

        {/* Contact */}
        <label className="text-gray-700 font-medium">Contact Number</label>
        <input
          type="text"
          name="contact"
          value={student.contact}
          onChange={handleChange}
          placeholder="Enter contact number"
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
        />

        {/* Address */}
        <label className="text-gray-700 font-medium">Address</label>
        <textarea
          name="address"
          value={student.address}
          onChange={handleChange}
          placeholder="Enter address"
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-black"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mt-2 cursor-pointer flex justify-center items-center"
        >
          {loading ? (isEdit ? "Updating..." : "Saving...") : (isEdit ? "Update Student" : "Add Student")}
        </button>
      </form>
    </main>
  );
}
