import { type FormEvent, useMemo, useState } from 'react'
import { CircleDot, Search, Send } from 'lucide-react'
import { DemoHeader } from '../DemoPageParts'
import '../DemoPages.css'

type Message = { id: number; author: string; body: string; time: string; own?: boolean }
type Conversation = { id: number; person: string; client: string; subject: string; preview: string; time: string; unread: boolean; messages: Message[] }
const seed: Conversation[] = [
  { id: 1, person: 'John Smith', client: 'Acme Corporation', subject: 'New starter equipment', preview: 'Thanks, the laptop spec looks good.', time: '10:18 AM', unread: false, messages: [{ id: 1, author: 'John Smith', body: 'Thanks, the laptop spec looks good. Can we schedule delivery for Monday?', time: '10:18 AM' }] },
  { id: 2, person: 'Priya Nair', client: 'Northstar Technologies', subject: 'Server maintenance window', preview: 'Can you confirm tonight’s window?', time: '9:46 AM', unread: true, messages: [{ id: 1, author: 'Priya Nair', body: 'Can you confirm tonight’s maintenance window is still going ahead?', time: '9:46 AM' }] },
  { id: 3, person: 'Mark Cruz', client: 'Apex Builders', subject: 'License renewal', preview: 'We approved the Business Premium renewal.', time: 'Yesterday', unread: true, messages: [{ id: 1, author: 'Mark Cruz', body: 'We approved the Business Premium renewal. Please proceed with the demo record.', time: 'Yesterday' }] },
]

export function MessagesPage() {
  const [conversations, setConversations] = useState(seed)
  const [selectedId, setSelectedId] = useState(1)
  const [search, setSearch] = useState('')
  const [reply, setReply] = useState('')
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const selected = conversations.find((item) => item.id === selectedId) ?? conversations[0]
  const visible = useMemo(() => conversations.filter((item) => `${item.person} ${item.client} ${item.subject}`.toLowerCase().includes(search.toLowerCase())), [conversations, search])
  const unread = conversations.filter((item) => item.unread).length
  const openConversation = (id: number) => { setSelectedId(id); setConversations((current) => current.map((item) => item.id === id ? { ...item, unread: false } : item)); setError(''); setFeedback('') }
  const sendReply = (event: FormEvent) => { event.preventDefault(); const body = reply.trim(); if (!body) { setError('Enter a reply before sending.'); setFeedback(''); return } setConversations((current) => current.map((item) => item.id === selectedId ? { ...item, preview: body, time: 'Now', messages: [...item.messages, { id: item.messages.length + 1, author: 'You', body, time: 'Now', own: true }] } : item)); setReply(''); setError(''); setFeedback('Demo reply added · not sent externally') }

  return <div className="demo-page"><DemoHeader eyebrow="Client communications" title="Messages" description="Keep service conversations visible alongside the operational work they affect." />
    <section className="messages-shell" aria-label="Demo inbox"><aside className="conversation-list" aria-label="Conversations"><div className="conversation-heading"><div><h2>Inbox</h2><span aria-live="polite">{unread} unread</span></div><label><span className="sr-only">Search conversations</span><Search aria-hidden="true" /><input type="search" aria-label="Search conversations" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search messages" /></label></div><div className="conversation-items">{visible.map((conversation) => <button type="button" key={conversation.id} className={conversation.id === selectedId ? 'is-selected' : ''} aria-label={`Open conversation with ${conversation.person}: ${conversation.subject}`} onClick={() => openConversation(conversation.id)}><span className="conversation-avatar" aria-hidden="true">{conversation.person.split(' ').map((part) => part[0]).join('')}</span><span><strong>{conversation.person}{conversation.unread && <CircleDot aria-label="Unread" />}</strong><small>{conversation.client}</small><b>{conversation.subject}</b><em>{conversation.preview}</em></span><time>{conversation.time}</time></button>)}</div></aside>
      <article className="message-thread" aria-labelledby="thread-title"><header><div><span className="eyebrow">{selected.client}</span><h2 id="thread-title">{selected.subject}</h2><p>Conversation with {selected.person}</p></div><span className="demo-status is-neutral">Demo conversation</span></header><div className="message-history">{selected.messages.map((message) => <div key={message.id} className={`message-bubble ${message.own ? 'is-own' : ''}`}><strong>{message.author}</strong><p>{message.body}</p><time>{message.time}</time></div>)}</div><form className="reply-composer" onSubmit={sendReply}><label htmlFor="reply-message">Reply message</label><textarea id="reply-message" value={reply} aria-invalid={Boolean(error)} aria-describedby={error ? 'reply-error' : undefined} onChange={(event) => setReply(event.target.value)} placeholder="Write a simulated reply…" />{error && <p id="reply-error" className="field-error" role="alert">{error}</p>}<div><span>Demo only · replies reset on refresh</span><button className="demo-primary-button" type="submit" aria-label="Send demo reply"><Send size={15} aria-hidden="true" />Send demo reply</button></div>{feedback && <p className="demo-feedback" role="status">{feedback}</p>}</form></article>
    </section></div>
}
