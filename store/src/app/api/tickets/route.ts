import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { Ticket } from '@/types';

export async function GET() {
  const tickets = store.getTickets();
  return NextResponse.json({ success: true, data: tickets });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ticketId, message, sender = 'customer', senderName = 'Customer', subject, category = 'general', priority = 'medium', customerEmail, customerName } = body;

    // Replying to existing ticket
    if (ticketId) {
      if (!message) {
        return NextResponse.json({ success: false, message: 'Pesan tidak boleh kosong' }, { status: 400 });
      }
      const updatedTicket = store.addTicketMessage(ticketId, { sender, senderName, message });
      return NextResponse.json({ success: true, data: updatedTicket });
    }

    // Creating new ticket
    if (!subject || !message || !customerEmail) {
      return NextResponse.json({ success: false, message: 'Subjek, pesan, dan email wajib diisi' }, { status: 400 });
    }

    const newTicket: Ticket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-${Math.floor(Math.random() * 9000) + 1000}`,
      customerEmail,
      customerName: customerName || customerEmail.split('@')[0],
      subject,
      category,
      priority,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'customer',
          senderName: customerName || 'Customer',
          message,
          timestamp: new Date().toISOString(),
        }
      ]
    };

    store.createTicket(newTicket);
    return NextResponse.json({ success: true, data: newTicket });
  } catch {
    return NextResponse.json({ success: false, message: 'Gagal memproses tiket support' }, { status: 500 });
  }
}
