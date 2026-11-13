import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Detect whether Supabase is actually configured with valid non-placeholder keys
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project') &&
  supabaseAnonKey.length > 20
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Authentication Methods
 */
export async function signUpWithEmail(email, password, fullName = '') {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured (Demo Mode). Please configure credentials in .env.');
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  if (error) throw error;
  return data;
}

export async function signInWithEmail(email, password) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured (Demo Mode). Please configure credentials in .env.');
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOutUser() {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  if (!isSupabaseConfigured) return null;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (err) {
    console.warn('Could not retrieve current Supabase user:', err);
    return null;
  }
}

export function subscribeToAuthChanges(callback) {
  if (!isSupabaseConfigured) {
    // In demo mode, invoke immediately with null user
    callback(null, null);
    return { data: { subscription: { unsubscribe: () => {} } } };
  }
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session?.user || null);
  });
}

/**
 * Opt-In Report History Methods (Enforces RLS)
 *
 * PRIVACY SPECIFICATION:
 * - We NEVER store raw PDF bytes, image binary files, or raw unredacted OCR text.
 * - Only the sanitized, structured educational summary and biomarker list are stored.
 */
export async function saveReportToHistory(user, report) {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      demoMode: true,
      message: 'Demo Mode: Supabase credentials are not configured. Data cannot be saved to the database.',
    };
  }

  if (!user || !user.id) {
    throw new Error('You must be signed in to save reports to your history.');
  }

  const payload = {
    user_id: user.id,
    title: report.title || 'Laboratory Report',
    report_type: report.category || report.title || 'Diagnostic Report',
    overall_status: report.overallStatus || 'normal',
    summary: report.summary || '',
    key_findings: report.keyFindings || [],
    metrics: (report.metrics || []).map((m) => ({
      name: m.name,
      value: m.value,
      unit: m.unit || '',
      standardRange: m.standardRange || null,
      status: m.status || 'normal',
      category: m.category || 'Biomarker',
      simpleExplanation: m.simpleExplanation || '',
      sourceExtractedFact: m.sourceExtractedFact || '',
      note: m.note || null,
    })),
    questions_for_doctor: report.questionsForDoctor || [],
    glossary: report.glossary || [],
  };

  const { data, error } = await supabase
    .from('saved_reports')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return { success: true, data };
}

export async function fetchUserReports(userId) {
  if (!isSupabaseConfigured) {
    return {
      demoMode: true,
      reports: [],
      message: 'Supabase credentials are not configured. Running in Demo Mode.',
    };
  }

  if (!userId) return { demoMode: false, reports: [] };

  const { data, error } = await supabase
    .from('saved_reports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return { demoMode: false, reports: data || [] };
}

export async function deleteReportFromHistory(reportId, userId) {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      demoMode: true,
      message: 'Cannot delete in Demo Mode.',
    };
  }

  const { error } = await supabase
    .from('saved_reports')
    .delete()
    .eq('id', reportId)
    .eq('user_id', userId);

  if (error) throw error;
  return { success: true };
}
