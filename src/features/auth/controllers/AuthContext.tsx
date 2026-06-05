import React, { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import * as authService from '../services/auth.service';
import { AuthContext } from './auth-context';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = authService.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === 'SIGNED_IN') {
        toast({
          title: 'Bem-vindo!',
          description: 'Login realizado com sucesso.',
        });
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: 'Desconectado',
          description: 'Você foi desconectado com sucesso.',
        });
      }
    });

    // THEN check for existing session
    authService.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await authService.signUpWithEmail(email, password, fullName);

      if (error) {
        let message = 'Erro ao criar conta';
        if (error.message.includes('already registered')) {
          message = 'Este e-mail já está cadastrado';
        } else if (error.message.includes('Password should be')) {
          message = 'A senha deve ter pelo menos 6 caracteres';
        } else if (error.message.includes('Invalid email')) {
          message = 'E-mail inválido';
        }

        toast({
          title: 'Erro no cadastro',
          description: message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Conta criada!',
          description: 'Verifique seu e-mail para confirmar a conta.',
        });
      }

      return { error };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await authService.signInWithEmail(email, password);

      if (error) {
        let message = 'Erro ao fazer login';
        if (error.message.includes('Invalid login credentials')) {
          message = 'E-mail ou senha incorretos';
        } else if (error.message.includes('Email not confirmed')) {
          message = 'Confirme seu e-mail antes de fazer login';
        }

        toast({
          title: 'Erro no login',
          description: message,
          variant: 'destructive',
        });
      }

      return { error };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await authService.signOut();
      if (error) {
        toast({
          title: 'Erro',
          description: 'Erro ao desconectar',
          variant: 'destructive',
        });
      }
      return { error };
    } catch (error) {
      console.error('Error signing out:', error);
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
