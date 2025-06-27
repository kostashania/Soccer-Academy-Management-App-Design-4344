import { supabase } from '../lib/supabase'

//========================================
// 🔐 AUTH & USER MANAGEMENT
//========================================
export const authService = {
  // Sign up new user
  async signUp(email, password, userData) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
            role: userData.role || 'player'
          }
        }
      })

      if (authError) throw authError

      // Create user profile
      if (authData.user) {
        const profileData = {
          auth_user_id: authData.user.id,
          full_name: userData.full_name,
          email: email,
          role: userData.role || 'player',
          phone_number: userData.phone_number,
          address: userData.address,
          language_preference: userData.language_preference || 'en'
        };

        // Add sponsor-specific fields
        if (userData.role === 'sponsor') {
          profileData.company_name = userData.company_name;
          profileData.website_url = userData.website_url;
          profileData.package_type = userData.package_type;
          profileData.status = 'active';
        }

        const { error: profileError } = await supabase
          .from('user_profiles_sa2025')
          .insert(profileData)

        if (profileError) throw profileError
      }

      return { data: authData, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Sign in user
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // Get user profile with role
      const { data: profile } = await supabase
        .from('user_profiles_sa2025')
        .select('*')
        .eq('auth_user_id', data.user.id)
        .single()

      return { data: { ...data, profile }, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Sign out
  async signOut() {
    return await supabase.auth.signOut()
  },

  // Get current session
  async getSession() {
    return await supabase.auth.getSession()
  },

  // Get user profile
  async getUserProfile(authUserId) {
    return await supabase
      .from('user_profiles_sa2025')
      .select('*')
      .eq('auth_user_id', authUserId)
      .single()
  }
}

//========================================
// 👥 USER PROFILES MANAGEMENT
//========================================
export const userService = {
  // Get all users (with role-based filtering)
  async getUsers() {
    return await supabase
      .from('user_profiles_sa2025')
      .select('*')
      .order('created_at', { ascending: false })
  },

  // Create user profile
  async createUser(userData) {
    return await supabase
      .from('user_profiles_sa2025')
      .insert(userData)
      .select()
      .single()
  },

  // Update user profile
  async updateUser(id, updates) {
    return await supabase
      .from('user_profiles_sa2025')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
  },

  // Delete user
  async deleteUser(id) {
    return await supabase
      .from('user_profiles_sa2025')
      .delete()
      .eq('id', id)
  },

  // Get players with parent relationships
  async getPlayersWithParents() {
    return await supabase
      .from('player_profiles_sa2025')
      .select(`
        *,
        user_profile:user_profiles_sa2025(*),
        parent_links:player_parent_links_sa2025(
          *,
          parent:parent_profiles_sa2025(
            *,
            user_profile:user_profiles_sa2025(*)
          )
        )
      `)
  }
}

//========================================
// 💰 PAYMENTS MANAGEMENT
//========================================
export const paymentService = {
  // Get payments (role-filtered)
  async getPayments() {
    return await supabase
      .from('payments_sa2025')
      .select('*')
      .order('created_at', { ascending: false })
  },

  // Create payment
  async createPayment(paymentData) {
    return await supabase
      .from('payments_sa2025')
      .insert(paymentData)
      .select()
      .single()
  },

  // Update payment
  async updatePayment(id, updates) {
    return await supabase
      .from('payments_sa2025')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
  },

  // Delete payment
  async deletePayment(id) {
    return await supabase
      .from('payments_sa2025')
      .delete()
      .eq('id', id)
  },

  // Get parent's payments
  async getParentPayments(parentId) {
    return await supabase
      .from('payments_sa2025')
      .select('*')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: false })
  }
}

