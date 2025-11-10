"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db, storage } from "../../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { ROUTES_PATH } from "../../../lib/constants/routePaths";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // ✅ Fetch current user and Firestore data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setName(userData.name || "");
          setPhotoURL(userData.photoURL || "");
        } else {
          // Create user doc if not exists
          await setDoc(userRef, {
            email: currentUser.email,
            name: "",
            photoURL: "",
            createdAt: new Date().toISOString(),
          });
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Upload Profile Image to Firebase Storage
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    NProgress.start();
    setUploading(true);
    try {
      const storageRef = ref(storage, `profileImages/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { photoURL: downloadURL }, { merge: true });
      setPhotoURL(downloadURL);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
      NProgress.done();
    }
  };

  // ✅ Save updated name to Firestore
  const handleSaveName = async () => {
    if (!user) return;

    NProgress.start();
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { name }, { merge: true });

      // Simulate progress and redirect
      setTimeout(() => {
        NProgress.done();
        router.push(ROUTES_PATH.DASHBOARD);
      }, 500);
    } catch (error) {
      console.error("Error updating name:", error);
      NProgress.done();
    }
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">You must be logged in to view this page.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-semibold text-blue-600 mb-6">Profile</h1>

        {/* Profile Image */}
        <div className="relative flex justify-center mb-6">
          {photoURL ? (
            <img
              src={photoURL}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-2 border-blue-400"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
              No Image
            </div>
          )}

          {/* Upload Button */}
          <label className="absolute bottom-0 right-[40%] bg-blue-500 text-white text-xs px-3 py-1 rounded-full cursor-pointer hover:bg-blue-600 transition">
            {uploading ? "Uploading..." : "Change"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {/* Email Display */}
        <p className="text-gray-600 text-sm mb-4">{user.email}</p>

        {/* Editable Name Field */}
        <input
          type="text"
          value={name}
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
        />

        <button
          onClick={handleSaveName}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full cursor-pointer"
        >
          Save Changes
        </button>
      </div>
    </main>
  );
}
