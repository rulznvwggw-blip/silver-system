const PTERO_URL = process.env.PTERODACTYL_URL || 'http://localhost:8080';
const PTERO_KEY = process.env.PTERODACTYL_API_KEY || 'AdgM9Jbg92evbI3mcSdQ1Jm89fge8N8vUFnTXS4kUgRGiOG9';
const PANEL_PUBLIC_URL = process.env.NEXT_PUBLIC_PANEL_URL || 'https://ptero.rullzyestorepremium.my.id';

interface CreateUserData {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password?: string;
}

interface CreateServerData {
  name: string;
  userId: number;
  nestId: number;
  eggId: number;
  dockerImage: string;
  startup: string;
  environment: Record<string, string | number>;
  limits: {
    memory: number;
    swap: number;
    disk: number;
    io: number;
    cpu: number;
  };
  featureLimits: {
    databases: number;
    allocations: number;
    backups: number;
  };
  nodeId?: number;
}

export class PterodactylService {
  private static async request<T>(endpoint: string, method: string = 'GET', body?: unknown): Promise<T> {
    const url = `${PTERO_URL}/api/application${endpoint}`;
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${PTERO_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Pterodactyl API Error [${response.status}]: ${errorText}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  static async findUserByEmail(email: string) {
    try {
      const res = await this.request<{ data: Array<{ attributes: { id: number; email: string; username: string } }> }>(
        `/users?filter[email]=${encodeURIComponent(email)}`
      );
      if (res.data && res.data.length > 0) {
        return res.data[0].attributes;
      }
      return null;
    } catch {
      return null;
    }
  }

  static async createUser(data: CreateUserData) {
    const cleanUsername = (data.username || `user_${Math.random().toString(36).substring(2, 7)}`).replace(/[^a-zA-Z0-9_]/g, '').toLowerCase().slice(0, 16);
    const userPassword = data.password || `Rullzye_${Math.random().toString(36).substring(2, 8)}!1`;

    const existing = await this.findUserByEmail(data.email);
    if (existing) {
      // Sync/update existing user password in Pterodactyl so it matches the generated password
      try {
        await this.request(
          `/users/${existing.id}`,
          'PATCH',
          {
            email: existing.email,
            username: existing.username,
            first_name: data.firstName || 'Customer',
            last_name: data.lastName || 'RullzyeStore',
            password: userPassword,
          }
        );
      } catch (patchErr) {
        console.warn('Failed to update existing user password:', patchErr);
      }
      return {
        ...existing,
        tempPassword: userPassword,
      };
    }

    const res = await this.request<{ attributes: { id: number; email: string; username: string } }>(
      '/users',
      'POST',
      {
        email: data.email,
        username: cleanUsername,
        first_name: data.firstName || 'Customer',
        last_name: data.lastName || 'RullzyeStore',
        password: userPassword,
      }
    );

    return {
      ...res.attributes,
      tempPassword: userPassword,
    };
  }

  static async getFirstAvailableAllocation(nodeId: number = 1) {
    const res = await this.request<{ data: Array<{ attributes: { id: number; ip: string; port: number; assigned: boolean } }> }>(
      `/nodes/${nodeId}/allocations?per_page=100`
    );

    const available = res.data.find(a => !a.attributes.assigned);
    if (!available) {
      if (res.data.length > 0) return res.data[0].attributes;
      throw new Error('No available port allocations found on this Node.');
    }
    return available.attributes;
  }

  static async createServer(data: CreateServerData) {
    const nodeId = data.nodeId || 1;
    const allocation = await this.getFirstAvailableAllocation(nodeId);

    const payload = {
      name: data.name,
      user: data.userId,
      egg: data.eggId,
      docker_image: data.dockerImage,
      startup: data.startup,
      environment: data.environment,
      limits: data.limits,
      feature_limits: data.featureLimits,
      allocation: {
        default: allocation.id,
      },
      start_on_completion: false,
    };

    const res = await this.request<{ attributes: { id: number; uuid: string; identifier: string; name: string } }>(
      '/servers',
      'POST',
      payload
    );

    return {
      server: res.attributes,
      allocation,
      panelUrl: PANEL_PUBLIC_URL,
    };
  }

  static async suspendServer(serverId: number) {
    return this.request(`/servers/${serverId}/suspend`, 'POST');
  }

  static async unsuspendServer(serverId: number) {
    return this.request(`/servers/${serverId}/unsuspend`, 'POST');
  }

  static async deleteServer(serverId: number) {
    return this.request(`/servers/${serverId}`, 'DELETE');
  }
}
