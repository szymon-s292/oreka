'use client';
import axios from "axios";
import { useState } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

type FormData = {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  email?: string;
  message: string;
  consent: boolean;
};

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;

const formatDate = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${hours}:${minutes} ${day}.${month}.${year}`;
};

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    setLoading(true);

    if (!data.phoneNumber && !data.email) {
      toast.error("Musisz podać numer telefonu lub adres e-mail");
      setLoading(false);
      return;
    }

    const currentDate = new Date();
    axios.post(`${NEXT_PUBLIC_BASE_URL}/api/contact`, {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phoneNumber, 
      email: data.email,
      message: data.message,
      time: formatDate(currentDate)
    }).then(res => {
      if(res.status == 200)
        toast.success("Wiadomość wysłana pomyślnie!")
      else
        toast.error("Spróbuj ponownie później")
    }).catch(err => {
      console.log(err)
      toast.error("Spróbuj ponownie później")
    })
    setLoading(false);
  };

  const onError = (error: FieldErrors<FormData>) => {
    for (const key of Object.keys(error) as Array<keyof FormData>) {
      const errorMessage = error[key]?.message;
      if (errorMessage) {
        toast.error(errorMessage);
        return;
      }
    }
  };

  return (
    <div className="max-w-lg w-full p-6 bg-white lg:rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Formularz kontaktowy</h2>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Imię</label>
          <input
            type="text"
            {...register("firstName", { required: "Imię jest wymagane" })}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nazwisko</label>
          <input
            type="text"
            {...register("lastName", { required: "Nazwisko jest wymagane" })}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Numer telefonu</label>
          <input
            type="text"
            {...register("phoneNumber")}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Adres e-mail</label>
          <input
            type="email"
            {...register("email")}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Wiadomość</label>
          <textarea
            {...register("message", { required: "Wiadomość nie może być pusta" })}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register("consent", { required: "Zaznaczenie zgody jest wymagane do wysłania wiadomości" })}
              className="mr-2 cursor-pointer"
            />
            <p className="text-xs">
            Akceptuję zgodę na przetwarzanie danych osobowych
            </p>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer w-full pointer py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Wysyłanie..." : "Wyślij"}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
