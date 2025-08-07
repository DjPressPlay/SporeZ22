//login-profile.js//

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing request body' }),
      };
    }

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
      body: JSON.stringify({
        message: 'Login successful',
        profile: {
          id: data.id,
          name: data.name,
          // You can include more fields if needed, just avoid sensitive ones
        },
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Unexpected server error',
        detail: err.message,
      }),
    };
  }
};
