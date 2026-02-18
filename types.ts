
export enum HandshakeStatus {
  IDLE = 'IDLE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  ERROR = 'ERROR'
}

export interface Distribution {
  Youth_Wallet: { address: string; amount: number };
  Bank_Escrow: { address: string; amount: number };
  District_Trust: { address: string; amount: number };
}

export interface DataShard {
  id: string;
  taskId: string;
  rawPayload: string;
  integrityHash: string;
  totalValue: number;
  distribution: Distribution;
  timestamp: string;
  workerWallet: string;
}

export interface SystemStats {
  totalProcessed: number;
  totalWealthGenerated: number;
  uptime: number;
  gpuLoad: number;
}
