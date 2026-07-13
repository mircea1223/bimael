import crypto from 'node:crypto'

export type PaymentScenario = 'approved' | 'pending' | 'failed'
export type PaymentStatus = 'paid' | 'pending' | 'failed'

export interface PaymentPort {
  readonly provider: string
  authorize(input: { amountMinor: number; currency: 'RON'; scenario: PaymentScenario }): Promise<{ providerRef: string; status: PaymentStatus }>
}

export interface EmailPort {
  readonly provider: string
  recordSubscription(email: string): Promise<{ accepted: boolean; externalMessageSent: boolean }>
}

export interface VideoPort {
  readonly provider: string
  accessFor(webinarId: string, userId: string): Promise<{ configured: boolean; url: string | null }>
}

class DemoPaymentAdapter implements PaymentPort {
  readonly provider = 'demo'
  async authorize(input: { amountMinor: number; currency: 'RON'; scenario: PaymentScenario }) {
    const status: PaymentStatus = input.scenario === 'approved' ? 'paid' : input.scenario
    return { providerRef: `demo-pay-${crypto.randomUUID().slice(0, 8)}`, status }
  }
}

class DemoEmailAdapter implements EmailPort {
  readonly provider = 'demo'
  async recordSubscription(_email: string) {
    return { accepted: true, externalMessageSent: false }
  }
}

class DemoVideoAdapter implements VideoPort {
  readonly provider = 'demo'
  async accessFor(_webinarId: string, _userId: string) {
    return { configured: false, url: null }
  }
}

export const integrations = {
  payment: new DemoPaymentAdapter(),
  email: new DemoEmailAdapter(),
  video: new DemoVideoAdapter(),
} as const
