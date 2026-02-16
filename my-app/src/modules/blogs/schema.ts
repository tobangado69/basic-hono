import z from "zod";

export const createBlogSchema = z.object({
    title : z.string().min(8),
    content: z.string().min(10)
})
export const updateBlogSchema = z.object({
    title:  z.string().min(8).optional(),
    content: z.string().min(10).optional()
})