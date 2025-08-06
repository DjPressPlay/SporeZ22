import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jtrdxlqtxjffzqtansqj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0cmR4bHF0eGpmZnpxdGFuc3FqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDEwODk1NCwiZXhwIjoyMDY5Njg0OTU0fQ.bnCcNrCUnXlqpsUlghgFoL1tFiQnVUsdlS5Zqt07j-U'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
