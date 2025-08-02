'use client'

import axios from 'axios';
import { ContactForm } from '@/app/types/types';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiRefreshCcw, FiTrash2, FiClipboard } from 'react-icons/fi';

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;
export default function ContactList() {
  const [data, setData] = useState<ContactForm[]>([]);
  const [isLoading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch(`${NEXT_PUBLIC_BASE_URL}/api/contact`)
      .then((res) => res.json())
      .then((data) => {
        setData(data.reverse());
      })
      .catch(() => {
        toast.error("Wystąpił błąd. Spróbuj ponownie poźniej");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${NEXT_PUBLIC_BASE_URL}/api/contact`, {
        data: { id },
      });
      setData((prevData) => prevData.filter((form) => form._id !== id));
      toast.success("Wiadomość usunięta");
    } catch {
      toast.error("Wystąpił błąd. Spróbuj ponownie poźniej");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => toast.success("Skopiowano do schowka!"),
      () => toast.error("Nie udało się skopiować do schowka.")
    );
  };

  return (
    <section className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-4 shadow bg-gray-200">
        <div className="text-2xl font-semibold text-gray-800">
          {data.length} {data.length === 1 ? "wiadomość" : "wiadomości"}
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-300 rounded-lg transition"
        >
          <FiRefreshCcw />
          Odśwież
        </button>
      </div>

      {/* Messages */}
      <div className="grid gap-4 p-8">
        {isLoading ? (
          <div className="text-gray-500 text-sm">Ładowanie...</div>
        ) : (
          data.map((form) => (
            <div
              key={form._id}
              className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex justify-between items-start">
                {/* Left info */}
                <div>
                  <h3 className="font-medium text-lg text-gray-800">
                    {form.firstName} {form.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">{form.email}</p>
                  <p className="text-sm text-gray-500">{form.phone}</p>
                </div>

                {/* Right meta */}
                <div className="text-right flex flex-col items-end gap-2">
                  <span className="text-xs text-gray-400">{form.time}</span>
                  <button
                    onClick={() => handleDelete(form._id)}
                    className="flex items-center gap-1 text-red-500 text-sm hover:underline"
                  >
                    <FiTrash2 size={14} />
                    Usuń
                  </button>
                </div>
              </div>
              {/* Actions */}
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => handleCopy(form.email)}
                  className="flex items-center gap-1 text-blue-500 text-sm hover:underline"
                >
                  <FiClipboard size={14} />
                  Skopiuj email
                </button>
                <button
                  onClick={() => handleCopy(form.phone)}
                  className="flex items-center gap-1 text-blue-500 text-sm hover:underline"
                >
                  <FiClipboard size={14} />
                  Skopiuj telefon
                </button>
              </div>

              {/* Message */}
              <div className="mt-4 text-sm text-gray-700 whitespace-pre-line">
                {form.message}
              </div>

            </div>
          ))
        )}
      </div>
    </section>
  );
}
