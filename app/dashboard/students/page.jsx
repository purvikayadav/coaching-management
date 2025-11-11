"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES_PATH } from "../../../lib/constants/routePaths";
import { db, auth } from "@/app/firebaseConfig";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function StudentsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [students, setStudents] = useState([]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteStudentId, setDeleteStudentId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const classOptions = [
    "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6",
    "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12",
  ];

  // Fetch students for the logged-in user
  useEffect(() => {
    if (!auth.currentUser) {
      router.push("/login");
      return;
    }

    const studentsRef = collection(db, "students");
    const q = query(studentsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((student) => student.userId === auth.currentUser.uid); // Only current user
      setStudents(data);
    });

    return () => unsubscribe();
  }, [router]);

  const handleAddNew = () => router.push(ROUTES_PATH.ADD_STUDENT);
  const handleEdit = (id) => router.push(`${ROUTES_PATH.EDIT_STUDENT}/${id}`);
  const confirmDelete = (id) => {
    setDeleteStudentId(id);
    setDeleteModalOpen(true);
  };
  const handleDelete = async () => {
    if (!deleteStudentId) return;
    try {
      await deleteDoc(doc(db, "students", deleteStudentId));
      setDeleteModalOpen(false);
      setDeleteStudentId(null);
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchesName = student.name.toLowerCase().includes(search.toLowerCase());
    const matchesClass = classFilter ? student.class === classFilter : true;
    return matchesName && matchesClass;
  });

  // Pagination calculations
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredStudents.length / recordsPerPage);

  return (
    <main className="min-h-screen flex flex-col bg-gray-100 p-6">
      <h1 className="text-3xl font-semibold text-blue-600 mb-4">Students</h1>

      {/* Filters & Add */}
      <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search students..."
          className="border border-gray-300 rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
        />
        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
        >
          <option value="">All Classes</option>
          {classOptions.map((cls) => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          + Add New
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fees</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentStudents.length > 0 ? (
              currentStudents.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.class}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.session}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.fees}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.contact}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex gap-2">
                    <button onClick={() => handleEdit(student.id)} className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500 transition cursor-pointer">Edit</button>
                    <button onClick={() => confirmDelete(student.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition cursor-pointer">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">No students found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className={`px-4 py-2 rounded-lg font-medium transition ${currentPage === 1 ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg font-medium transition ${currentPage === i + 1 ? "bg-blue-700 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className={`px-4 py-2 rounded-lg font-medium transition ${currentPage === totalPages ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4 text-black">Confirm Delete</h2>
            <p className="mb-4 text-gray-700">Are you sure you want to delete this student?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 rounded bg-blue-200 hover:bg-blue-300 text-black cursor-pointer">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
