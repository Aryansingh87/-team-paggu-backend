# Team Paggu — Backend

Node.js + Express + MongoDB API for the Team Paggu coaching platform. Covers
auth, memberships, program assignment, video review, real-time chat, and
Razorpay (test mode) payments.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables** — copy `.env.example` to `.env` and fill in:
   - `MONGO_URI` — a MongoDB Atlas connection string (free tier is fine), or a local MongoDB URL
   - `JWT_SECRET` — any long random string
   - `CLOUDINARY_*` — from your Cloudinary dashboard (free tier)
   - `RAZORPAY_*` — **test mode** keys from the Razorpay dashboard (toggle "Test Mode" before generating keys)

3. **Seed the database** (creates the 3 membership plans + a demo coach account):
   ```bash
   npm run seed
   ```
   This prints a demo coach login (`coach@teampaggu.com` / `paggu1234`) — change the password after first login.

4. **Run the server**
   ```bash
   npm run dev
   ```
   API runs at `http://localhost:5000`.

## Project structure

```
team-paggu-backend/
├── server.js              # Express + Socket.io entry point
├── seed.js                 # Seeds membership plans + demo coach
├── config/
│   ├── db.js                 # MongoDB connection
│   ├── cloudinary.js          # Cloudinary + Multer video upload storage
│   └── razorpay.js            # Razorpay client
├── models/                 # Mongoose schemas
│   ├── User.js, MembershipPlan.js, Program.js, Video.js, Message.js, Payment.js
├── controllers/            # Route handler logic
├── routes/                 # Express routers
├── middleware/
│   ├── auth.js               # JWT verification + role-based access (protect, authorize)
│   └── errorHandler.js
└── sockets/
    └── chatSocket.js          # Real-time chat over Socket.io (JWT-authenticated)
```

## API Reference

All protected routes require `Authorization: Bearer <token>` header.
Token is returned from `/api/auth/signup` and `/api/auth/login`.

### Auth
| Method | Route | Access | Body |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | `{ name, email, password, role }` — role is `client` or `coach` |
| POST | `/api/auth/login` | Public | `{ email, password }` |
| GET | `/api/auth/me` | Logged in | — |

### Memberships
| Method | Route | Access |
|---|---|---|
| GET | `/api/memberships` | Public — returns the 3 plans |

### Users
| Method | Route | Access | Notes |
|---|---|---|---|
| GET | `/api/users/clients` | Coach | Full client roster, used for the coach dashboard |
| GET | `/api/users/coach` | Logged in | Returns the team's coach account — used by clients to know who to chat with |

### Programs
| Method | Route | Access | Body |
|---|---|---|---|
| POST | `/api/programs` | Coach | `{ clientId, weekLabel, exercises: [{lift, sets, note}], notes }` |
| GET | `/api/programs/me` | Client | — returns their latest program |
| GET | `/api/programs/client/:clientId` | Coach | — full program history for a client |

### Videos
| Method | Route | Access | Body |
|---|---|---|---|
| POST | `/api/videos` | Client | multipart form: `video` (file), `lift`, `weight` |
| GET | `/api/videos/me` | Client | — their upload history |
| GET | `/api/videos/queue` | Coach | — all pending review |
| PATCH | `/api/videos/:id/review` | Coach | `{ coachNote }` (optional) — marks reviewed |

### Messages (chat)
| Method | Route | Access | Notes |
|---|---|---|---|
| GET | `/api/messages/:userId` | Logged in | Full conversation history with that user |
| POST | `/api/messages` | Logged in | REST fallback — real-time delivery uses Socket.io instead |

**Socket.io** (real-time):
```js
const socket = io("http://localhost:5000", { auth: { token: jwtToken } });
socket.emit("send_message", { to: otherUserId, text: "Hello" });
socket.on("receive_message", (message) => { /* update chat UI */ });
```

### Payments (Razorpay test mode)
| Method | Route | Access | Body |
|---|---|---|---|
| POST | `/api/payments/create-order` | Logged in | `{ plan: "STARTER" \| "COMPETITOR" \| "ELITE" }` — returns a Razorpay order + `keyId` |
| POST | `/api/payments/verify` | Logged in | `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }` from the Razorpay checkout callback — verifies + activates membership |

**Frontend payment flow:**
1. Call `POST /api/payments/create-order` with the chosen plan
2. Use the returned `order.id` and `keyId` to open Razorpay's checkout widget (`Razorpay.open()`)
3. On success, Razorpay gives you `razorpay_payment_id` and `razorpay_signature` — send all three to `POST /api/payments/verify`
4. On success, the user's `membership` field is updated to `active`

## Frontend integration

The `team-paggu` frontend is now fully wired to these endpoints — see its README
for details. In short: set `VITE_API_URL=http://localhost:5000/api` in the
frontend's `.env`, run this backend first (`npm run dev`), then start the
frontend (`npm run dev` in the frontend folder). Login, chat, video upload,
programs, and payments all hit this API for real.
