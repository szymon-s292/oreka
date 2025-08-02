  "use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import Link from "next/link";

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  useEffect(() => {
    if (session) {
      router.push("/panel");
    }
  }, [session, router]);

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    setIsLoading(false);

    if (res?.error) {
      toast.error("Błędny e-mail lub hasło");
    } else {
      router.push("/panel");
    }
  };

  const onError = () => {
    if (errors.email) toast.error(errors.email.message);
    else if (errors.password) toast.error(errors.password.message);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-center m-4">
          <Link href={'/'}>
            <Image src={'/oreka-logo.png'} width={150} height={80} alt={'logo'}/>
          </Link>
        </div>
      <div>

   
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
    >
      <h1 className="text-2xl font-bold mb-6 text-center">Zaloguj się</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">E-mail</label>
        <input
          type="email"
          {...register("email", { required: "E-mail jest wymagany" })}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">Hasło</label>
        <input
          type="password"
          {...register("password", { required: "Hasło jest wymagane" })}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />
      </div>

      <div className="text-sm flex justify-end mb-3 hover:underline">
        <button onClick={() => {

        }}>Nie pamiętam hasła</button>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 cursor-pointer"
      >
        {isLoading ? "Logowanie..." : "Zaloguj się"}
      </button>
    </form>
    </div>
    </div>
  );
}
