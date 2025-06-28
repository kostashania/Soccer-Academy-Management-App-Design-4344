import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'

export const useSupabaseData = (table, options = {}) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  const {
    select = '*',
    filter = null,
    orderBy = null,
    limit = null,
    dependencies = []
  } = options

  useEffect(() => {
    if (!user && table !== 'public_data') {
      setLoading(false)
      return
    }

    fetchData()
  }, [table, user, ...dependencies])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase.from(table).select(select)

      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            query = query.eq(key, value)
          }
        })
      }

      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true })
      }

      if (limit) {
        query = query.limit(limit)
      }

      const { data: result, error } = await query

      if (error) throw error

      setData(result || [])
    } catch (error) {
      console.error(`Error fetching ${table}:`, error)
      setError(error.message)
      toast.error(`Failed to fetch ${table}`)
    } finally {
      setLoading(false)
    }
  }

  const insert = async (newData) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(newData)
        .select()

      if (error) throw error

      setData(prev => Array.isArray(result) ? [...prev, ...result] : [...prev, result])
      toast.success('Record created successfully!')
      return { success: true, data: result }
    } catch (error) {
      console.error(`Error inserting into ${table}:`, error)
      toast.error('Failed to create record')
      return { success: false, error: error.message }
    }
  }

  const update = async (id, updates) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()

      if (error) throw error

      setData(prev => prev.map(item => 
        item.id === id ? (Array.isArray(result) ? result[0] : result) : item
      ))
      toast.success('Record updated successfully!')
      return { success: true, data: result }
    } catch (error) {
      console.error(`Error updating ${table}:`, error)
      toast.error('Failed to update record')
      return { success: false, error: error.message }
    }
  }

  const remove = async (id) => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (error) throw error

      setData(prev => prev.filter(item => item.id !== id))
      toast.success('Record deleted successfully!')
      return { success: true }
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error)
      toast.error('Failed to delete record')
      return { success: false, error: error.message }
    }
  }

  return {
    data,
    loading,
    error,
    refresh: fetchData,
    insert,
    update,
    remove
  }
}