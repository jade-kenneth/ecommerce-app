'use client';

import Image from 'next/image';
import { FormEvent, useRef, useState } from 'react';
import { useGlobalStore } from '~/hooks/useGlobalStore';
import { useFeatureFlagContext } from '~/providers';
import { getSession } from '~/providers/AuthProvider/service';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type SupportAnswerResponse = {
  outputText?: string;
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content: 'Hello! I am your support assistant. How can I help you today?',
  },
];

export function SupportChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const listRef = useRef<HTMLDivElement | null>(null);
  const future = useFeatureFlagContext();
  const auth = useGlobalStore((state) => state.authenticate);
  const appendMessage = (message: ChatMessage) => {
    setMessages((prev) => {
      const next = [...prev, message];
      requestAnimationFrame(() => {
        const node = listRef.current;
        if (node) {
          node.scrollTop = node.scrollHeight;
        }
      });
      return next;
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const prompt = input.trim();
    if (!prompt || isLoading) {
      return;
    }

    setInput('');
    appendMessage({
      id: `user-${Date.now()}`,
      role: 'user',
      content: prompt,
    });

    if (!process.env.NEXT_PUBLIC_BASE_URL_PORTAL_API) {
      appendMessage({
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: 'Support endpoint is not configured.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const session = await getSession();
      const authHeader =
        session.status === 'authenticated'
          ? `Bearer ${session.accessToken}`
          : undefined;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_PORTAL_API}/support/answer`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(authHeader && { Authorization: authHeader }),
            role: session.role || 'guest',
          },
          body: JSON.stringify({ prompt }),
        },
      );

      if (!response.ok) {
        throw new Error(`Support request failed (${response.status})`);
      }

      const data = (await response.json()) as SupportAnswerResponse;

      appendMessage({
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.outputText?.trim() || 'No response returned.',
      });
    } catch (error) {
      appendMessage({
        id: `assistant-error-${Date.now()}`,
        role: 'assistant',
        content:
          error instanceof Error
            ? error.message
            : 'Unable to reach support right now.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  if (!future.hydrated || !future.enabled) return null;
  return (
    <div className="fixed bottom-4 right-4 z-[1100] flex flex-col items-end">
      {isOpen ? (
        <section
          aria-label="Support chat"
          className="mb-7 flex h-[min(70vh,560px)] w-[min(92vw,360px)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
        >
          <header className="flex items-center justify-between border-b border-gray-200 bg-cyan-900 px-4 py-3 text-white">
            <h2 className="text-sm font-semibold">Support Assistant</h2>
            <button
              aria-label="Close support chat"
              className="rounded-md px-2 py-1 text-xs text-gray-200 hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              Close
            </button>
          </header>

          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-3"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-5 ${
                  message.role === 'assistant'
                    ? 'bg-white text-gray-900'
                    : 'ml-auto bg-cyan-900 text-white'
                }`}
              >
                {message.content}
              </div>
            ))}

            {isLoading ? (
              <div className="max-w-[85%] rounded-xl bg-white px-3 py-2 text-sm text-gray-500">
                I am thinking... <span className="animate-pulse">⏳</span>
              </div>
            ) : null}
          </div>

          <form
            className="flex items-center gap-2 border-t border-gray-200 p-3"
            onSubmit={onSubmit}
          >
            <input
              className="h-10 flex-1 rounded-full border border-gray-300 px-3 text-sm outline-none transition focus:border-gray-900"
              disabled={isLoading}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type your question..."
              value={input}
            />
            <button
              className="h-10 rounded-full bg-cyan-900 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
              disabled={isLoading || input.trim().length === 0}
              type="submit"
            >
              Send
            </button>
          </form>
        </section>
      ) : null}

      <div className="relative">
        <span className="pointer-events-none absolute -right-1 -top-4 rounded-full bg-cyan-500 px-2 py-0.5 text-[10px] font-semibold uppercase leading-none tracking-wide text-white shadow">
          Beta
        </span>
        <button
          aria-label="Open support chat"
          className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-transparent shadow-lg hover:shadow-xl"
          onClick={() => {
            if (auth.isAuthenticated) setIsOpen((value) => !value);
            else auth.setAuthDialogOpen(true);
          }}
          type="button"
        >
          <Image
            alt="Support assistant"
            className="h-full w-full object-cover"
            height={56}
            src="/assistant.png"
            width={56}
          />
        </button>
      </div>
    </div>
  );
}
