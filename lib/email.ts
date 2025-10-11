import nodemailer from 'nodemailer'

export interface SendEmailOptions {
  to: string
  subject: string
  text?: string
  html?: string
}

export async function sendEmail({ to, subject, text, html }: SendEmailOptions): Promise<void> {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.FROM_EMAIL || process.env.SMTP_FROM || 'no-reply@sort-system.local'

  if (!host || !user || !pass) {
    console.warn('Email not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS (and optional SMTP_PORT, FROM_EMAIL).')
    return
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html: html || text,
  })
}



