export interface IssuePreset {
  id: string;
  name: string;
  category: string;
  title: string;
  description: string;
}

export const ISSUE_PRESETS: IssuePreset[] = [
  {
    id: "mongo-econn",
    name: "MongoDB Connection Failure",
    category: "Database",
    title: "MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017",
    description: "When starting the server with 'npm run dev', the backend immediately crashes with:\n\nMongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017\n    at NativeTopology.selectServer (/node_modules/mongodb/lib/sdam/topology.js)\n\nThe .env file has MONGODB_URI=mongodb://localhost:27017/myapp. It worked fine yesterday on local."
  },
  {
    id: "hydration-error",
    name: "Next.js Hydration Mismatch",
    category: "Frontend",
    title: "Error: Hydration failed because the initial UI does not match the server",
    description: "Warning: Text content did not match. Server: '10/9/2026' Client: 'Friday, Oct 9, 2026'.\nSee more info here: https://nextjs.org/docs/messages/react-hydration-error\n\nOccurs in ProfileHeader.tsx inside the user timestamp component on page refresh."
  },
  {
    id: "jwt-expired",
    name: "JWT Token Expired (401)",
    category: "Authentication",
    title: "TokenExpiredError: jwt expired on /api/user/profile",
    description: "Users are being logged out unexpectedly after 15 minutes. Requests to /api/user/profile return:\n{\n  'error': 'jwt expired',\n  'name': 'TokenExpiredError',\n  'expiredAt': '2026-10-09T06:00:00.000Z'\n}\nRefresh token rotation does not seem to trigger automatically."
  },
  {
    id: "cors-blocked",
    name: "CORS Header Missing",
    category: "Network / API",
    title: "Access to fetch from origin 'http://localhost:3000' blocked by CORS policy",
    description: "No 'Access-Control-Allow-Origin' header is present on the requested resource. When the frontend sends a POST request with Authorization header, the browser blocks the preflight OPTIONS response from Express backend."
  }
];