//========================================
// 🛒 STORE & PRODUCTS
//========================================
export const storeService = {
  // Get products
  async getProducts() {
    return await supabase
      .from('products_sa2025')
      .select(`
        *,
        category:product_categories_sa2025(*)
      `)
      .order('created_at', { ascending: false })
  },

  // Create product
  async createProduct(productData) {
    return await supabase
      .from('products_sa2025')
      .insert(productData)
      .select()
      .single()
  },

  // Update product
  async updateProduct(id, updates) {
    return await supabase
      .from('products_sa2025')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
  },

  // Delete product
  async deleteProduct(id) {
    return await supabase
      .from('products_sa2025')
      .delete()
      .eq('id', id)
  },

  // Get product categories
  async getCategories() {
    return await supabase
      .from('product_categories_sa2025')
      .select('*')
      .order('name')
  },

  // Cart operations
  async getCartItems(userId) {
    return await supabase
      .from('cart_items_sa2025')
      .select(`
        *,
        product:products_sa2025(*)
      `)
      .eq('user_id', userId)
  },

  async addToCart(userId, productId, quantity = 1) {
    return await supabase
      .from('cart_items_sa2025')
      .upsert({
        user_id: userId,
        product_id: productId,
        quantity
      }, { onConflict: 'user_id,product_id' })
      .select()
      .single()
  },

  async updateCartItem(userId, productId, quantity) {
    if (quantity <= 0) {
      return await supabase
        .from('cart_items_sa2025')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId)
    }

    return await supabase
      .from('cart_items_sa2025')
      .update({ quantity })
      .eq('user_id', userId)
      .eq('product_id', productId)
  },

  async clearCart(userId) {
    return await supabase
      .from('cart_items_sa2025')
      .delete()
      .eq('user_id', userId)
  }
}

//========================================
// 📅 EVENTS & SCHEDULING
//========================================
export const eventService = {
  // Get events (role-filtered)
  async getEvents() {
    return await supabase
      .from('events_sa2025')
      .select(`
        *,
        location:locations_sa2025(*),
        coach:coach_profiles_sa2025(
          *,
          user_profile:user_profiles_sa2025(*)
        )
      `)
      .order('date_time', { ascending: true })
  },

  // Create event
  async createEvent(eventData) {
    return await supabase
      .from('events_sa2025')
      .insert(eventData)
      .select()
      .single()
  },

  // Update event
  async updateEvent(id, updates) {
    return await supabase
      .from('events_sa2025')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
  },

  // Delete event
  async deleteEvent(id) {
    return await supabase
      .from('events_sa2025')
      .delete()
      .eq('id', id)
  },

  // Get locations
  async getLocations() {
    return await supabase
      .from('locations_sa2025')
      .select('*')
      .eq('active_status', true)
      .order('name')
  }
}

//========================================
// 💬 MESSAGING SYSTEM
//========================================
export const messageService = {
  // Get conversations for user
  async getConversations(userId) {
    return await supabase
      .from('conversation_participants_sa2025')
      .select(`
        *,
        conversation:conversations_sa2025(
          *,
          latest_message:messages_sa2025(
            content,
            created_at
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  },

  // Get messages for conversation
  async getMessages(conversationId) {
    return await supabase
      .from('messages_sa2025')
      .select(`
        *,
        sender:user_profiles_sa2025(full_name, profile_photo)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
  },

  // Send message
  async sendMessage(conversationId, senderId, content, attachments = []) {
    return await supabase
      .from('messages_sa2025')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content,
        attachments
      })
      .select()
      .single()
  },

  // Create conversation
  async createConversation(name, type, createdBy, participants) {
    const { data: conversation, error: convError } = await supabase
      .from('conversations_sa2025')
      .insert({
        name,
        type,
        created_by: createdBy
      })
      .select()
      .single()

    if (convError) throw convError

    // Add participants
    const participantInserts = participants.map(userId => ({
      conversation_id: conversation.id,
      user_id: userId
    }))

    const { error: partError } = await supabase
      .from('conversation_participants_sa2025')
      .insert(participantInserts)

    if (partError) throw partError

    return { data: conversation, error: null }
  }
}

