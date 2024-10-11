import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vgygszqpsaphkjdoxnkl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZneWdzenFwc2FwaGtqZG94bmtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg2NTgyMjgsImV4cCI6MjA0NDIzNDIyOH0.u9LJWO6XW_KB1YYVp4-xTUtNSw0tIN_i8k6syGwDi0w'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)