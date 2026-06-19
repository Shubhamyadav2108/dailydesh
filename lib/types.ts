export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  cover_image: string | null;
  category_id: string | null;
  author_name: string;
  status: "draft" | "published";
  is_breaking: boolean;
  is_featured: boolean;
  views: number;
  published_at: string | null;
  created_at: string;
  category?: Category;
};
