"use client";

import { useEffect, useState } from 'react';
import { db } from '@utils/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from 'lucide-react';

type Message = {
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image';
};

type Chat = {
  id: string;
  clientName: string;
  messages: Message[];
};

type GarageChatProps = {
  garageId: string;
};

export default function GarageChat({ garageId }: GarageChatProps) {
  const [conversations, setConversations] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState<string>('');

  useEffect(() => {
    if (!garageId) return;
    const chatsQuery = query(collection(db, 'chats'), where('garageId', '==', garageId));
    const unsubscribe = onSnapshot(chatsQuery, (snapshot) => {
      const chatsData: Chat[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chat));
      setConversations(chatsData);
    });

    return () => unsubscribe();
  }, [garageId]);

  useEffect(() => {
    if (selectedChatId) {
      const chatDocRef = doc(db, 'chats', selectedChatId);
      const unsubscribe = onSnapshot(chatDocRef, (doc) => {
        if (doc.exists()) {
          setSelectedChat({ id: doc.id, ...doc.data() } as Chat);
        }
      });

      return () => unsubscribe();
    }
  }, [selectedChatId]);

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChatId) return;

    try {
      const chatDocRef = doc(db, 'chats', selectedChatId);
      await updateDoc(chatDocRef, {
        messages: arrayUnion({
          senderId: garageId,
          content: newMessage,
          timestamp: new Date().toISOString(),
          type: 'text',
        }),
      });
      setNewMessage('');
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
    }
  };

  const handleCloseChat = () => {
    setSelectedChatId(null);
    setSelectedChat(null);
  };

  return (
    <div className="flex space-x-8 p-4">
      <div className="w-1/3 border-r p-4">
        <h2 className="text-xl font-bold mb-4">Conversations</h2>
        {conversations.length === 0 ? (
          <p>Aucune conversation trouvée.</p>
        ) : (
          <ul className="space-y-2">
            {conversations.map((chat) => (
              <li
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className={`p-2 cursor-pointer hover:bg-gray-200 ${selectedChatId === chat.id ? 'bg-gray-300' : ''}`}
              >
                {chat.clientName}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="w-2/3 p-4">
        {selectedChat ? (
          <Card className="w-full p-4 relative">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Chat avec {selectedChat.clientName}</span>
                <button onClick={handleCloseChat} className="text-gray-500 hover:text-red-500">
                  <X className="h-5 w-5" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 overflow-y-auto border p-2 mb-4">
                {selectedChat.messages.map((message, index) => (
                  <div key={index} className={`mb-2 ${message.senderId === garageId ? 'text-right' : 'text-left'}`}>
                    <p className={`inline-block px-4 py-2 rounded-md ${message.senderId === garageId ? 'bg-blue-200' : 'bg-gray-200'}`}>
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
                />
                <Button onClick={handleSendMessage}>Envoyer</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <p>Sélectionnez une conversation pour commencer à discuter.</p>
        )}
      </div>
    </div>
  );
}
