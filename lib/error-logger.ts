import { supabase } from '@/lib/supabase';

export async function logError(error: unknown, context?: Record<string, unknown>) {
  try {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    // In dev, we already have console.error
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    await supabase.from('error_logs').insert({
      message: errorMessage,
      stack: errorStack,
      context: context,
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      user_agent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
    });
  } catch (e) {
    // Failsafe
    console.error('Failed to log error to Supabase', e);
  }
}
