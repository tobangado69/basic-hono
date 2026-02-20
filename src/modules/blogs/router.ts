import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createBlogSchema, updateBlogSchema } from "./schema.js";
import { prisma } from "../../utils/prisma.js";

export const blogRouter = new Hono()
  .get("/", async (c) => {
    try {
      const blogs = await prisma.blog.findMany();
      return c.json(blogs);
    } catch (err) {
      console.error("GET /blogs error:", err);
      return c.json({ message: "Failed to fetch blogs" }, 500);
    }
  })

  .get("/:id", async (c) => {
    try {
      const blogId = Number(c.req.param("id"));

      if (isNaN(blogId)) {
        return c.json({ message: "Invalid blog id" }, 400);
      }

      const blog = await prisma.blog.findUnique({
        where: { id: blogId },
      });

      if (!blog) {
        return c.json({ message: "Blog not found" }, 404);
      }

      return c.json(blog);
    } catch (err) {
      console.error("GET /blogs/:id error:", err);
      return c.json({ message: "Failed to fetch blog" }, 500);
    }
  })

  .post("/", zValidator("json", createBlogSchema), async (c) => {
    try {
      const body = c.req.valid("json");

      const blog = await prisma.blog.create({
        data: {
          title: body.title,
          content: body.content,
        },
      });

      return c.json(blog, 201);
    } catch (err) {
      console.error("POST /blogs error:", err);
      return c.json({ message: "Failed to create blog" }, 500);
    }
  })

  .patch("/:id", zValidator("json", updateBlogSchema), async (c) => {
    try {
      const blogId = Number(c.req.param("id"));

      if (isNaN(blogId)) {
        return c.json({ message: "Invalid blog id" }, 400);
      }

      const body = c.req.valid("json");

      const blog = await prisma.blog.findUnique({
        where: { id: blogId },
      });

      if (!blog) {
        return c.json({ message: "Blog not found" }, 404);
      }

      const updated = await prisma.blog.update({
        where: { id: blogId },
        data: body,
      });

      return c.json(updated);
    } catch (err) {
      console.error("PATCH /blogs/:id error:", err);
      return c.json({ message: "Failed to update blog" }, 500);
    }
  })

  .delete("/:id", async (c) => {
    try {
      const blogId = Number(c.req.param("id"));

      if (isNaN(blogId)) {
        return c.json({ message: "Invalid blog id" }, 400);
      }

      const blog = await prisma.blog.findUnique({
        where: { id: blogId },
      });

      if (!blog) {
        return c.json({ message: "Blog not found" }, 404);
      }

      await prisma.blog.delete({
        where: { id: blogId },
      });

      return c.json({ message: "Blog deleted successfully" });
    } catch (err) {
      console.error("DELETE /blogs/:id error:", err);
      return c.json({ message: "Failed to delete blog" }, 500);
    }
  });