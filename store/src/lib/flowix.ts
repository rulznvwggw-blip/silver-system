const FLOWIX_BASE_URL = process.env.FLOWIX_BASE_URL || 'https://flowix.web.id/api/v1';
const FLOWIX_API_KEY = process.env.FLOWIX_API_KEY || 'sk-e4205e73-1eebcf3dab17-55fb83b7b4ad';
const FLOWIX_MERCHANT_ID = process.env.FLOWIX_MERCHANT_ID || 'MID-FAR3217';

export interface FlowixDepositResult {
  reff_id: string;
  pay_id: string;
  amount_request: number;
  amount_total: number;
  fee: number;
  status: string;
  qr_image?: string;
  qr_string?: string;
  pay_url?: string;
  expired_at?: string;
}

export class FlowixStoreService {
  private static getHeaders() {
    return {
      'Content-Type': 'application/json',
      'api_key': FLOWIX_API_KEY,
      'merchant_id': FLOWIX_MERCHANT_ID,
    };
  }

  static async createDeposit(amount: number, methodCode = 'QRIS'): Promise<FlowixDepositResult | null> {
    try {
      const res = await fetch(`${FLOWIX_BASE_URL}/deposit`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          amount,
          method_code: methodCode,
          fee_by_customer: true,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        return json.data as FlowixDepositResult;
      }
      console.warn('Flowix deposit creation returned non-success:', json);
      return null;
    } catch (err) {
      console.error('Flowix create deposit error:', err);
      return null;
    }
  }

  static async checkDeposit(reffId: string): Promise<any> {
    try {
      const res = await fetch(`${FLOWIX_BASE_URL}/deposit/${encodeURIComponent(reffId)}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      return await res.json();
    } catch (err) {
      console.error('Flowix check deposit error:', err);
      return null;
    }
  }
}
