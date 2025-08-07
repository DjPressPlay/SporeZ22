//login-profile.js//
// netlify/functions/login-profile.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
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

    // Query profiles table for matching name & password
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('name', name)
      .eq('password', password)
      .limit(1);

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }

    if (!data || data.length === 0) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid name or password' }),
      };
    }

    // Successful login
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Login successful',
        profile: data[0],
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
