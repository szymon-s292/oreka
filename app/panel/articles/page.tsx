'use client'

import { Article } from "@/app/types/types"
import { FiEdit2, FiPlus, FiRefreshCcw, FiTrash2 } from "react-icons/fi";
import axios from 'axios'
import { useState, useEffect } from "react";
import { toast } from 'react-toastify';

import { useSession } from "next-auth/react";

export default function Page() {
  const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;
  
  const [data, setData] = useState<Article[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [showDelModal, setShowDelModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [id, setId] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const session = useSession()

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    axios.get(`${NEXT_PUBLIC_BASE_URL}/api/articles`)
    .then(res => res.data)
    .then(data => setData(data))
    .catch(() => {
      toast.error("Wystąpił błąd. Spróbuj ponownie poźniej");
    }).finally(() => {
      setLoading(false);
    });
  }

  const validateForm = (): boolean => {
    if (!title) {
      toast.error("Proszę tytuł artykułu");
      return false;
    }

    if (!content) {
      toast.error("Proszę podać treść artykułu");
      return false;
    }

    return true;
  };


  const handleAdd = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    axios.post(`${NEXT_PUBLIC_BASE_URL}/api/articles`, formData)
    .then(res => {
      toast.success("Nowy artykuł dodany");
      setData([...data, { _id: res.data._id, title: title, content: content, author: session.data?.user.name as string }]);
    }).catch(() => {
      toast.error("Wystąpił błąd. Spróbuj ponownie poźniej");
    });

    cleanup();
  }

  const handleEdit = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    axios.put(`${NEXT_PUBLIC_BASE_URL}/api/article/${id}`, formData)
    .then(res => {
      toast.success("Zmiany w artykule zapisane");
      setData(prevData =>
        prevData.map(article =>
          article._id === id ? { ...article, title: title, content: content } : article
        )
      );
    }).catch(() => {
      toast.error("Wystąpił błąd. Spróbuj ponownie poźniej");
    });

    cleanup();
  }

  const handleDelete = async () => {
    axios.delete(`${NEXT_PUBLIC_BASE_URL}/api/article/${id}`)
    .then(res => {
      toast.success("Artykuł usunięty");
      setData((prevData) => prevData.filter((article) => article._id !== id));
    }).catch(() => {
      toast.error("Wystąpił błąd. Spróbuj ponownie poźniej");
    });

    cleanup();
  }

  const cleanup = () => {
    setId("")
    setShowEditModal(false)
    setShowDelModal(false)
    setEditMode(false)
    setTitle('')
    setContent('')
  }

  return (
    <>
    {showDelModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-[#00000036] z-50">
          <div className="bg-white p-6 rounded-lg min-w-96 w-fit">
            <div className="mb-4">Czy usunąć artykuł?</div>
            <div className="flex gap-4">
              <button className="px-4 py-2 mt-4 bg-gray-300 text-gray rounded cursor-pointer" onClick={() => {
                cleanup()}}>Nie</button>
              <button className="px-4 py-2 mt-4 bg-blue-500 text-white rounded cursor-pointer" onClick={() => {
                setShowDelModal(false);
                handleDelete()
              }}>Tak</button>
            </div>
          </div>
        </div>
      )}

    {showEditModal && (
      <div className="fixed inset-0 flex justify-center items-center bg-[#00000036] z-50">
        <div className="bg-white p-6 rounded-lg min-w-96 w-fit">
          <div className="text-gray-700 text-2xl mb-4">Kreator artykułu</div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Tytuł artykułu</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Treść artykułu</label>
              <textarea rows={10} value={content} onChange={(e) => setContent(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="flex gap-4">
              <button className="px-4 py-2 mt-4 bg-gray-300 text-gray rounded cursor-pointer" onClick={() => {
                cleanup();
              }}>Anuluj</button>
              <button className="px-4 py-2 mt-4 bg-blue-500 text-white rounded cursor-pointer" onClick={() => {
                if(editMode) {
                  handleEdit()
                } else {
                  handleAdd();
                }
              }}>Zapisz</button>
            </div>
          </div>
        </div>
    )}

    <div className="flex items-center justify-between px-8 py-4 shadow bg-gray-200">
      <div className="text-2xl font-semibold text-gray-800">
        Artykuły
      </div>

      <div className="flex gap-4">
        <button className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer p-2 border bg-gray-100 hover:bg-gray-200 border-gray-300 rounded-md outline-none transition duration-300" onClick={() => {
          setShowEditModal(true)
          setEditMode(false)
        }}>
        <FiPlus size={20} />Dodaj</button>
        <button onClick={load} className="flex items-center gap-2 text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-300 rounded-lg transition">
          <FiRefreshCcw />Odśwież
        </button>
      </div>
    </div>

    {data.map((a, i) => {
      return (
        <div key={i} className="mt-16 pb-8 border-b border-gray-400 mx-8">
          <div className="flex justify-between">
            <p className="text-4xl mb-4 font-bold text-black">{a.title}</p>
            <div className="flex items-end flex-col">
              <p>Autor: {a.author}</p>
              <div className="flex gap-4">
                <button onClick={() => {
                  setShowEditModal(true)
                  setId(a._id)
                  setEditMode(true)
                  setTitle(a.title)
                  setContent(a.content)
                }} className="flex items-center gap-1 text-sm hover:underline">
                <FiEdit2 size={14} />Edytuj
                </button>
                <button onClick={() => {
                  setShowDelModal(true)
                  setId(a._id)
                }} className="flex items-center gap-1 text-red-500 text-sm hover:underline">
                <FiTrash2 size={14} />Usuń
                </button>
              </div>
            </div>
          </div>
          <p>{a.content}</p>
        </div>
        )
      })}
    </>
  )
}