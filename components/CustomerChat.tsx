"use client";

import { useEffect, useState } from 'react';
import { db } from '@utils/firebase';
import { useAuth } from '@contexts/AuthContext';
import { doc, onSnapshot, setDoc, arrayUnion } from 'firebase/firestore';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomerChat({ garageId }: { garageId: string }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<{ senderId: string; content: string; timestamp: string }[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [chatId, setChatId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const currentChatId = `${user.uid}_${garageId}`;
    setChatId(currentChatId);

    const chatDocRef = doc(db, 'chats', currentChatId);

    const unsubscribe = onSnapshot(chatDocRef, (doc) => {
      if (doc.exists()) {
        setMessages(doc.data().messages || []);
      }
    });

    return () => unsubscribe();
  }, [user, garageId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !chatId) return;

    try {
      const chatDocRef = doc(db, 'chats', chatId);
      await setDoc(
        chatDocRef,
        {
          clientId: user.uid,
          clientName: user.email || 'Client',
          garageId: garageId,
          messages: arrayUnion({
            senderId: user.uid,
            content: newMessage,
            timestamp: new Date().toISOString(),
            type: 'text',
          }),
          createdAt: new Date(),
        },
        { merge: true }
      );

      setNewMessage('');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message :', error);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto p-4">
      <CardHeader>
        <CardTitle>Chat avec votre garage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 overflow-y-auto border p-2 mb-4">
          {messages.map((message, index) => (
            <div key={index} className={`mb-2 ${message.senderId === user?.uid ? 'text-right' : 'text-left'}`}>
              <p className={`inline-block px-4 py-2 rounded-md ${message.senderId === user?.uid ? 'bg-blue-200' : 'bg-gray-200'}`}>
                {message.content}
              </p>
              <span className="block text-xs text-gray-500 mt-1">
                {new Date(message.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Entrez votre message..."
            className="flex-grow"
          />
          <Button onClick={handleSendMessage}>Envoyer</Button>
        </div>
      </CardContent>
    </Card>
  );
}
