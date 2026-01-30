import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import type { Request, Response, NextFunction } from "express";
import { userRouter } from "./routes/user.routes";
import { adminRouter } from "./routes/admin.routes";
import { authRouter } from "./routes/auth.routes";
import { meetingsConfirmedRouter } from "./routes/meetingsConfirmed.routes";
import { meetingsPendingRouter } from "./routes/meetingsPending.routes";
import { meetingsDeniedRouter } from "./routes/meetingsDenied.routes";
import { meetingsTotalRouter } from "./routes/meetingsTotal.routes";

dotenv.config();

const server = express();

// ✅ Configuração melhorada do CORS
const allowedOrigins = [
  'https://sihsmeeting.vercel.app',
  'http://localhost:5173', // Vite dev
  'http://localhost:3000', // CRA dev
  process.env.CORS_ORIGIN // Origem adicional do env
].filter(Boolean);

server.use(
  cors({
    origin: (origin, callback) => {
      // Permite requisições sem origin (como mobile apps, Postman)
      if (!origin) return callback(null, true);
      
      // Permite origins na whitelist
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ CORS bloqueado para origem: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
  })
);

// ✅ Adiciona handler explícito para preflight
server.options('*', cors());

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "SIHS Meeting Backend API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      auth: "/api/auth",
      admin: "/api/admin",
      users: "/api/users",
      meetings: "/api/meetings",
    },
  });
});

server.get("/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    status: "ok",
    message: "Servidor rodando",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    cors: {
      allowedOrigins: allowedOrigins,
      configured: !!process.env.CORS_ORIGIN
    },
    services: {
      ldap: process.env.LDAP_URL ? "configurado" : "não configurado",
      supabase: process.env.SUPABASE_URL ? "configurado" : "não configurado",
    },
  });
});

server.use("/api/meetingsConfirmed", meetingsConfirmedRouter);
server.use("/api/meetingsPending", meetingsPendingRouter);
server.use("/api/meetingsDenied", meetingsDeniedRouter);
server.use("/api/meetingsTotal", meetingsTotalRouter);
server.use("/api/admin", adminRouter);
server.use("/api/users", userRouter);
server.use("/api/ldap", authRouter);

server.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Rota não encontrada",
    path: req.path,
    method: req.method,
  });
});

server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Erro não tratado:", err);

  res.status(500).json({
    success: false,
    message: "Erro interno do servidor",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

const startServer = async () => {
  try {
    const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

    server.listen(PORT, () => {
      console.log("\n🚀 ================================");
      console.log("   SIHS Meeting Backend API");
      console.log("================================");
      console.log(`\n📍 Server: http://localhost:${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`\n🔌 Endpoints:`);
      console.log(`   - Health Check: http://localhost:${PORT}/health`);
      console.log(`   - Auth:         http://localhost:${PORT}/api/auth`);
      console.log(`   - Admin:        http://localhost:${PORT}/api/admin`);
      console.log(`   - Users:        http://localhost:${PORT}/api/users`);
      console.log(`   - Meetings:     http://localhost:${PORT}/api/meetings`);
      console.log(`\n🔐 Services:`);
      console.log(
        `   - LDAP URL:     ${process.env.LDAP_URL || "❌ não configurado"}`
      );
      console.log(
        `   - LDAP Base DN: ${process.env.LDAP_BASE_DN || "❌ não configurado"}`
      );
      console.log(
        `   - Supabase:     ${
          process.env.SUPABASE_URL ? "✅ configurado" : "❌ não configurado"
        }`
      );
      console.log(`\n🌐 CORS:`);
      console.log(`   - Allowed Origins: ${allowedOrigins.join(', ')}`);
      console.log("\n================================\n");
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar o servidor:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", () => {
  console.log("\n⚠️  SIGTERM recebido. Encerrando servidor...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("\n⚠️  SIGINT recebido. Encerrando servidor...");
  process.exit(0);
});

startServer();

export default server;