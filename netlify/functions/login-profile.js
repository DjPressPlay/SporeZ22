//login-profile.js//
// netlify/functions/login-profile.js

const { createClient } = require('@supabase/supabase-js');

// ⛔ Make sure these are set in your Netlify environment!
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event) => {
  try {
    // 🔐 Validate event body exists
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing request body' }),
      };
    }

    const { name, password } = JSON.parse(event.body);

    // ❗ Validate fields
    if (!name || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Name and password are required' }),
      };
    }

    // 🔎 Query the 'profiles' table
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name') // ✨ Only select what you need
      .eq('name', name)
      .eq('password', password)
      .single();

    // ❌ Handle bad login
    if (error || !data) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid credentials' }),
      };
    }

    // ✅ Return safe user profile info
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Login successful',
        profile: data,
      }),
    };

  } catch (err) {
    console.error('Login error:', err); // 🐞 Helpful in Netlify logs
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Unexpected server error',
        detail: err.message,
      }),
    };
  }
};
