//login-profile.js//

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event) => {
  const { name, password } = JSON.parse(event.body);

  if (!name || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Name and password are required' }),
    };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('name', name)
    .eq('password', password)
    .single();

  if (error || !data) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Invalid credentials' }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Login successful', profile: data }),
  };
};
