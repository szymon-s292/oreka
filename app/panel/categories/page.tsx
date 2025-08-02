'use client'

import { ProjectCategory } from "@/app/types/types"
import axios from 'axios'
import { useState, useEffect, useRef } from "react";
import { toast } from 'react-toastify';
import Image from "next/image";
import { FiRefreshCcw, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { FiPlus } from 'react-icons/fi';

export default function CategoriesList() {
  const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;
  const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL as string

  const [data, setData] = useState<ProjectCategory[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setLoading] = useState(true);

  const [showDelModal, setShowDelModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [id, setId] = useState<string>('');
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [categoryNameConfirm, setCategoryNameConfirm] = useState<string>('');

  const load = () => {
    setLoading(true);
    axios.get(`${NEXT_PUBLIC_BASE_URL}/api/categories`)
      .then(res => res.data)
      .then(data => setData(data))
      .catch(() => {
        toast.error("Wystąpił błąd. Spróbuj ponownie poźniej");
      }).finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = async (id: string) => {
    axios.delete(`${NEXT_PUBLIC_BASE_URL}/api/categories/${id}`)
      .then(() => {
        setData((prevData) => prevData.filter((category) => category._id !== id));
        toast.success("Kategoria usunięta");
      })
      .catch(() => {
        toast.error("Wystąpił błąd. Spróbuj ponownie poźniej");
      });
  };

  const validateForm = (): boolean => {
    if (!categoryName) {
      toast.error("Proszę podać nazwę kategorii");
      return false;
    }

    if (!categoryImage) {
      toast.error("Proszę podać zdjęcie kategorii");
      return false;
    }

    return true;
  };

  const cleanup = () => {
    setShowEditModal(false);
    setCategoryName('');
    setCategoryImage(null);
    setImagePreview('');
    setId('');
  };

  const handleEdit = async (id: string) => {
    if (!categoryImage && !categoryName) {
      toast.error("Brak zmian w kategorii");
      return;
    }

    const formData = new FormData();
    if (categoryName)
      formData.append('name', categoryName);
    if (categoryImage)
      formData.append('image', categoryImage);

    axios.put(`${NEXT_PUBLIC_BASE_URL}/api/categories/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }).then(res => {
      toast.success("Kategoria zapisana");

      setData(prevData =>
        prevData.map(category =>
          category._id === res.data.id
            ? { ...category, name: res.data.updatedName, photoURL: res.data.updatedURL }
            : category
        )
      );
      load();
    }).catch(() => {
      toast.error("Wystąpił błąd. Spróbuj ponownie poźniej");
    });

    cleanup();
  };

  const handleAdd = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('name', categoryName);
    formData.append('image', categoryImage ? categoryImage : '');

    axios.post(`${NEXT_PUBLIC_BASE_URL}/api/categories`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }).then(res => {
      toast.success("Nowa kategoria dodana");
      setData([...data, { _id: res.data._id, name: categoryName, photoURL: res.data.imageURI }]);
    }).catch(() => {
      toast.error("Wystąpił błąd. Spróbuj ponownie poźniej");
    });

    cleanup();
  };

  useEffect(() => {
    load();
  }, []);
  
  return (
    <>
      {/* Modal for Deleting */}
      {showDelModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-[#00000036] z-50">
          <div className="bg-white p-6 rounded-lg min-w-96 w-fit">
            <div className="mb-4">Czy usunąć kategorię {categoryNameConfirm}?</div>
            <p className="text-sm">Będzie się to wiązało z usunięciem wszystkich projektów w tej kategorii</p>
            <div className="flex gap-4">
              <button className="px-4 py-2 mt-4 bg-gray-300 text-gray rounded cursor-pointer" onClick={() => {
                setShowDelModal(false);
                setCategoryNameConfirm('');
              }}>Nie</button>
              <button className="px-4 py-2 mt-4 bg-blue-500 text-white rounded cursor-pointer" onClick={() => {
                handleDelete(id);
                setShowDelModal(false);
                setCategoryNameConfirm('');
              }}>Tak</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Editing */}
      {showEditModal && (
            <div className="fixed inset-0 flex justify-center items-center bg-[#00000036] z-50">
        <div className="bg-white p-6 rounded-lg min-w-96 w-fit">
            <div className="text-gray-700 text-2xl mb-4">Kreator kategorii</div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Nazwa kategorii</label>
              <input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Zdjęcie kategorii</label>
              <input type="file" accept="image/*" onChange={(e) => {
                if (!e.target.files)
                  return;

                const file = e.target.files[0];
                const objectUrl = URL.createObjectURL(file);
                setImagePreview(objectUrl);
                setCategoryImage(e.target.files[0]);
              }}
                className="hidden" ref={fileInputRef}
              />
              <button className="text-center mt-1 p-2 border text-gray-400 border-gray-300 rounded-md w-full cursor-pointer"
                onClick={() => { fileInputRef.current?.click() }}
              >Wybierz zdjęcie</button>
              {imagePreview && <div className="flex flex-col mt-4">
                <p className="block text-sm font-medium text-gray-700">Podgląd zdjęcia</p>
                <div className="h-[300px] w-[400px]">
                  <Image src={imagePreview} height={300} width={400} alt="upload image" className="object-cover w-full h-full rounded-md mt-1" />
                </div>
              </div>}
            </div>
            <div className="flex gap-4">
              <button className="px-4 py-2 mt-4 bg-gray-300 text-gray rounded cursor-pointer" onClick={() => {
                setShowEditModal(false);
                cleanup();
                setEditMode(false);
              }}>Anuluj</button>
              <button className="px-4 py-2 mt-4 bg-blue-500 text-white rounded cursor-pointer" onClick={() => {
                if(editMode) {
                  handleEdit(id) 
                } else {
                  handleAdd();
                }
              }}>Zapisz</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-8 py-4 shadow bg-gray-200">
        <div className="text-2xl font-semibold text-gray-800">
        {data.length} {data.length === 1 ? "kategoria" : (data.length % 10 >= 2 && data.length % 10 <= 4 && (data.length % 100 < 10 || data.length % 100 >= 20)) ? "kategorie" : "kategorii"}

        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer p-2 border hover:bg-gray-200 border-gray-300 bg-gray-100 rounded-md outline-none transition duration-300" onClick={() => {
            setEditMode(false);
            setShowEditModal(true);
          }}>
            <FiPlus size={20} />
            Dodaj
          </button>
          <button onClick={load} className="flex items-center gap-2 text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-300 rounded-lg transition">
          <FiRefreshCcw />
          Odśwież
        </button>
        </div>
      </div>

      {isLoading && <div className="h-2">
        <p>Ładowanie...</p>
      </div>}

      {/* Categories */}
      <div className="flex flex-wrap justify-start gap-8 p-8">
        {data.map((category: ProjectCategory) => (
          <div key={category._id} className="flex flex-col">
            <div className="shadow-lg bg-neutral-300 duration-200 rounded-lg">
              {category.photoURL ? (
                <div className="h-[270px] w-[420px]">
                  <Image src={BUCKET_URL + category.photoURL} width={420} height={270} alt="category-image" className="rounded-t-lg object-cover w-full h-full" />
                </div>
              ) : (
                <div className="bg-purple-100 h-[270px] w-[420px]"></div>
              )}
              <div className="text-center py-2">{category.name}</div>
            </div>
            <div className="flex justify-between px-2 mt-1">
              <button className="cursor-pointer text-sm hover:underline  flex" onClick={() => {
                setEditMode(true);
                setShowEditModal(true);
                setCategoryName(category.name);
                setImagePreview(`${BUCKET_URL}${category.photoURL}`);
                setCategoryImage(null);
                setId(category._id);
              }}><FiEdit2 /> Edytuj</button>
              <button className="cursor-pointer text-red-400 text-sm hover:underline flex" onClick={() => {
                setCategoryNameConfirm(category.name);
                setId(category._id);
                setShowDelModal(true);
              }}><FiTrash2 /> Usuń</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
