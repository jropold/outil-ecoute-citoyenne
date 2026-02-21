import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Verify caller is admin
    const authHeader = req.headers.get('Authorization')!;
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    if (authError || !user) throw new Error('Non autorisé');

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      throw new Error('Seul un admin peut créer des comptes');
    }

    const { email, password, full_name, role, can_create_visits } = await req.json();

    if (!email || !password) {
      throw new Error('Email et mot de passe requis');
    }

    // Create the auth user with email confirmed
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, role },
    });

    if (error) throw error;

    // Update the profile with the correct fields
    if (data.user) {
      await supabaseAdmin
        .from('profiles')
        .update({
          role: role || 'benevole',
          full_name: full_name || '',
          is_active: true,
          can_create_visits: can_create_visits ?? false,
        })
        .eq('id', data.user.id);
    }

    return new Response(JSON.stringify({ success: true, user_id: data.user?.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
