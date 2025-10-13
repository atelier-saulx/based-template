export type User = {
  id: number
  name: string
  email: string
  role: typeof userRoles
  picture?: string
  status: typeof userStatuses
  followMe?: Record<string, any>
  // createdAt: number
  // updatedAt: number
}
