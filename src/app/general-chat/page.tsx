import GeneralChatPage from '@/components/GeneralChatPage';
import { ChatMessage, ChatResponse } from '@/types/api';
import { sendChatMessage } from '@/api/chat';

export default function GeneralChat() {
  return <GeneralChatPage />;
}