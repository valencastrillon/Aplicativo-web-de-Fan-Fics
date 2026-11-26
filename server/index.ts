import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "./db";
import { comments, postLikes, posts, profiles, stories } from "../drizzle/schema";

const app = express();
app.use(express.json({ limit: "10mb" }));

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-nocturna";

const signToken = (userId: string) =>
  jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "7d" });

const getUserIdFromReq = (req: express.Request): string | null => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET) as { sub: string };
    return payload.sub;
  } catch {
    return null;
  }
};

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();

    const existingEmail = await db.select().from(profiles).where(eq(profiles.email, cleanEmail));
    if (existingEmail.length > 0) {
      return res.status(409).json({ error: "Ese correo ya está registrado" });
    }

    const existingUser = await db.select().from(profiles).where(eq(profiles.username, cleanUsername));
    if (existingUser.length > 0) {
      return res.status(409).json({ error: "Ese nombre de usuario ya está en uso" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [created] = await db
      .insert(profiles)
      .values({
        email: cleanEmail,
        username: cleanUsername,
        displayName: cleanUsername,
        passwordHash,
      })
      .returning();

    const token = signToken(created.id);
    res.status(201).json({
      token,
      user: { id: created.id, username: created.username, email: created.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error registrando usuario" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Correo y contraseña requeridos" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const [found] = await db.select().from(profiles).where(eq(profiles.email, cleanEmail));

    if (!found || !found.passwordHash) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const valid = await bcrypt.compare(password, found.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = signToken(found.id);
    res.json({
      token,
      user: { id: found.id, username: found.username, email: found.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

app.get("/api/auth/me", async (req, res) => {
  const userId = getUserIdFromReq(req);
  if (!userId) return res.status(401).json({ error: "No autenticado" });

  const [found] = await db.select().from(profiles).where(eq(profiles.id, userId));
  if (!found) return res.status(404).json({ error: "Usuario no encontrado" });

  res.json({
    user: { id: found.id, username: found.username, email: found.email ?? "" },
  });
});

app.patch("/api/auth/profile", async (req, res) => {
  const userId = getUserIdFromReq(req);
  if (!userId) return res.status(401).json({ error: "No autenticado" });

  try {
    const { username, email, password } = req.body;
    const updates: Partial<typeof profiles.$inferInsert> = {
      updatedAt: new Date().toISOString(),
    };

    if (username) updates.username = username.trim();
    if (email) updates.email = email.trim().toLowerCase();
    if (password) updates.passwordHash = await bcrypt.hash(password, 10);

    const [updated] = await db
      .update(profiles)
      .set(updates)
      .where(eq(profiles.id, userId))
      .returning();

    res.json({
      user: { id: updated.id, username: updated.username, email: updated.email ?? "" },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo actualizar el perfil" });
  }
});

app.get("/api/stories", async (_req, res) => {
  try {
    const rows = await db.select().from(stories);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error consultando stories en Neon" });
  }
});

app.get("/api/posts", async (req, res) => {
  try {
    const currentUserId = getUserIdFromReq(req);

    const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));
    if (allPosts.length === 0) {
      return res.json([]);
    }

    const postIds = allPosts.map((p) => p.id);

    const allComments = await db
      .select()
      .from(comments)
      .where(inArray(comments.postId, postIds))
      .orderBy(asc(comments.createdAt));

    let likedSet = new Set<string>();
    if (currentUserId) {
      const userLikes = await db
        .select({ postId: postLikes.postId })
        .from(postLikes)
        .where(and(eq(postLikes.userId, currentUserId), inArray(postLikes.postId, postIds)));
      likedSet = new Set(userLikes.map((l) => l.postId));
    }

    const commentsByPost: Record<
      string,
      Array<{ id: string; user_id: string; author_name: string; text: string; created_at: string }>
    > = {};

    for (const c of allComments) {
      if (!commentsByPost[c.postId]) commentsByPost[c.postId] = [];
      commentsByPost[c.postId].push({
        id: c.id,
        user_id: c.userId,
        author_name: c.authorName,
        text: c.text,
        created_at: c.createdAt,
      });
    }

    const formatted = allPosts.map((p) => ({
      id: p.id,
      user_id: p.userId,
      author_name: p.authorName,
      text: p.text,
      image_url: p.imageUrl,
      likes_count: p.likesCount,
      created_at: p.createdAt,
      liked: likedSet.has(p.id),
      comments: commentsByPost[p.id] || [],
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo publicaciones" });
  }
});

app.post("/api/posts", async (req, res) => {
  const userId = getUserIdFromReq(req);
  if (!userId) return res.status(401).json({ error: "No autenticado" });

  try {
    const { text, image_url } = req.body;
    const [author] = await db.select().from(profiles).where(eq(profiles.id, userId));
    const authorName = author?.username || "Usuario";

    const [created] = await db
      .insert(posts)
      .values({
        userId,
        authorName,
        text: text ?? "",
        imageUrl: image_url ?? null,
      })
      .returning();

    res.status(201).json({
      id: created.id,
      user_id: created.userId,
      author_name: created.authorName,
      text: created.text,
      image_url: created.imageUrl,
      likes_count: created.likesCount,
      created_at: created.createdAt,
      liked: false,
      comments: [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creando publicación" });
  }
});

app.delete("/api/posts/:postId", async (req, res) => {
  const userId = getUserIdFromReq(req);
  if (!userId) return res.status(401).json({ error: "No autenticado" });

  try {
    const { postId } = req.params;
    await db.delete(posts).where(and(eq(posts.id, postId), eq(posts.userId, userId)));
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error eliminando publicación" });
  }
});

app.post("/api/posts/:postId/like", async (req, res) => {
  const userId = getUserIdFromReq(req);
  if (!userId) return res.status(401).json({ error: "No autenticado" });

  try {
    const { postId } = req.params;
    const existing = await db
      .select()
      .from(postLikes)
      .where(and(eq(postLikes.userId, userId), eq(postLikes.postId, postId)));

    if (existing.length > 0) {
      await db.delete(postLikes).where(and(eq(postLikes.userId, userId), eq(postLikes.postId, postId)));
    } else {
      await db.insert(postLikes).values({ userId, postId });
    }

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(postLikes)
      .where(eq(postLikes.postId, postId));

    await db
      .update(posts)
      .set({ likesCount: count })
      .where(eq(posts.id, postId));

    res.json({ liked: existing.length === 0, likes_count: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error actualizando like" });
  }
});

app.post("/api/posts/:postId/comments", async (req, res) => {
  const userId = getUserIdFromReq(req);
  if (!userId) return res.status(401).json({ error: "No autenticado" });

  try {
    const { postId } = req.params;
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ error: "El comentario no puede estar vacío" });

    const [author] = await db.select().from(profiles).where(eq(profiles.id, userId));
    const [created] = await db
      .insert(comments)
      .values({
        postId,
        userId,
        authorName: author?.username || "Usuario",
        text: text.trim(),
      })
      .returning();

    res.status(201).json({
      id: created.id,
      user_id: created.userId,
      author_name: created.authorName,
      text: created.text,
      created_at: created.createdAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error agregando comentario" });
  }
});

app.patch("/api/comments/:commentId", async (req, res) => {
  const userId = getUserIdFromReq(req);
  if (!userId) return res.status(401).json({ error: "No autenticado" });

  try {
    const { commentId } = req.params;
    const { text } = req.body;
    await db
      .update(comments)
      .set({ text })
      .where(and(eq(comments.id, commentId), eq(comments.userId, userId)));

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error editando comentario" });
  }
});

app.delete("/api/comments/:commentId", async (req, res) => {
  const userId = getUserIdFromReq(req);
  if (!userId) return res.status(401).json({ error: "No autenticado" });

  try {
    const { commentId } = req.params;
    await db.delete(comments).where(and(eq(comments.id, commentId), eq(comments.userId, userId)));
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error eliminando comentario" });
  }
});

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});

export { app };

if (!process.env.NETLIFY) {
  const PORT = process.env.PORT ?? 3001;
  app.listen(PORT, () => {
    console.log(`API corriendo en http://localhost:${PORT}`);
  });
}