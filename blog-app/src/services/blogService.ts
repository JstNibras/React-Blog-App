import { addDoc, collection, deleteDoc, doc, getDoc, getDocs,orderBy, query, serverTimestamp, updateDoc, type Timestamp } from "firebase/firestore";

import { db } from "../firebase/config";
import type { Blog } from "../types/blog";

const blogsCollection = collection(db, "blogs")

interface CreateBlogInput {
    title: string;
    content: string;
    authorId: string;
    authorEmail: string;
}

interface UpdateBlogInput {
    title: string;
    content: string;
}

interface BlogDocument {
  title: string;
  content: string;
  authorId: string;
  authorEmail: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

function toBlog(id: string, data: BlogDocument): Blog {
    return {
        id,
        title: data.title,
        content: data.content,
        authorId: data.authorId,
        authorEmail: data.authorEmail,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
    }
}

export async function createBlog(input: CreateBlogInput): Promise<string> {
    const docRef = await addDoc(blogsCollection, {
        ...input,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    })

    return docRef.id;
}

export async function getBlogs(): Promise<Blog[]> {
    const blogsQuery = query(
        blogsCollection,
        orderBy("createdAt", "desc")
    )

    const snapshot = await getDocs(blogsQuery)

    return snapshot.docs.map((blogDoc) => toBlog(blogDoc.id, blogDoc.data() as BlogDocument))
}

export async function getBlogById(id: string): Promise<Blog | null> {
    const docRef = doc(db, "blogs", id);
    const snapshot = await getDoc(docRef)

    if(!snapshot.exists()) {
        return null
    }

    return toBlog(snapshot.id, snapshot.data() as BlogDocument)
} 

export async function updateBlog(id: string, input: UpdateBlogInput): Promise<void> {
    const docRef = doc(db, "blogs", id);

    await updateDoc(docRef, {
        title: input.title,
        content: input.content,
        updatedAt: serverTimestamp(),
    })
}

export async function deleteBlog(id: string): Promise<void> {
    const docRef = doc(db, "blogs", id)

    await deleteDoc(docRef);
}