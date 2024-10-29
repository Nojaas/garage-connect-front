export default function NotificationMessage({ message }: NotificationMessageProps) {
  if (!message) return null;

  return (
    <div
      className={`p-3 rounded ${
        message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}
    >
      {message.content}
    </div>
  );
}

type NotificationMessageProps = {
  message: { type: 'success' | 'error'; content: string } | null;
};
