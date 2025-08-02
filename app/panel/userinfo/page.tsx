'use client'

import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;

type FormData = {
    name: string;
    email: string;
    password?: string;
  };
  

export default function UsersList() {
    const { register, handleSubmit, setValue } = useForm<FormData>();
    const { data: session, update } = useSession();
    const [isFormSending, setIsFormSending] = useState(false);
    
    useEffect(() => {
        if (session?.user) {
            setValue("name", session.user.name || "");
            setValue("email", session.user.email || "");
        }
    }, [session, setValue]);

    const handleUsername = async (newName: string) => {
        axios.put(`${NEXT_PUBLIC_BASE_URL}/api/user/${session?.user._id}/name`, { name: newName})
        .then(() => {
            setValue("name", newName)
            toast.success("Nazwa użytkownika zmieniona")
            axios.get("/api/auth/session?update");
            update({user: {...session?.user, name: newName}})
        })
        .catch(() => {
            toast.error("Wystąpił błąd. Spróbuj ponownie poźniej");
        })
    };

    const handleEmail = async (newEmail: string) => {
        axios.put(`${NEXT_PUBLIC_BASE_URL}/api/user/${session?.user._id}/email`, {email: newEmail})
        .then(() => {
            setValue("email", newEmail)
            toast.success("E-mail został zmieniony")
            axios.get("/api/auth/session?update");
            update({user: {...session?.user, name: newEmail}})
        })
        .catch(() => {
            toast.error("Wystąpił błąd. Spróbuj ponownie poźniej");
        })
    };

    const handlePassword = async (password: string) => {
        axios.put(`${NEXT_PUBLIC_BASE_URL}/api/user/${session?.user._id}/password`, {password: password})
        .then(() => {
            setValue("password", '')
            toast.success("Hasło zostało zmienione")
        })
        .catch(() => {
            toast.error("Wystąpił błąd. Spróbuj ponownie poźniej");
        })
    };

    const onSubmit = async (data: FormData) => {
        if (!session?.user) return;
      
        setIsFormSending(true);
      
        const promises = [];
      
        if (data.name !== session.user.name) {
          promises.push(handleUsername(data.name));
        }
      
        if (data.email !== session.user.email) {
          promises.push(handleEmail(data.email));
        }
      
        if (data.password && data.password.trim() !== "") {
          promises.push(handlePassword(data.password));
        }
      
        await Promise.all(promises);
      
        setIsFormSending(false);
      };
      
    return (
        <section className="bg-white m-8 w-80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-6">
                <div className="text-2xl font-semibold text-gray-800">Twoje informacje</div>
            </div>
            <main className="flex flex-col max-w-xs">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Zmień nazwę użytkownika</label>
                        <input
                            type="text"
                            {...register("name")}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Zmień E-mail</label>
                        <input
                            type="email"
                            {...register("email")}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Zmień hasło</label>
                        <input
                            type="password"
                            {...register("password")}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isFormSending}
                            className="bg-blue-400 text-white py-2 px-4 rounded-md"
                            >
                            {isFormSending ? "Wysyłanie..." : "Zapisz zmiany"}
                        </button>
                    </div>
                </form>
            </main>
        </section>
    );
}
