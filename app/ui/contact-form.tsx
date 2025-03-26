'use client';

import { useState } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Type for form data
type FormData = {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  email?: string;
  message: string;
  consent: boolean;
};

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    setLoading(true);

    if (!data.phoneNumber && !data.email) {
      toast.error("Musisz podać numer telefonu lub adres e-mail");
      setLoading(false);
      return;
    }

    if (!data.consent) {
      toast.error("Musisz wyrazić zgodę na przetwarzanie danych osobowych");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setLoading(false);
      toast.success("Wiadomość wysłana pomyślnie!");
    }, 2000);
  };

  const onError = (error: FieldErrors<FormData>) => {
    // Use Object.keys to iterate over keys, which are guaranteed to be keys of `FormData`
    for (const key of Object.keys(error) as Array<keyof FormData>) {
      const errorMessage = error[key]?.message;
      if (errorMessage) {
        toast.error(errorMessage);
        return;
      }
    }
  };
  

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Formularz kontaktowy</h2>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Imię</label>
          <input
            type="text"
            {...register("firstName", { required: "Imię jest wymagane" })}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
          {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nazwisko</label>
          <input
            type="text"
            {...register("lastName", { required: "Nazwisko jest wymagane" })}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
          {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Numer telefonu</label>
          <input
            type="text"
            {...register("phoneNumber")}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
          {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Adres e-mail</label>
          <input
            type="email"
            {...register("email")}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Wiadomość</label>
          <textarea
            {...register("message", { required: "Wiadomość nie może być pusta" })}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          ></textarea>
          {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register("consent")}
              className="mr-2"
            />
            Akceptuję zgodę na przetwarzanie danych osobowych
          </label>
          {errors.consent && <p className="text-red-500 text-sm">{errors.consent.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Wysyłanie..." : "Wyślij"}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