//========================================
// 📢 SPONSORS & MARKETING
//========================================
export const sponsorService = {
  // Get sponsors
  async getSponsors() {
    return await supabase
      .from('user_profiles_sa2025')
      .select('*')
      .eq('role', 'sponsor')
      .order('created_at', { ascending: false })
  },

  // Get sponsor ads
  async getSponsorAds(sponsorId = null) {
    let query = supabase
      .from('sponsor_ads_sa2025')
      .select(`
        *,
        sponsor:user_profiles_sa2025(*)
      `)

    if (sponsorId) {
      query = query.eq('sponsor_id', sponsorId)
    }

    return await query.order('created_at', { ascending: false })
  },

  // Create sponsor ad
  async createSponsorAd(adData) {
    return await supabase
      .from('sponsor_ads_sa2025')
      .insert(adData)
      .select()
      .single()
  },

  // Update sponsor ad
  async updateSponsorAd(id, updates) {
    return await supabase
      .from('sponsor_ads_sa2025')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
  },

  // Delete sponsor ad
  async deleteSponsorAd(id) {
    return await supabase
      .from('sponsor_ads_sa2025')
      .delete()
      .eq('id', id)
  },

  // Get sponsor analytics
  async getSponsorAnalytics(sponsorId, adId = null) {
    let query = supabase
      .from('sponsor_analytics_sa2025')
      .select('*')
      .eq('sponsor_id', sponsorId)

    if (adId) {
      query = query.eq('ad_id', adId)
    }

    return await query.order('date', { ascending: false })
  }
}

//========================================
// 🔔 NOTIFICATIONS
//========================================
export const notificationService = {
  // Get user notifications
  async getNotifications(userId) {
    return await supabase
      .from('notifications_sa2025')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  },

  // Create notification
  async createNotification(notification) {
    return await supabase
      .from('notifications_sa2025')
      .insert(notification)
      .select()
      .single()
  },

  // Mark as read
  async markAsRead(id) {
    return await supabase
      .from('notifications_sa2025')
      .update({ read_status: true })
      .eq('id', id)
  },

  // Mark all as read for user
  async markAllAsRead(userId) {
    return await supabase
      .from('notifications_sa2025')
      .update({ read_status: true })
      .eq('user_id', userId)
      .eq('read_status', false)
  }
}

//========================================
// ⚙️ SETTINGS & ADMIN
//========================================
export const settingsService = {
  // Get club settings
  async getSettings() {
    return await supabase
      .from('club_settings_sa2025')
      .select('*')
  },

  // Update setting
  async updateSetting(key, value, updatedBy) {
    return await supabase
      .from('club_settings_sa2025')
      .upsert({
        setting_key: key,
        setting_value: value,
        updated_by: updatedBy,
        updated_at: new Date().toISOString()
      }, { onConflict: 'setting_key' })
      .select()
      .single()
  }
}

//========================================
// 📊 ANALYTICS & REPORTS
//========================================
export const analyticsService = {
  // Get dashboard stats
  async getDashboardStats() {
    const [
      { count: totalUsers },
      { count: totalPlayers },
      { count: totalPayments },
      { count: pendingPayments }
    ] = await Promise.all([
      supabase.from('user_profiles_sa2025').select('*', { count: 'exact', head: true }),
      supabase.from('user_profiles_sa2025').select('*', { count: 'exact', head: true }).eq('role', 'player'),
      supabase.from('payments_sa2025').select('*', { count: 'exact', head: true }),
      supabase.from('payments_sa2025').select('*', { count: 'exact', head: true }).eq('status', 'pending')
    ])

    // Get revenue stats
    const { data: revenueData } = await supabase
      .from('payments_sa2025')
      .select('amount, status, created_at')
      .eq('status', 'paid')

    const totalRevenue = revenueData?.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) || 0

    return {
      totalUsers,
      totalPlayers,
      totalPayments,
      pendingPayments,
      totalRevenue
    }
  }
}

//========================================
// 📁 FILE UPLOAD HELPER
//========================================
export const fileService = {
  // Upload file to Supabase Storage
  async uploadFile(bucket, filePath, file) {
    return await supabase.storage
      .from(bucket)
      .upload(filePath, file)
  },

  // Get public URL for file
  getPublicUrl(bucket, filePath) {
    return supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)
  },

  // Delete file
  async deleteFile(bucket, filePath) {
    return await supabase.storage
      .from(bucket)
      .remove([filePath])
  }
}