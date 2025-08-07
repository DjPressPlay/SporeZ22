//login-profile.js//
// netlify/functions/login-profile.js
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

    const { name } = JSON.parse(event.body);

    if (!name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Name is required' }),
      };
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('name', name)
      .single(); // Get a single profile match

    if (error || !data) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Profile not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Profile loaded',
        profile: {
          id: data.id,
          name: data.name,
          // Add more fields if needed
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

