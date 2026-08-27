import { env } from '../config/env.js';

export interface FlowixDepositData {
  reff_id: string;
  pay_id: string;
  payment_gateway?: string;
  type?: string;
  method_code: string;
  provider_method_code?: string;
  method_name?: string;
  amount_request: number;
  amount_total: number;
  fee: number;
  amount_received: number;
  fee_by_customer: boolean;
  status: 'pending' | 'success' | 'failed' | 'expired' | 'canceled' | string;
  qr_image?: string;
  qr_string?: string;
  pay_url?: string;
  pay_code?: string | null;
  expired_at?: string;
  paid_at?: string | null;
  date?: string;
  instructions?: string | { title: string; steps: string[] }[];
}

export interface FlowixResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
  meta?: {
    ip_client?: string;
    server_time?: string;
    api_version?: string;
  };
}

export const flowixService = {
  getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'api_key': env.flowixApiKey,
      'merchant_id': env.flowixMerchantId,
    };
  },

  async createDeposit(params: {
    amount: number;
    method_code?: string;
    fee_by_customer?: boolean;
  }): Promise<FlowixDepositData> {
    const url = `${env.flowixBaseUrl}/deposit`;
    const payload = {
      amount: params.amount,
      method_code: params.method_code || 'QRIS',
      fee_by_customer: params.fee_by_customer !== undefined ? params.fee_by_customer : true,
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await res.json() as FlowixResponse<FlowixDepositData>;
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Gagal membuat tagihan deposit di Flowix');
    }

    return data.data;
  },

  async checkDeposit(reffId: string): Promise<FlowixDepositData> {
    const url = `${env.flowixBaseUrl}/deposit/${encodeURIComponent(reffId)}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    const data = await res.json() as FlowixResponse<FlowixDepositData>;
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Gagal memeriksa status deposit di Flowix');
    }

    return data.data;
  },

  async cancelDeposit(reffId: string): Promise<boolean> {
    const url = `${env.flowixBaseUrl}/deposit/${encodeURIComponent(reffId)}/cancel`;
    const res = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({}),
    });

    const data = await res.json() as FlowixResponse<any>;
    return data.success;
  },

  async getDepositMethods(): Promise<any[]> {
    const url = `${env.flowixBaseUrl}/deposit`;
    const res = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    const data = await res.json() as FlowixResponse<any[]>;
    return data.data || [];
  },

  async getProfile(): Promise<any> {
    const url = `${env.flowixBaseUrl}/profile`;
    const res = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    const data = await res.json() as FlowixResponse<any>;
    return data.data;
  },
};
