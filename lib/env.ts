// This is a simple utility to check if code is running on the client or server
// Helps avoid hydration mismatches by being explicit about environment

export const isClient = typeof window !== 'undefined'
export const isServer = !isClient
