
import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Zap, 
  Database, 
  Wallet, 
  Building2, 
  Landmark,
  ChevronRight,
  BrainCircuit,
  Lock,
  Unlock,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { HandshakeStatus, DataShard, SystemStats } from './types';
import { POD_CONFIG, DIST_RATIOS, COLORS } from './constants';
import { WealthChart } from './components/WealthChart';
import { ShardStream } from './components/ShardStream';
import { generateSyntheticShard, getSystemReport } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<HandshakeStatus>(HandshakeStatus.IDLE);
  const [shards, setShards] = useState<DataShard[]>([]);
  const [stats, setStats] = useState<SystemStats>({
    totalProcessed: 0,
    totalWealthGenerated: 0,
    uptime: 0,
    gpuLoad: 0
  });
  const [aiReport, setAiReport] = useState<string>("Awaiting system initialization...");
  const [isProcessing, setIsProcessing] = useState(false);

  // Handshake logic
  const initiateHandshake = async () => {
    setStatus(HandshakeStatus.CONNECTING);
    // Simulate auth lag
    setTimeout(() => {
      setStatus(HandshakeStatus.ACTIVE);
      fetchAIReport();
    }, 2000);
  };

  const fetchAIReport = async () => {
    try {
      const report = await getSystemReport(stats);
      setAiReport(report);
    } catch (e) {
      console.error("AI Link Error", e);
    }
  };

  // Processing logic
  const processNextShard = useCallback(async () => {
    if (status !== HandshakeStatus.ACTIVE || isProcessing) return;
    setIsProcessing(true);

    try {
      const synthetic = await generateSyntheticShard(1);
      const data = synthetic[0];
      
      const totalValue = data.baseValue;
      const integrityHash = Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      const newShard: DataShard = {
        id: crypto.randomUUID(),
        taskId: data.taskId,
        rawPayload: data.rawPayload,
        integrityHash,
        totalValue,
        timestamp: new Date().toLocaleTimeString(),
        workerWallet: `0xYOUTH_${Math.floor(Math.random() * 1000)}`,
        distribution: {
          Youth_Wallet: { address: '0xYOUTH_WORKER_01', amount: totalValue * DIST_RATIOS.YOUTH },
          Bank_Escrow: { address: POD_CONFIG.bankEscrow, amount: totalValue * DIST_RATIOS.BANK },
          District_Trust: { address: POD_CONFIG.sovereignTrust, amount: totalValue * DIST_RATIOS.TRUST }
        }
      };

      setShards(prev => [newShard, ...prev].slice(0, 20));
      setStats(prev => ({
        ...prev,
        totalProcessed: prev.totalProcessed + 1,
        totalWealthGenerated: prev.totalWealthGenerated + totalValue,
        gpuLoad: 45 + Math.random() * 30
      }));
    } catch (error) {
      console.error("Processing error", error);
    } finally {
      setIsProcessing(false);
    }
  }, [status, isProcessing, stats]);

  // Uptime ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => ({ ...prev, uptime: prev.uptime + 1 }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans overflow-hidden cyber-grid relative">
      <div className="scanline"></div>
      
      {/* Top Header Bar */}
      <header className="border-b border-emerald-900/50 bg-black/80 backdrop-blur-md p-4 flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 p-2 rounded border border-emerald-500/30">
            <ShieldCheck className="text-emerald-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-emerald-400 font-mono">
              KINSYS <span className="text-white">USIO BRIDGE</span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Location: {POD_CONFIG.podId}</span>
              <div className={`h-1.5 w-1.5 rounded-full ${status === HandshakeStatus.ACTIVE ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
            </div>
          </div>
        </div>

        <div className="flex gap-6 items-center">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] text-gray-500 uppercase font-mono">Sovereign Node Uptime</span>
            <span className="text-sm font-mono text-emerald-400">{Math.floor(stats.uptime / 60)}m {stats.uptime % 60}s</span>
          </div>
          <div className="hidden md:flex flex-col items-end border-l border-emerald-900/30 pl-6">
            <span className="text-[10px] text-gray-500 uppercase font-mono">Encryption</span>
            <span className="text-sm font-mono text-white">{POD_CONFIG.encryptionStandard}</span>
          </div>
          <button 
            onClick={status === HandshakeStatus.IDLE ? initiateHandshake : undefined}
            disabled={status !== HandshakeStatus.IDLE}
            className={`px-4 py-2 rounded-md font-bold text-xs flex items-center gap-2 transition-all ${
              status === HandshakeStatus.ACTIVE 
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' 
                : status === HandshakeStatus.CONNECTING 
                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30 cursor-wait'
                : 'bg-emerald-500 text-black hover:bg-emerald-400'
            }`}
          >
            {status === HandshakeStatus.ACTIVE ? (
              <><Unlock size={14} /> LINK ESTABLISHED</>
            ) : status === HandshakeStatus.CONNECTING ? (
              <><Loader2 size={14} className="animate-spin" /> SECURING TUNNEL...</>
            ) : (
              <><Lock size={14} /> INITIALIZE HANDSHAKE</>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 overflow-hidden z-20">
        
        {/* Left Column: Stats & Monitoring */}
        <div className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
          <section className="bg-emerald-950/10 border border-emerald-900/30 rounded-lg p-5">
            <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Zap size={14} /> Edge Computing Stats
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">NVIDIA L40S GPU Load</span>
                  <span className="text-emerald-400 font-mono">{stats.gpuLoad.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-emerald-900/20 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${stats.gpuLoad}%` }}></div>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-emerald-900/20 pt-4">
                <span className="text-xs text-gray-400">Total Shards</span>
                <span className="text-lg font-mono font-bold text-white">{stats.totalProcessed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Avg. Throughput</span>
                <span className="text-sm font-mono text-emerald-400">1.2 SHD/S</span>
              </div>
            </div>
          </section>

          <section className="bg-emerald-950/10 border border-emerald-900/30 rounded-lg p-5 flex-1 flex flex-col">
            <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <BrainCircuit size={14} /> Sovereign AI Intelligence
            </h3>
            <div className="bg-black/40 p-4 rounded border border-emerald-900/20 flex-1 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-30 group-hover:opacity-100 transition-opacity">
                <button onClick={fetchAIReport} className="text-emerald-500 hover:text-emerald-300">
                  <Activity size={14} />
                </button>
              </div>
              <p className="text-xs font-mono leading-relaxed text-gray-300 whitespace-pre-wrap">
                {aiReport}
              </p>
            </div>
          </section>
        </div>

        {/* Center Column: Live Processing Feed */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="bg-black/50 border border-emerald-900/30 rounded-lg p-5 flex-1 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-2">
                <Database size={14} /> Live USIO Data Stream
              </h3>
              {status === HandshakeStatus.ACTIVE && (
                <button 
                  onClick={processNextShard}
                  disabled={isProcessing}
                  className="px-3 py-1.5 bg-emerald-500 text-black rounded text-[10px] font-bold flex items-center gap-1 hover:bg-emerald-400 disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 size={12} className="animate-spin" /> : <ChevronRight size={12} />}
                  PROCESS NEXT SHARD
                </button>
              )}
            </div>
            
            <ShardStream shards={shards} />
          </div>
        </div>

        {/* Right Column: Wealth Engine Distribution */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <section className="bg-emerald-950/10 border border-emerald-900/30 rounded-lg p-5">
            <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Wallet size={14} /> Wealth Engine Split
            </h3>
            <WealthChart />
            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between p-2 rounded bg-emerald-500/5 border border-emerald-500/10">
                <div className="flex items-center gap-2">
                  <Activity size={12} className="text-emerald-400" />
                  <span className="text-[10px] text-gray-300">Youth (70%)</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">${(stats.totalWealthGenerated * 0.7).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-sky-500/5 border border-sky-500/10">
                <div className="flex items-center gap-2">
                  <Building2 size={12} className="text-sky-400" />
                  <span className="text-[10px] text-gray-300">Bank (20%)</span>
                </div>
                <span className="text-[10px] font-mono text-sky-400">${(stats.totalWealthGenerated * 0.2).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-rose-500/5 border border-rose-500/10">
                <div className="flex items-center gap-2">
                  <Landmark size={12} className="text-rose-400" />
                  <span className="text-[10px] text-gray-300">Trust (10%)</span>
                </div>
                <span className="text-[10px] font-mono text-rose-400">${(stats.totalWealthGenerated * 0.1).toLocaleString()}</span>
              </div>
            </div>
          </section>

          <section className="bg-emerald-950/10 border border-emerald-900/30 rounded-lg p-5 flex-1">
            <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertTriangle size={14} /> System Integrity
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-black/40 border border-emerald-900/20 rounded">
                <span className="text-[10px] text-gray-500 uppercase block mb-1">Total Sovereign Wealth</span>
                <span className="text-2xl font-mono font-bold text-emerald-400 tracking-tighter">
                  ${stats.totalWealthGenerated.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 font-mono italic">
                All payouts are routed via Karuma Smart-Contracts and verified by the USIO Integrity Hash algorithm.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="h-8 bg-emerald-950 border-t border-emerald-900/50 flex items-center px-4 justify-between z-20">
        <div className="flex items-center gap-4">
          <span className="text-[9px] font-mono text-emerald-500/70 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> 
            NODE_ACTIVE: {POD_CONFIG.podId}
          </span>
          <span className="text-[9px] font-mono text-emerald-500/70">
            NETWORK_LATENCY: 12ms
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[9px] font-mono text-emerald-500/70 uppercase">
            Sovereign Operating System v4.2.0-KAMPALA
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
