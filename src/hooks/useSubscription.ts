import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import axios from 'axios';

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSub() {
      if (!user) {
        setSubscription(null);
        setLoading(false);
        return;
      }
      try {
        const { data } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();
          
        setSubscription(data || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchSub();
  }, [user]);

  const isPremium = !!subscription && new Date(subscription.expiry_date) > new Date();
  
  const daysLeft = subscription 
    ? Math.max(0, Math.ceil((new Date(subscription.expiry_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24)))
    : 0;
    
  const canPay = !!user;

  const handlePay = async (paymentMethod: string, customer: any) => {
    if (!user) throw new Error('Must be logged in');
    
    const response = await axios.post('/api/subscription/pay', {
      userId: user.id,
      paymentMethod,
      customer
    });
    
    return response.data;
  };

  return { subscription, isPremium, daysLeft, loading, canPay, handlePay };
}
