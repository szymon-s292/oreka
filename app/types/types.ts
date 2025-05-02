export interface ProjectCategory {
    _id: string,
    name: string,
    photoURL: string
}

export interface ContactForm {
    _id: string,
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    message: string,
    time: string
}

export interface CustomProperty {
    key: string
    value: string
}

export interface ProjectResource {
    name: string
    url: string
}

export interface Project {
    _id: string
    name: string
    description: string
    images?: ProjectResource[]
    files?: ProjectResource[]
    categoryId: string
}

export interface ProjectForm {
    projectName: string
    projectDescription: string
    projectCategory: string
    files: File[]
    images: File[]
}

export interface User {
    _id: string
    name: string
    email: string
    isAdmin: boolean
}

export interface Article {
    _id: string
    title: string
    author: string
    content: string
}