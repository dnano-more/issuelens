export interface IssuePreset {
  id: string;
  name: string;
  tag: string;
  severity: "Critical" | "High" | "Medium";
  title: string;
  description: string;
}

export const ISSUE_PRESETS: IssuePreset[] = [
  {
    id: "mongo-socket-drop",
    name: "MongoDB Connection Refused",
    tag: "Database / Socket",
    severity: "Critical",
    title: "MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017",
    description: `MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
    at NativeTopology.selectServer (/app/node_modules/mongodb/lib/sdam/topology.js:278:38)
    at ConnectionPool.checkOut (/app/node_modules/mongodb/lib/cmap/connection_pool.js:560:12)
    at async DatabaseDriver.connect (/app/src/lib/db.ts:18:5)

Context:
Production container failed during startup readiness probe. MONGODB_URI is populated from vault secret. Service unable to establish TCP handshake with daemon.`
  },
  {
    id: "ssr-hydration-divergence",
    name: "SSR Hydration Divergence",
    tag: "Next.js / Virtual DOM",
    severity: "Medium",
    title: "Error: Hydration failed because server-rendered DOM diverged from client tree",
    description: `Error: Hydration failed because the initial UI does not match what was rendered on the server.
Warning: Text content did not match. 
  Server: "2026-10-09T07:15:00.000Z"
  Client: "Oct 9, 2026, 12:45 PM"
  
Component Hierarchy:
  <RootLayout>
    <DashboardShell>
      <HeaderAnalytics timestamp={lastUpdated}>
      
See more: https://nextjs.org/docs/messages/react-hydration-error`
  },
  {
    id: "jwt-rotation-drop",
    name: "JWT Key Rotation Invalidation",
    tag: "Security / Auth",
    severity: "High",
    title: "TokenExpiredError: jwt expired / 401 Unauthorized cascade on ingress gateway",
    description: `TokenExpiredError: jwt expired
    at JsonWebToken.verify (/app/node_modules/jsonwebtoken/verify.js:152:21)
    at AuthMiddleware (/app/src/middleware/auth.ts:42:15)
    at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)

Trace:
API Gateway drops bearer token after 900s TTL. Asynchronous refresh token exchange failed due to race condition during concurrent API calls.`
  },
  {
    id: "cors-preflight-rejection",
    name: "CORS Preflight Policy Drop",
    tag: "Network / HTTP Ingress",
    severity: "Medium",
    title: "Access to fetch from origin 'https://app.domain.com' blocked by CORS policy",
    description: `Access to fetch at 'https://api.domain.com/v1/telemetry' from origin 'https://app.domain.com' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.

Request: OPTIONS /v1/telemetry
Headers: Access-Control-Request-Headers: authorization, content-type`
  }
];
