export type EmailPasswordCredentials = {
  email: string
  password: string
}

export type SignUpCredentials = EmailPasswordCredentials & {
  displayName?: string
}
