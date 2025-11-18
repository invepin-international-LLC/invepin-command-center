import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useFaceEmbeddings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const enrollFace = useCallback(async (
    userId: string,
    organizationId: string,
    embedding: number[],
    confidence: number
  ) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('face_embeddings')
        .upsert({
          user_id: userId,
          organization_id: organizationId,
          embedding: embedding,
          enrollment_confidence: confidence,
          is_active: true,
        }, {
          onConflict: 'user_id,organization_id'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Face Enrolled',
        description: 'Your face has been successfully enrolled for clock in/out.',
      });

      return data;
    } catch (error) {
      console.error('Error enrolling face:', error);
      toast({
        title: 'Enrollment Failed',
        description: 'Failed to enroll face. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getOrganizationFaces = useCallback(async (organizationId: string) => {
    try {
      // First get face embeddings
      const { data: embeddings, error: embError } = await supabase
        .from('face_embeddings')
        .select('id, user_id, embedding, enrollment_confidence')
        .eq('organization_id', organizationId)
        .eq('is_active', true);

      if (embError) throw embError;

      // Then get profile data for each user
      const results = await Promise.all(
        (embeddings || []).map(async (emb) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, employee_id')
            .eq('id', emb.user_id)
            .single();

          // Parse embedding as number array
          let parsedEmbedding: number[] = [];
          if (Array.isArray(emb.embedding)) {
            parsedEmbedding = emb.embedding.map((v: any) => 
              typeof v === 'number' ? v : parseFloat(String(v)) || 0
            );
          }

          return {
            userId: emb.user_id,
            name: profile?.full_name || 'Unknown',
            employeeId: profile?.employee_id || '',
            embedding: parsedEmbedding,
          };
        })
      );

      return results;
    } catch (error) {
      console.error('Error fetching organization faces:', error);
      return [];
    }
  }, []);

  const getUserFaceEmbedding = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('face_embeddings')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user face embedding:', error);
      return null;
    }
  }, []);

  return {
    enrollFace,
    getOrganizationFaces,
    getUserFaceEmbedding,
    isLoading,
  };
};
