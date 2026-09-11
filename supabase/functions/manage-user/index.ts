import { createClient } from "npm:@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  // 1. Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
      throw new Error('Server configuration error: missing environment variables.')
    }

    // 2. Validate JWT/session of the caller
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized: No authorization header' }), { 
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    // Create a Supabase client using the caller's auth header
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    // Get the user from the token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), { 
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    // 3. Ensure the caller has 'super_admin' role
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'super_admin') {
      return new Response(JSON.stringify({ error: 'Forbidden: Requires super_admin role' }), { 
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    // 4. Parse request body
    const { targetUserId, action } = await req.json()
    if (!targetUserId || !action) {
      return new Response(JSON.stringify({ error: 'Bad Request: Missing targetUserId or action' }), { 
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    // 5. Create Supabase Admin client for elevated operations
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

    if (action === 'approve') {
      // Approve action: Update public.profiles AND set email_confirm in auth.users
      const { error: profileUpdateError } = await supabaseAdmin
        .from('profiles')
        .update({ status: 'approved' })
        .eq('id', targetUserId)

      if (profileUpdateError) {
        throw new Error(`Failed to update profile status: ${profileUpdateError.message}`)
      }

      const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
        targetUserId,
        { email_confirm: true }
      )

      if (authUpdateError) {
        throw new Error(`Failed to confirm email via Admin API: ${authUpdateError.message}`)
      }

      return new Response(JSON.stringify({ success: true, message: 'User approved and email confirmed successfully' }), { 
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })

    } else if (action === 'reject') {
      // Reject action: Only update public.profiles
      const { error: profileUpdateError } = await supabaseAdmin
        .from('profiles')
        .update({ status: 'rejected' })
        .eq('id', targetUserId)

      if (profileUpdateError) {
        throw new Error(`Failed to reject user profile: ${profileUpdateError.message}`)
      }

      return new Response(JSON.stringify({ success: true, message: 'User rejected successfully' }), { 
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })

    } else if (action === 'delete-self') {
      // Delete own account — only the logged-in user can delete themselves
      // Block super_admin from deleting themselves
      if (profile?.role === 'super_admin') {
        return new Response(JSON.stringify({ error: 'Forbidden: super_admin cannot delete their own account' }), { 
          status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        })
      }
      
      // Ensure targetUserId matches the authenticated user
      if (targetUserId !== user.id) {
        return new Response(JSON.stringify({ error: 'Forbidden: can only delete own account' }), { 
          status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        })
      }
      
      // Delete from profiles table first (cascade or manual)
      const { error: profileDeleteError } = await supabaseAdmin.from('profiles').delete().eq('id', targetUserId)
      
      if (profileDeleteError) {
        throw new Error(`Failed to delete profile: ${profileDeleteError.message}`)
      }

      // Delete from auth.users
      const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(targetUserId)

      if (authDeleteError) {
        throw new Error(`Failed to delete auth user: ${authDeleteError.message}`)
      }
      
      return new Response(JSON.stringify({ success: true, message: 'Account deleted successfully' }), { 
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })

    } else {
      return new Response(JSON.stringify({ error: 'Bad Request: Invalid action' }), { 
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

  } catch (err) {
    const error = err as Error;
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { 
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }
})
