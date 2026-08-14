// ─── Database type definitions matching KISA Supabase schema ──────────────────

export type UserRole = 'reader' | 'admin';
export type StoryStatus = 'draft' | 'published' | 'archived';
export type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'cancelled';
export type PaymentMethodType = 'mobile' | 'card';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      authors: {
        Row: {
          id: string;
          name: string;
          bio: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['authors']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['authors']['Insert']>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
      stories: {
        Row: {
          id: string;
          slug: string;
          title: string;
          hook: string | null;
          description: string | null;
          cover_url: string | null;
          author_id: string | null;
          category_id: string | null;
          status: StoryStatus;
          is_featured: boolean;
          is_original: boolean;
          avg_rating: number;
          total_reads: number;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['stories']['Row'], 'id' | 'avg_rating' | 'total_reads' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['stories']['Insert']>;
      };
      episodes: {
        Row: {
          id: string;
          story_id: string;
          episode_number: number;
          title: string;
          content: string | null;
          youtube_video_id: string | null;
          is_free: boolean;
          reading_minutes: number;
          status: StoryStatus;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['episodes']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['episodes']['Insert']>;
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          status: SubscriptionStatus;
          amount: number;
          start_date: string;
          expiry_date: string;
          is_trial: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['subscriptions']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>;
      };
      subscription_transactions: {
        Row: {
          id: string;
          user_id: string;
          subscription_id: string | null;
          amount: number;
          payment_method: PaymentMethodType;
          status: TransactionStatus;
          reference: string;
          customer_name: string | null;
          customer_phone: string | null;
          customer_email: string | null;
          payment_url: string | null;
          snippe_reference: string | null;
          webhook_payload: Record<string, unknown> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['subscription_transactions']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['subscription_transactions']['Insert']>;
      };
      reading_progress: {
        Row: {
          id: string;
          user_id: string;
          episode_id: string;
          story_id: string;
          percent: number;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['reading_progress']['Row'], 'id' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['reading_progress']['Insert']>;
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          story_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bookmarks']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['bookmarks']['Insert']>;
      };
      comments: {
        Row: {
          id: string;
          user_id: string;
          story_id: string | null;
          episode_id: string | null;
          body: string;
          is_deleted: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['comments']['Row'], 'id' | 'is_deleted' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['comments']['Insert']>;
      };
      ratings: {
        Row: {
          id: string;
          user_id: string;
          story_id: string | null;
          episode_id: string | null;
          score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ratings']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['ratings']['Insert']>;
      };
    };
    Functions: {
      kisa_is_admin: { Args: Record<never, never>; Returns: boolean };
      kisa_has_active_subscription: { Args: { p_user_id: string }; Returns: boolean };
      kisa_increment_story_reads: { Args: { p_story_id: string }; Returns: void };
      kisa_activate_subscription: {
        Args: { p_user_id: string; p_transaction_id: string; p_reference: string };
        Returns: string;
      };
    };
  };
}

// ── Convenience row types ──────────────────────────────────────────────────────
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Author = Database['public']['Tables']['authors']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Story = Database['public']['Tables']['stories']['Row'];
export type Episode = Database['public']['Tables']['episodes']['Row'];
export type Subscription = Database['public']['Tables']['subscriptions']['Row'];
export type SubscriptionTransaction = Database['public']['Tables']['subscription_transactions']['Row'];
export type ReadingProgress = Database['public']['Tables']['reading_progress']['Row'];
export type Bookmark = Database['public']['Tables']['bookmarks']['Row'];
export type Comment = Database['public']['Tables']['comments']['Row'];
export type Rating = Database['public']['Tables']['ratings']['Row'];

// ── Enriched types (with joins) ───────────────────────────────────────────────
export type StoryWithDetails = Story & {
  author?: Author | null;
  category?: Category | null;
  episodes?: Episode[];
};

export type CommentWithProfile = Comment & {
  profiles: Pick<Profile, 'full_name' | 'avatar_url'>;
};
