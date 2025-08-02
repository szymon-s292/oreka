'use client'

import { useState, useEffect, useRef, } from "react"
import { useForm, } from "react-hook-form";
import { ProjectCategory, Project, ProjectForm, ProjectResource } from "@/app/types/types"
import axios from 'axios'
import { toast } from 'react-toastify';
import Image from "next/image";
import Link from "next/link";
import { FiRefreshCcw, FiTrash2, FiEdit2, FiExternalLink } from 'react-icons/fi';
import { FiPlus } from 'react-icons/fi';
import { MdImage } from 'react-icons/md';
import { FiFile } from 'react-icons/fi';

export default function ProjectList() {
  const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;
  const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL as string
  const [projects, setProjects] = useState<Project[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [categoriesList, setCategoriesList] = useState<ProjectCategory[]>([]);
  const [selected, setSelect] = useState('0');

  const { register, handleSubmit, setValue, } = useForm<ProjectForm>();
  const [imagePreviews, setImagePreviews] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<File[]>([]);
  const imagesInputRef = useRef<HTMLInputElement | null>(null)
  const filesInputRef = useRef<HTMLInputElement | null>(null)
  const [isFormSending, setIsFormSending] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false)
  const [id, setId] = useState<string>()
  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const [fileUrls, setFilesUrls] = useState<ProjectResource[]>([])

  const loadCategoriesList = () => {
    axios.get(`${NEXT_PUBLIC_BASE_URL}/api/categories`)
      .then(res => res.data)
      .then(data => setCategoriesList(data))
      .catch(() => {
        toast.error("Wystąpił błąd. Spróbuj ponownie poźniej")
      })
  }

  const loadProjectsList = () => {
    setLoading(true)
    axios.get(`${NEXT_PUBLIC_BASE_URL}/api/projects/${selected}`)
      .then(res => res.data)
      .then(data => {
        setProjects(data)
        setLoading(false)
      })
      .catch(() => {
        toast.error("Wystąpił błąd. Spróbuj ponownie poźniej")
        setLoading(false)
      })
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.currentTarget.value;
    if (newValue !== selected) {
      setSelect(newValue);
    }
  }
  

  useEffect(() => {
    loadProjectsList()
  }, [selected])

  useEffect(() => {
    loadCategoriesList()
  }, [])
  

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      toast.success(`Dodano ${newFiles.length} zdjęć`)
      setImagePreviews((prev) => [...prev, ...newFiles]);
      setValue("images", [...files] as File[]);
    }
  };

  const handleImageRemove = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    toast.success("Zdjęcie usunięte")
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      toast.success(`Dodano ${files.length} plików`)
      setFilePreviews((prev) => [...prev, ...newFiles]);
      setValue("files", [...files] as File[]);
    }
  }

  const handleFileRemove = (index: number) => {
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
    setFilesUrls((prev) => prev.filter((_, i) => i !== index))
    toast.success("Plik usunięty")
  };

  const handleDelete = async () => {
    axios.delete(`${NEXT_PUBLIC_BASE_URL}/api/project/${id}`)
    .then(() => {
      setProjects(ps => ps.filter(p => {
        if(p._id != id) return p
      }))
      toast.success("Projekt usunięty")
    })
    .catch(() =>{
      toast.error("Wystąpił błąd. Spróbuj ponownie poźniej")
    })
  }
  
  const onSubmit = async (data: ProjectForm) => {
    const formData = new FormData()
    if(data.projectName === '') {
      toast.error("Nazwa projektu jest wymagana");
      return
    }

    if(data.projectDescription === '') {
      toast.error("Opis projektu jest wymagany");
      return
    }

    if(data.projectCategory === '0') {
      toast.error("Kategoria projektu jest wymagana");
      return
    }
    setIsFormSending(true)
    
    formData.append('projectName', data.projectName)
    formData.append('projectDescription', data.projectDescription)
    formData.append('projectCategory', data.projectCategory)

    const imageMap: string[] = []
    imagePreviews.forEach((image, index) => {
      formData.append(`image${index + 1}`, image)
      imageMap.push(`image${index + 1}`)
    })

    const fileMap: string[] = []
    filePreviews.forEach((file, index) => {
      formData.append(`file${index + 1}`, file)
      fileMap.push(`file${index + 1}`)
    })

    formData.append('fileMap', JSON.stringify(fileMap))
    formData.append('imageMap', JSON.stringify(imageMap))

    if(editMode) {
      axios.put(`${NEXT_PUBLIC_BASE_URL}/api/project/${id}`, formData, {
        headers: {
        'Content-Type': 'multipart/form-data',
      }}).then(res => {
        toast.success("Zmiany w projekcie zapisane");
        setProjects((ps) =>
          ps.map((p) =>
            p._id === res.data.projectId
              ? {
                  ...p,
                  name: data.projectName,
                  description: data.projectDescription,
                  categoryId: data.projectCategory,
                  images: res.data.images,
                  files: res.data.files
                }
              : p
          )
        );
        
        setShowEditModal(false)
        setFilePreviews([])
        setImagePreviews([])
        setValue('projectName', '')
        setValue('projectDescription', '')
        setValue('projectCategory', '0')
        setEditMode(false)

      }).catch(() => {
        toast.error("Wystąpił błąd. Spróbuj ponownie poźniej");
      }).finally(() => {
        setIsFormSending(false)
      })
    } else {
      axios.post(`${NEXT_PUBLIC_BASE_URL}/api/project`, formData, {
        headers: {
        'Content-Type': 'multipart/form-data',
      }}).then(res => {
        toast.success("Nowy projekt dodany");
        setProjects([...projects, {
          _id: res.data.projectId,
          name: data.projectName,
          description: data.projectDescription,
          categoryId: data.projectCategory,
          images: res.data.images,
          files: res.data.files  }])
  
        setShowEditModal(false)
        setFilePreviews([])
        setImagePreviews([])
        setValue('projectName', '')
        setValue('projectDescription', '')
        setValue('projectCategory', '0')
        
      }).catch(() => {
        toast.error("Wystąpił błąd. Spróbuj ponownie poźniej");
      }).finally(() => {
        setIsFormSending(false)
      })
    }
  };
  
  return (
    <>
    {confirmModal && (
      <div className="fixed inset-0 flex justify-center items-center bg-[#00000036] z-50">
      <div className="bg-white p-6 rounded-lg min-w-96 w-fit">
        <div className="mb-4">Czy usunąć projekt?</div>
        <p className="text-sm">Tej operacji nie da się cofnąć</p>
        <div className="flex gap-4">
          <button className="px-4 py-2 mt-4 bg-gray-300 text-gray rounded cursor-pointer" onClick={() => {
            setConfirmModal(false)
            // setCategoryNameConfirm('')
          }}>Nie</button>
          <button className="px-4 py-2 mt-4 bg-blue-500 text-white rounded cursor-pointer" onClick={() => {
            handleDelete()
            setConfirmModal(false)
            // setCategoryNameConfirm('')
          }}>Tak</button>
        </div>
      </div>
    </div>
    )}

    {showEditModal && (
      <div className="fixed inset-0 flex justify-center items-center bg-[#00000036] z-50">
        <div className="bg-white p-4 rounded">
          <div className="text-gray-700 text-2xl mb-4">Kreator projektu</div>
          <div className="flex justify-center gap-8">
            <form onSubmit={handleSubmit(onSubmit)}>
            <section className="w-80 flex flex-col justify-between h-full">
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Nazwa projektu</label>
                  <input type="text" className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    {...register("projectName")}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Opis projektu</label>
                  <textarea className="mt-1 p-2 border border-gray-300 rounded-md w-full h-24"
                    {...register("projectDescription")}
                    ></textarea>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Dodaj obrazy projektu</label>
                    <input type="file" 
                      accept="image/*"
                      multiple
                      ref={imagesInputRef} 
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full hidden"
                      onChange={handleImageChange}
                      />

                    <button className="text-center mt-1 p-2 border text-gray-400 border-gray-300 rounded-md w-full cursor-pointer"
                      onClick={(e) => {e.preventDefault(); imagesInputRef.current?.click()}}
                    >Wybierz zdjęcie/zdjęcia</button>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Dodaj pliki do pobrania</label>
                    <input type="file"
                      multiple
                      ref={filesInputRef}
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full hidden"
                      onChange={handleFileChange}/>

                    <button className="text-center mt-1 p-2 border text-gray-400 border-gray-300 rounded-md w-full cursor-pointer"
                      onClick={(e) => {e.preventDefault(); filesInputRef.current?.click()}}
                    >Wybierz plik/pliki</button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Projekt należy do kategorii</label>
                  <select 
                  {...register("projectCategory")}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full text-gray-400 outline-none">
                    <option value="0" defaultValue={'0'} >Wybierz kategorie</option>
                    {categoriesList.map((category: ProjectCategory) => {
                      return (
                        <option key={category._id} value={category._id}>{category.name}</option>
                      )
                    })}
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="px-4 py-2 mt-4 bg-gray-300 text-gray rounded cursor-pointer" onClick={(e) => {
                  e.preventDefault();
                  setShowEditModal(false)
                  setShowEditModal(false)
                  setFilePreviews([])
                  setImagePreviews([])
                  setValue('projectName', '')
                  setValue('projectDescription', '')
                  setValue('projectCategory', '0')
                  
                }}>Anuluj</button>
                  <button
                    type="submit"
                    className={`px-4 py-2 mt-4 rounded cursor-pointer ${isFormSending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
                    disabled={isFormSending}
                  >
                    {isFormSending ? 'Wysyłanie...' : 'Zapisz'}
                  </button>
              </div>
            </section>
            </form>
              {(imagePreviews.length > 0 || filePreviews.length > 0) && <section className="max-w-96 flex flex-col gap-4">
              {/* Image Preview Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Podgląd zdjęć/zdjęcia</label>
                <div className="flex gap-2 max-w-96 h-fit overflow-x-auto mt-1 pb-3">
                  {imagePreviews.map((file, index) => {
                    const imageURL = URL.createObjectURL(file);
                    return (
                      <div key={index} className="">
                        <div className="relative w-[350px] h-[220px] flex-none">
                          <Image
                            src={imageURL}
                            alt={`Preview ${file.name}`}
                            className="w-full h-full object-cover rounded-lg shadow-lg"
                            width={350} // Set to full width of the parent container
                            height={220} // Set to the fixed height for consistency
                            />
                        </div>
                          <div className="flex justify-end">
                            <button onClick={() => handleImageRemove(index)} className="cursor-pointer text-red-400 text-sm hover:underline">Usuń zdjęcie</button>
                          </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Podgląd pliku/plików do pobrania</label>
                <div className="flex flex-col text-gray-700">
                  <ul className="flex flex-col gap-2 max-h-64 mt-1 overflow-y-auto">
                  {filePreviews.map((file, index) => {
                    return (
                      <li key={index} className="w-96">
                        <div className="flex justify-between p-2 border text-gray-400 border-gray-300 rounded-md w-full">
                          <Link target="_blank" href={`${editMode ? (fileUrls[index]?.url ? BUCKET_URL + fileUrls[index].url : '') : ''}`}>
                          <p className="hover:underline hover:text-gray-600 cursor-pointer">
                            {file.name}
                          </p>
                          </Link>
                          <button onClick={() => handleFileRemove(index)} className="cursor-pointer text-red-400 text-sm hover:text-red-600">X</button>
                        </div>
                      </li>
                    )
                  })}
                  </ul>
                </div>
                </div>

              </section>}
            </div>
          </div>
      </div>
    )}
    
    <div>
      <div className="flex items-center justify-between px-8 py-4 shadow bg-gray-200">
        <p className="text-2xl font-semibold text-gray-800">
        {projects.length} {
          projects.length === 1
            ? "projekt"
            : (projects.length % 10 >= 2 &&
              projects.length % 10 <= 4 &&
              (projects.length % 100 < 10 || projects.length % 100 >= 20))
              ? "projekty"
              : "projektów"
        }
        </p>
        <div className="flex gap-4">
        <button className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer p-2 border hover:bg-gray-200 border-gray-300 bg-gray-100 rounded-md outline-none transition duration-300" onClick={() => {
          setShowEditModal(true)
        }}><FiPlus size={20}/>Dodaj</button>


<button onClick={loadProjectsList} className="flex items-center gap-2 text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-300 rounded-lg transition">
          <FiRefreshCcw />
          Odśwież
        </button>
        </div>
      </div>

      <div className="my-4 flex gap-4 items-center h-12 px-8">
        <p>Pokaż projekty z kategorii </p>
        <select onChange={handleCategoryChange} 
          className="p-2 border border-gray-300 rounded-md w-64 text-gray-400 outline-none">
          <option value="0" defaultValue={'0'}>Wszystkie kategorie</option>
          {categoriesList.map((category: ProjectCategory) => {
            return (
              <option key={category._id} value={category._id}>{category.name}</option>
            )
          })}
        </select>
      </div>
      <div className="flex flex-wrap justify-start gap-8 p-8 pt-4">
        {isLoading ? 'Ładowanie...' : projects.map((project) => (
          <div key={project._id} className="flex flex-col w-[420px]">
            <div className="shadow-lg bg-neutral-300 duration-200 rounded-lg">
              <div className="flex flex-col">
                  <div className="h-[270px] w-[420px]">
                    {project?.images && project?.images?.length > 0 ? (
                      <Image src={`${BUCKET_URL}${project?.images[0].url}`} width={420} height={270} alt={`++${project.images[0].url}`} className="rounded-t-lg object-cover w-full h-full"/>
                    ) : (
                      <Image src={"/oreka-logo.png"} width={420} height={270} alt="" className="rounded-t-lg object-cover w-full h-full"/>
                    )}
                </div>
                <div className="py-2 bg-neutral-200">
                  <ul className="flex justify-around">
                    <li className="flex">
                      <FiFile size={20}/>
                      {(project?.files?.length === 1) ?
                       "1 plik do pobrania" : 
                       (project?.files && project?.files?.length < 5) ? 
                       `${project?.files?.length} pliki do pobrania` : 
                       `${project?.files?.length} plików do pobrania`}
                    </li>
                    <li className="flex">
                      <MdImage size={20}/>

                      {(project?.images?.length === 1 ) 
                        ? "1 zdjęcie" :
                        (project?.images && project?.images?.length < 5) ? 
                        `${project?.images?.length} zdjęcia do pobrania` : 
                        `${project?.images?.length} zdjęć do pobrania`}
                    </li>
                  </ul>
                </div>
              </div>
              <div className="text-center text-lg font-bold py-2">{project.name}</div>
            </div>

            <div className="flex justify-between px-2 mt-1">
              <button className="flex text-sm hover:underline" onClick={() => {
                setId(project._id)
                setEditMode(true)
                setFilesUrls([...(project.files || []).map(file => {
                  return {name: file.name, url: file.url}
                })])

                Promise.all([...(project.images || []).map(img =>
                    axios.get(`${BUCKET_URL}${img.url}`, { responseType: 'blob' })
                      .then(res => new File([res.data], img.name || 'image', { type: res.data.type }))
                  ),
                  ...(project.files || []).map(file =>
                    axios.get(`${BUCKET_URL}${file.url}`, { responseType: 'blob' })
                      .then(res => new File([res.data], file.name || 'file', { type: res.data.type }))
                  )
                ]).then(allFiles => {
                  const imgCount = project.images?.length || 0;
                  setImagePreviews(allFiles.slice(0, imgCount));
                  setFilePreviews(allFiles.slice(imgCount));
                });
              
                setValue('projectName', project.name)
                setValue('projectDescription', project.description)
                setValue('projectCategory', project.categoryId)
                  
                // setSelect(project.categoryId)
                setShowEditModal(true)
                }}><FiEdit2 /> Edytuj</button>
                <Link href={`${NEXT_PUBLIC_BASE_URL}/project/${project._id}`}>
              <button className="flex text-sm hover:underline" onClick={() => {
              }}><FiExternalLink /> Podgląd</button>
              </Link>
              <button className="flex text-red-400 text-sm hover:underline" onClick={() => {
                setId(project._id);
                setConfirmModal(true)
                }}><FiTrash2 /> Usuń</button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>

  )
}