import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createBlogSchema, updateBlogSchema } from "./schema.js";
import {prisma} from "../../utils/prisma.js"


export const blogRouter = new Hono()
    .get("/",async (c)=>{
        const blogs = await prisma.blog.findMany()
        return c.json(blogs)
    })
    .get("/:id",async (c)=> {
        const blogId = c.req.param("id")
        const blog = await prisma.blog.findUnique({
            where : {
                id:Number(blogId)
            }
        })
        if(!blog){
            return c.json({message:"Your Content is not found"},404)
        }
        return c.json(blog)
    })
    .post("/",zValidator("json",createBlogSchema),async (c)=>{
        const body = c.req.valid("json")

        const newBlog = await prisma.blog.create ({
            data : {
                title : body.title,
                content : body.content
            }
        })
        return c.json(newBlog,201)
    })
    .patch("/:id", zValidator("json", updateBlogSchema), async (c) => {
        const blogId = c.req.param("id");
        const body = c.req.valid("json");

        const blog = await prisma.blog.findUnique({
            where: {
            id: Number(blogId),
            },
        });

        if (!blog) {
            return c.json({ message: "Your Content is not found" }, 404);
        }

        const updated = await prisma.blog.update({
            where: {
            id: Number(blogId),
            },
            data: body,
        });

        return c.json(updated);
    })

    .delete("/:id", async (c) => {
        const blogId = c.req.param("id");

        const blog = await prisma.blog.findUnique({
            where: {
            id: Number(blogId),
            },
        });

        if (!blog) {
            return c.json({ message: "Your Content is not found" }, 404);
        }

        await prisma.blog.delete({
            where: {
            id: Number(blogId),
            },
        });

        return c.json({ message: "Your Blog deleted successfully" });
    });
