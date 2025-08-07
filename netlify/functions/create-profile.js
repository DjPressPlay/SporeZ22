//create-profile.js//
// create-profile.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Service role key for insert permissions
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

    // Insert new profile, return inserted row(s)
    const { data, error } = await supabase
      .from('profiles')
      .insert([{ name, password }])
      .select(); // Make sure data is returned after insert

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Profile was created but no data returned' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Profile created',
        profile: {
          id: data[0].id,
          name: data[0].name,
          // You can add more profile fields here if needed
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

