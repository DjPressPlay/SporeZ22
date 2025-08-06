//create-profile.js//
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for insert
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
    .insert([{ name, password }]);

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Profile created', profile: data[0] }),
  };
};
