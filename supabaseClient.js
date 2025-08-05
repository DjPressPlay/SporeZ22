import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jtrdxlqtxjffzqtansqj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0cmR4bHF0eGpmZnpxdGFuc3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMDg5NTQsImV4cCI6MjA2OTY4NDk1NH0.KI7ysK-gHu_Qkke1mD6Cj_N1cmqbKi0dB2d2yls9Vm4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
