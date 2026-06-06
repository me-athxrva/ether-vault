"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import axios from "axios";
import { 
  Terminal, 
  Play, 
  Copy, 
  Check, 
  Lock, 
  Globe, 
  ChevronRight, 
  RefreshCw,
  FileText,
  Key,
  ShieldAlert,
  ArrowRight
} from "lucide-react";

export default function DocsPage() {
  const [activeEndpoint, setActiveEndpoint] = useState("verify");
  const [codeLanguage, setCodeLanguage] = useState("curl");
  const [copied, setCopied] = useState(false);

  const [verifyId, setVerifyId] = useState("DOC-");
  const [documentHash, setDocumentHash] = useState("");
  const [loginEmail, setLoginEmail] = useState("admin@ethervault.com");
  const [loginPassword, setLoginPassword] = useState("admin123");
  const [revokeId, setRevokeId] = useState("");

  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);

  useEffect(() => {
    setApiResponse(null);
    setApiStatus(null);
  }, [activeEndpoint]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestApi = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setApiResponse(null);
    setApiStatus(null);

    let url = "";
    let method = "POST";
    let data = {};

    try {
      if (activeEndpoint === "verify") {
        url = "/api/document/verify";
        if (documentHash) {
          data = { hash: documentHash };
        } else {
          data = { verifyId: verifyId };
        }
      } else if (activeEndpoint === "login") {
        url = "/api/auth/login";
        data = { email: loginEmail, password: loginPassword };
      } else if (activeEndpoint === "upload") {
        // Mock issue endpoint trigger for simulation
        url = "/api/document/upload";
        data = { file: "File binary mock metadata" };
      } else if (activeEndpoint === "revoke") {
        url = `/api/document/revoke/${revokeId || "mock-id"}`;
        method = "PATCH";
      }

      let response;
      if (method === "POST") {
        response = await axios.post(url, data);
      } else if (method === "PATCH") {
        response = await axios.patch(url, data);
      }

      setApiStatus(response.status);
      setApiResponse(response.data);
    } catch (err) {
      console.error(err);
      if (err.response) {
        setApiStatus(err.response.status);
        setApiResponse(err.response.data);
      } else {
        setApiStatus(500);
        setApiResponse({
          message: "Unable to connect to the backend server. Make sure it is running.",
          status: "failed"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const endpoints = {
    verify: {
      name: "Verify Document",
      method: "POST",
      path: "/api/document/verify",
      auth: "Public",
      description: "Verifies the cryptographic authenticity of an issued credential using either its secure SHA-256 hash value or its alphanumeric Verification ID.",
      params: [
        { name: "verifyId", type: "String", req: "Optional", desc: "Alphanumeric unique identification ID generated on issuance (e.g. DOC-A1B2C3). Required if 'hash' is not provided." },
        { name: "hash", type: "String", req: "Optional", desc: "Cryptographic SHA-256 hash of the raw document file. Required if 'verifyId' is not provided." }
      ],
      responses: [
        { code: "200 Success", desc: "Document successfully located on-chain. Returns document structure, transaction hash, and revocation state." },
        { code: "400 Bad Request", desc: "Missing parameters or both 'hash' and 'verifyId' provided." },
        { code: "404 Not Found", desc: "Document with specified hash or ID does not exist in the vault." }
      ],
      code: {
        curl: `curl -X POST http://localhost:3001/api/document/verify \\\n  -H "Content-Type: application/json" \\\n  -d '{"verifyId": "${verifyId || "DOC-123456"}"}'`,
        javascript: `fetch('/api/document/verify', {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({\n    verifyId: '${verifyId || "DOC-123456"}'\n  })\n})\n.then(res => res.json())\n.then(data => console.log(data));`,
        python: `import requests\n\nurl = "http://localhost:3001/api/document/verify"\npayload = {"verifyId": "${verifyId || "DOC-123456"}"}\n\nresponse = requests.post(url, json=payload)\nprint(response.json())`
      }
    },
    login: {
      name: "User Authentication",
      method: "POST",
      path: "/api/auth/login",
      auth: "Public",
      description: "Authenticates an institution or administrator. Sets a secure, httpOnly session cookie to permit access to document issuance and revocation endpoints.",
      params: [
        { name: "email", type: "String", req: "Required", desc: "Valid email address registered with the organization account." },
        { name: "password", type: "String", req: "Required", desc: "The account security password." }
      ],
      responses: [
        { code: "200 Success", desc: "User verified. httpOnly session cookie issued and user meta returned." },
        { code: "400 Bad Request", desc: "Missing email or password fields." },
        { code: "401 Unauthorized", desc: "Invalid login credentials." }
      ],
      code: {
        curl: `curl -X POST http://localhost:3001/api/auth/login \\\n  -H "Content-Type: application/json" \\\n  -d '{"email": "${loginEmail}", "password": "${loginPassword}"}'`,
        javascript: `fetch('/api/auth/login', {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({\n    email: '${loginEmail}',\n    password: '${loginPassword}'\n  })\n})\n.then(res => res.json())\n.then(data => console.log(data));`,
        python: `import requests\n\nurl = "http://localhost:3001/api/auth/login"\npayload = {\n    "email": "${loginEmail}",\n    "password": "${loginPassword}"\n}\n\nresponse = requests.post(url, json=payload)\nprint(response.json())`
      }
    },
    upload: {
      name: "Issue Document",
      method: "POST",
      path: "/api/document/upload",
      auth: "Private (Issuer Only)",
      description: "Registers a new certificate on the blockchain ledger. Accepts a single PDF file, calculates the SHA-256 hash, signs it via the issuer's key, and stores the metadata.",
      params: [
        { name: "file", type: "File (Binary)", req: "Required", desc: "The document certificate PDF to register. Maximum size: 5MB." }
      ],
      responses: [
        { code: "200 Success", desc: "Document uploaded, cryptographically hashed, and anchored to the smart contract ledger." },
        { code: "401 Unauthorized", desc: "Invalid or expired session credentials." },
        { code: "403 Forbidden", desc: "User authenticated but lacks admin/issuer level permissions." }
      ],
      code: {
        curl: `curl -X POST http://localhost:3001/api/document/upload \\\n  -H "Authorization: Bearer <token>" \\\n  -F "file=@certificate.pdf"`,
        javascript: `const formData = new FormData();\nformData.append('file', fileInput.files[0]);\n\nfetch('/api/document/upload', {\n  method: 'POST',\n  headers: {\n    'Authorization': 'Bearer <token>'\n  },\n  body: formData\n})\n.then(res => res.json())\n.then(data => console.log(data));`,
        python: `import requests\n\nurl = "http://localhost:3001/api/document/upload"\nheaders = {"Authorization": "Bearer <token>"}\nfiles = {"file": open("certificate.pdf", "rb")}\n\nresponse = requests.post(url, headers=headers, files=files)\nprint(response.json())`
      }
    },
    revoke: {
      name: "Revoke Document",
      method: "PATCH",
      path: "/api/document/revoke/:id",
      auth: "Private (Issuer Only)",
      description: "Permanently invalidates an issued credential. The smart contract states are marked as revoked, ensuring any future verification attempts fail instantly.",
      params: [
        { name: ":id", type: "String (Path)", req: "Required", desc: "The MongoDB unique identifier (_id) of the target document metadata." }
      ],
      responses: [
        { code: "200 Success", desc: "Document status updated to revoked on-chain and in local storage." },
        { code: "401 Unauthorized", desc: "Access denied. Admin session verification failed." },
        { code: "404 Not Found", desc: "No document matched the specified database identifier." }
      ],
      code: {
        curl: `curl -X PATCH http://localhost:3001/api/document/revoke/${revokeId || "64fb28a9b..."} \\\n  -H "Authorization: Bearer <token>"`,
        javascript: `fetch('/api/document/revoke/${revokeId || "64fb28a9b..."}', {\n  method: 'PATCH',\n  headers: {\n    'Authorization': 'Bearer <token>'\n  }\n})\n.then(res => res.json())\n.then(data => console.log(data));`,
        python: `import requests\n\nurl = "http://localhost:3001/api/document/revoke/${revokeId || "64fb28a9b..."}"\nheaders = {"Authorization": "Bearer <token>"}\n\nresponse = requests.patch(url, headers=headers)\nprint(response.json())`
      }
    }
  };

  const current = endpoints[activeEndpoint];

  return (
    <div className="min-h-screen bg-black text-[#e8e8e8] font-sans flex flex-col selection:bg-white selection:text-black">
      <Navbar />

      <main className="flex-grow pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {/* Intro Header */}
        <div className="mb-12 border-b border-white/5 pb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs uppercase tracking-widest text-[#8a8a8a] font-mono">API Specification</span>
            <div className="h-[1px] w-8 bg-white/20"></div>
            <span className="text-xs uppercase tracking-widest text-white font-mono bg-white/5 px-2 py-0.5 rounded-full border border-white/10">v1.0.0</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-heading mb-4">
            EtherVault developer kit
          </h1>
          <p className="max-w-2xl text-[#8a8a8a] text-sm md:text-base leading-relaxed">
            Integrate verification processes directly into your native infrastructure. Query issued certificates, authorize administrative agents, and issue cryptographically anchored metadata.
          </p>
        </div>

        {/* Documentation Structure Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Navigation Sidebar */}
          <div className="lg:col-span-3 sticky top-28 bg-[#0e0e0e]/40 backdrop-blur-md p-4 rounded-[2rem] border border-white/5">
            <h3 className="text-xs font-semibold tracking-wider text-[#8a8a8a] uppercase font-heading px-3 mb-4">
              Core Endpoints
            </h3>
            <nav className="flex flex-col gap-1">
              {Object.entries(endpoints).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setActiveEndpoint(key)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-full text-xs font-medium transition-all text-left ${
                    activeEndpoint === key
                      ? "bg-white text-black font-semibold shadow-lg shadow-white/5"
                      : "text-[#8a8a8a] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="truncate">{value.name}</span>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                    activeEndpoint === key
                      ? "border-black/20 text-black bg-black/5"
                      : value.method === "POST"
                      ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/5"
                      : "border-amber-500/20 text-amber-400 bg-amber-500/5"
                  }`}>
                    {value.method}
                  </span>
                </button>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-white/5 px-3">
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#8a8a8a] mb-2 font-heading">
                Security & Headers
              </h4>
              {current.auth === "Public" ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 mt-1 bg-emerald-500/5 px-2 py-1.5 rounded-lg border border-emerald-500/10">
                  <Globe className="h-3 w-3" />
                  <span className="font-mono text-[10px]">Public Endpoint</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-amber-500 mt-1 bg-amber-500/5 px-2 py-1.5 rounded-lg border border-amber-500/10">
                  <Lock className="h-3 w-3" />
                  <span className="font-mono text-[10px]">with-credentials: true</span>
                </div>
              )}
            </div>
          </div>

          {/* Center Endpoint Documentation */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Title Block */}
            <div className="bg-surface-low rounded-[2rem] p-6 border border-white/5 micro-glow">
              <div className="flex items-center gap-2.5 mb-4">
                <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                  current.method === "POST"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                }`}>
                  {current.method}
                </span>
                <span className="font-mono text-sm text-white select-all">{current.path}</span>
              </div>

              <h2 className="text-2xl font-bold text-white font-heading mb-2">
                {current.name}
              </h2>
              
              <div className="flex items-center gap-1.5 text-xs text-[#8a8a8a] mb-4">
                {current.auth === "Public" ? (
                  <>
                    <Globe className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Public Access (Rate limited)</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5 text-amber-400" />
                    <span>Requires Authorized Session Cookie</span>
                  </>
                )}
              </div>

              <p className="text-[#8a8a8a] text-sm leading-relaxed">
                {current.description}
              </p>
            </div>

            {/* Request Schema Table */}
            <div className="bg-surface-low rounded-[2rem] p-6 border border-white/5">
              <h3 className="text-sm font-bold tracking-wide text-white uppercase font-heading mb-4 border-b border-white/5 pb-2">
                Payload / Parameters
              </h3>
              
              {current.params.length > 0 ? (
                <div className="space-y-4">
                  {current.params.map((param) => (
                    <div key={param.name} className="flex flex-col gap-1 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-white font-bold">{param.name}</span>
                        <span className="text-[10px] text-[#8a8a8a] font-mono">{param.type}</span>
                        <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold font-mono ${
                          param.req === "Required" ? "bg-red-500/10 text-red-400" : "bg-white/10 text-white/50"
                        }`}>
                          {param.req}
                        </span>
                      </div>
                      <p className="text-[#8a8a8a] text-xs mt-1 leading-normal">
                        {param.desc}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#8a8a8a] text-xs italic">No payload parameters required.</p>
              )}
            </div>

            {/* Responses Block */}
            <div className="bg-surface-low rounded-[2rem] p-6 border border-white/5">
              <h3 className="text-sm font-bold tracking-wide text-white uppercase font-heading mb-4 border-b border-white/5 pb-2">
                Response Codes
              </h3>
              <div className="space-y-3">
                {current.responses.map((res) => {
                  const isSuccess = res.code.startsWith("200");
                  return (
                    <div key={res.code} className="flex gap-4 text-xs">
                      <span className={`font-mono font-bold w-24 shrink-0 ${
                        isSuccess ? "text-emerald-400" : "text-[#8a8a8a]"
                      }`}>
                        {res.code}
                      </span>
                      <span className="text-[#8a8a8a] leading-normal">{res.desc}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Code Snippet & Live Playground */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Snippet Block */}
            <div className="bg-surface-lowest rounded-[2rem] border border-white/10 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between bg-white/5 px-4 py-3 border-b border-white/5">
                <div className="flex gap-2">
                  {["curl", "javascript", "python"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setCodeLanguage(lang)}
                      className={`text-[10px] font-bold uppercase tracking-wider font-mono px-2 py-1 rounded transition-colors ${
                        codeLanguage === lang ? "bg-white text-black" : "text-[#8a8a8a] hover:text-white"
                      }`}
                    >
                      {lang === "javascript" ? "JS" : lang}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => copyToClipboard(current.code[codeLanguage])}
                  className="p-1 rounded text-[#8a8a8a] hover:text-white transition-colors"
                  title="Copy snippet"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>

              <pre className="p-4 text-[11px] font-mono text-emerald-400/90 leading-relaxed overflow-x-auto select-all bg-[#090909]">
                <code>{current.code[codeLanguage]}</code>
              </pre>
            </div>

            {/* Interactive Playground Block */}
            <div className="bg-surface-low rounded-[2rem] border border-white/5 p-6 micro-glow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-white fill-white" />
                  <h3 className="text-sm font-bold tracking-wide text-white uppercase font-heading">
                    Try Endpoint
                  </h3>
                </div>
                {isLoading && <RefreshCw className="h-4 w-4 text-white animate-spin" />}
              </div>

              {/* Dynamic Form based on active endpoint */}
              <form onSubmit={handleTestApi} className="space-y-4">
                {current.auth === "Public" ? (
                  <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono bg-emerald-500/5 border border-emerald-500/10 px-3 py-2 rounded-xl">
                    <Globe className="h-3.5 w-3.5" />
                    <span>No credentials required. Public endpoint.</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[10px] text-amber-400 font-mono bg-amber-500/5 border border-amber-500/10 px-3 py-2 rounded-xl">
                    <Lock className="h-3.5 w-3.5" />
                    <span>Requires authenticated session cookie.</span>
                  </div>
                )}
                {activeEndpoint === "verify" && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#8a8a8a] font-mono">
                        Verification ID
                      </label>
                      <input
                        type="text"
                        value={verifyId}
                        onChange={(e) => {
                          setVerifyId(e.target.value);
                          setDocumentHash("");
                        }}
                        className="bg-surface-lowest text-white font-mono text-xs border border-white/10 rounded-full px-4 py-2.5 focus:outline-none focus:border-white/40 transition-colors w-full"
                        placeholder="DOC-A1B2C3"
                      />
                    </div>            
                  </>
                )}

                {activeEndpoint === "login" && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#8a8a8a] font-mono">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="bg-surface-lowest text-white font-mono text-xs border border-white/10 rounded-full px-4 py-2.5 focus:outline-none focus:border-white/40 transition-colors w-full"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#8a8a8a] font-mono">
                        Password
                      </label>
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="bg-surface-lowest text-white font-mono text-xs border border-white/10 rounded-full px-4 py-2.5 focus:outline-none focus:border-white/40 transition-colors w-full"
                        required
                      />
                    </div>
                  </>
                )}

                {activeEndpoint === "upload" && (
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-3 text-center">
                    <FileText className="h-8 w-8 text-[#8a8a8a]" />
                    <p className="text-xs text-[#8a8a8a] max-w-[200px]">
                      Interactive file upload requests are managed through the dashboard console view.
                    </p>
                    <Link
                      href="/issuer/login"
                      className="rounded-full bg-white text-black px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#d4d4d4] transition-colors"
                    >
                      Login to dashboard
                    </Link>
                  </div>
                )}

                {activeEndpoint === "revoke" && (
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-3 text-center">
                    <ShieldAlert className="h-8 w-8 text-[#8a8a8a]" />
                    <p className="text-xs text-[#8a8a8a] max-w-[200px]">
                      Interactive document revocation requests are managed through the dashboard console view.
                    </p>
                    <Link
                      href="/issuer/login"
                      className="rounded-full bg-white text-black px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#d4d4d4] transition-colors"
                    >
                      Login to dashboard
                    </Link>
                  </div>
                )}

                {activeEndpoint !== "upload" && activeEndpoint !== "revoke" && (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 rounded-full bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-[#d4d4d4] disabled:bg-white/20 disabled:text-white/40 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Execute request</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </form>

              {/* Console terminal response */}
              {(apiResponse || apiStatus) && (
                <div className="mt-5 border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a8a8a] font-mono flex items-center gap-1">
                      <Terminal className="h-3 w-3" />
                      Response Terminal
                    </span>
                    <span className={`text-[10px] font-mono font-bold ${
                      apiStatus === 200 ? "text-emerald-400" : "text-red-400"
                    }`}>
                      STATUS: {apiStatus}
                    </span>
                  </div>
                  <pre className="p-3 text-[10px] font-mono bg-black text-[#d4d4d4] rounded-xl overflow-x-auto border border-white/5 max-h-52">
                    <code>{JSON.stringify(apiResponse, null, 2)}</code>
                  </pre>
                </div>
              )}
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
