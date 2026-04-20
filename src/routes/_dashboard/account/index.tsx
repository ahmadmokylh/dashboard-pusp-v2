import AccountPage from '#/components/account/account-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/account/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AccountPage />
}
