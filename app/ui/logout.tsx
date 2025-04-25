'use client'
import { toast } from "react-toastify";
import { signOut } from "next-auth/react";
import { FiLogOut } from "react-icons/fi";

export default function Logout() {
     const handleLogout = async () => {
        toast.success("Pomyślnie wylogowano")
        await signOut({ callbackUrl: '/' });
    };

    return (
        <button onClick={handleLogout} className="w-full cursor-pointer flex items-center justify-start px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-red-400 text-sm font-medium transition">
            <FiLogOut size={18} className="mr-2" /> Wyloguj
        </button>
    )
}