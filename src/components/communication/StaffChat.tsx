import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useSecurity } from '@/components/auth/SecurityProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Phone, Users, MessageCircle, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  user_id: string;
  user_name: string;
  user_role: string;
  created_at: string;
  is_urgent: boolean;
}

interface StaffChatProps {
  className?: string;
}

export function StaffChat({ className }: StaffChatProps) {
  const { user, userRole, hasPermission } = useSecurity();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasPermission('chat_access')) return;

    // Fetch initial messages
    fetchMessages();

    // Set up real-time subscription for messages
    const messageChannel = supabase
      .channel('staff_messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'staff_messages'
      }, (payload) => {
        const newMessage = payload.new as Message;
        setMessages(prev => [...prev, newMessage]);
        scrollToBottom();
      })
      .subscribe();

    // Set up presence for online users
    const presenceChannel = supabase
      .channel('online_users')
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const users = Object.values(state).flat();
        setOnlineUsers(users as any[]);
      })
      .subscribe();

    // Join presence
    if (user) {
      presenceChannel.track({
        user_id: user.id,
        user_name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        user_role: userRole,
        online_at: new Date().toISOString(),
      });
    }

    return () => {
      messageChannel.unsubscribe();
      presenceChannel.unsubscribe();
    };
  }, [user, userRole, hasPermission]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('staff_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(100);

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(data || []);
      scrollToBottom();
    } catch (error) {
      console.error('Error in fetchMessages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('staff_messages')
        .insert({
          content: newMessage.trim(),
          user_id: user.id,
          user_name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          user_role: userRole,
          is_urgent: isUrgent,
        });

      if (error) throw error;

      setNewMessage('');
      setIsUrgent(false);
      
      if (isUrgent) {
        toast({
          title: "Urgent Message Sent",
          description: "Your urgent message has been sent to all staff.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-danger';
      case 'manager': return 'text-warning';
      case 'staff': return 'text-success';
      case 'bartender': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!hasPermission('chat_access')) {
    return null;
  }

  return (
    <Card className={`flex flex-col ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Staff Chat
          </CardTitle>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <Badge variant="outline" className="text-xs">
              {onlineUsers.length} online
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 p-4 pt-0 space-y-4">
        {/* Messages */}
        <ScrollArea className="flex-1 h-80 pr-4">
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.user_id === user?.id ? 'flex-row-reverse' : ''
                }`}
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className={getRoleColor(message.user_role)}>
                    {message.user_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`flex flex-col max-w-[70%] ${
                  message.user_id === user?.id ? 'items-end' : ''
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">
                      {message.user_name}
                    </span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getRoleColor(message.user_role)}`}
                    >
                      {message.user_role}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatTime(message.created_at)}
                    </div>
                  </div>
                  
                  <div
                    className={`rounded-lg px-3 py-2 text-sm ${
                      message.user_id === user?.id
                        ? 'bg-primary text-primary-foreground'
                        : message.is_urgent
                        ? 'bg-danger/10 border border-danger/20 text-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {message.is_urgent && (
                      <Badge variant="destructive" className="text-xs mb-1 block w-fit">
                        URGENT
                      </Badge>
                    )}
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1"
            />
            <Button onClick={sendMessage} size="sm" disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-danger">Mark as urgent</span>
            </label>
            
            {(userRole === 'admin' || userRole === 'manager') && (
              <Button variant="outline" size="sm" className="text-xs">
                <Phone className="h-3 w-3 mr-1" />
                Call All
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}