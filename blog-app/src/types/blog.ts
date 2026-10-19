export interface Blog {
    id: string;
    title: string;
    content: string;
    authorId: string;
    authorEmail: string;
    createdAt: Date;
    updatedAt: Date;
}