import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../composables/supabase.js'

export const useUserStore = defineStore('user', () => {
  const userCount = ref(0)
  const loading = ref(false)
  const error = ref(null)

  async function fetchUserCount() {
    if (!supabase)
      return
    loading.value = true
    try {
      const table = import.meta.env.VITE_COUNT_TABLE || 'profiles'
      const res = await supabase.from(table).select('id', { count: 'exact' })
      if (res.error) {
        error.value = res.error
        console.error('Error fetching user count', res.error)
      }
      else {
        userCount.value = res.count ?? (res.data?.length ?? 0)
      }
    }
    catch (err) {
      error.value = err
      console.error(err)
    }
    finally {
      loading.value = false
    }
  }

  return { userCount, loading, error, fetchUserCount }
})
