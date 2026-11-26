import { pgTable, foreignKey, check, uuid, text, timestamp, integer, unique } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const profiles = pgTable("profiles", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  email: text().unique(),
  passwordHash: text("password_hash"),
  username: text().default("").notNull().unique(),
  displayName: text("display_name").default("").notNull(),
  bio: text().default("").notNull(),
  location: text().default("").notNull(),
  avatarUrl: text("avatar_url"),
  instagram: text().default("").notNull(),
  xHandle: text("x_handle").default("").notNull(),
  website: text().default("").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
});

export const stories = pgTable(
  "stories",
  {
    id: text().default(sql`(gen_random_uuid())::text`).primaryKey().notNull(),
    authorId: uuid("author_id").notNull(),
    authorHandle: text("author_handle").default("").notNull(),
    title: text().notNull(),
    summary: text().default("").notNull(),
    coverUrl: text("cover_url").default("").notNull(),
    genre: text().notNull(),
    fandom: text().default("Original").notNull(),
    fandomType: text("fandom_type").notNull(),
    relationships: text().array().default([]).notNull(),
    warnings: text().array().default([]).notNull(),
    tags: text().array().default([]).notNull(),
    rating: text().default("General").notNull(),
    status: text().default("En curso").notNull(),
    readsCount: integer("reads_count").default(0).notNull(),
    likesCount: integer("likes_count").default(0).notNull(),
    wordsCount: integer("words_count").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.authorId],
      foreignColumns: [profiles.id],
      name: "stories_author_id_fkey",
    }).onDelete("cascade"),
    check(
      "stories_genre_check",
      sql`genre = ANY (ARRAY['Drama'::text, 'Fantasía'::text, 'Comedia'::text, 'Acción'::text, 'Recuentos de la vida'::text, 'Romance'::text, 'Superhéroes'::text, 'Ciencia ficción'::text, 'Terror'::text, 'Sobrenatural'::text, 'Misterio'::text, 'Deportes'::text, 'Histórico'::text, 'Informativo'::text])`
    ),
    check(
      "stories_fandom_type_check",
      sql`fandom_type = ANY (ARRAY['Anime & manga'::text, 'Libros & literatura'::text, 'Cartoon & cómics'::text, 'Celebridades & personas reales'::text, 'Películas'::text, 'Música & bandas'::text, 'Teatro'::text, 'Shows de televisión'::text, 'Videojuegos'::text])`
    ),
    check("stories_rating_check", sql`rating = ANY (ARRAY['General'::text, 'Adolescentes'::text, 'Maduro'::text])`),
    check("stories_status_check", sql`status = ANY (ARRAY['En curso'::text, 'Completa'::text])`),
  ]
);

export const chapters = pgTable(
  "chapters",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    storyId: text("story_id").notNull(),
    chapterNumber: integer("chapter_number").notNull(),
    title: text().notNull(),
    content: text().default("").notNull(),
    status: text().default("published").notNull(),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true, mode: "string" }),
    publishedAt: timestamp("published_at", { withTimezone: true, mode: "string" }).defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.storyId],
      foreignColumns: [stories.id],
      name: "chapters_story_id_fkey",
    }).onDelete("cascade"),
    check("chapters_status_check", sql`status = ANY (ARRAY['published'::text, 'scheduled'::text, 'draft'::text])`),
  ]
);

export const chapterComments = pgTable(
  "chapter_comments",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    storyId: text("story_id").notNull(),
    chapterNumber: integer("chapter_number").notNull(),
    userId: uuid("user_id").notNull(),
    username: text().notNull(),
    content: text().notNull(),
    likesCount: integer("likes_count").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.storyId],
      foreignColumns: [stories.id],
      name: "chapter_comments_story_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [profiles.id],
      name: "chapter_comments_user_id_fkey",
    }).onDelete("cascade"),
  ]
);

export const storyCollaborators = pgTable(
  "story_collaborators",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    storyId: text("story_id").notNull(),
    storyTitle: text("story_title").notNull(),
    ownerId: uuid("owner_id").notNull(),
    ownerName: text("owner_name").notNull(),
    inviteeEmail: text("invitee_email").notNull(),
    status: text().default("pending").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.storyId],
      foreignColumns: [stories.id],
      name: "story_collaborators_story_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.ownerId],
      foreignColumns: [profiles.id],
      name: "story_collaborators_owner_id_fkey",
    }).onDelete("cascade"),
    check("story_collaborators_status_check", sql`status = ANY (ARRAY['pending'::text, 'accepted'::text, 'declined'::text])`),
  ]
);

export const userLibrary = pgTable(
  "user_library",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    storyId: text("story_id").notNull(),
    kind: text().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [profiles.id],
      name: "user_library_user_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.storyId],
      foreignColumns: [stories.id],
      name: "user_library_story_id_fkey",
    }).onDelete("cascade"),
    check("user_library_kind_check", sql`kind = ANY (ARRAY['saved'::text, 'liked'::text])`),
  ]
);

export const chapterReads = pgTable(
  "chapter_reads",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    storyId: text("story_id").notNull(),
    chapterNumber: integer("chapter_number").notNull(),
    readAt: timestamp("read_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [profiles.id],
      name: "chapter_reads_user_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.storyId],
      foreignColumns: [stories.id],
      name: "chapter_reads_story_id_fkey",
    }).onDelete("cascade"),
  ]
);

export const storyFollows = pgTable(
  "story_follows",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    storyId: text("story_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [profiles.id],
      name: "story_follows_user_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.storyId],
      foreignColumns: [stories.id],
      name: "story_follows_story_id_fkey",
    }).onDelete("cascade"),
  ]
);

export const posts = pgTable("posts", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull(),
  text: text().default("").notNull(),
  imageUrl: text("image_url"),
  likesCount: integer("likes_count").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
});

export const comments = pgTable("comments", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull(),
  text: text().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
});

export const postLikes = pgTable(
  "post_likes",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  },
  (table) => [unique().on(table.userId, table.postId)]
);