import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { FieldLabel, SectionTitle } from './account-page'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Separator } from '../ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Field } from '../ui/field'

export function TabProfile() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Manage your personal information and public details.
        </CardDescription>
      </CardHeader>
      <Separator />

      <CardContent>
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-14">
              <AvatarImage />
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Name</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                JPG, PNG or WebP — max 2MB
              </p>
            </div>
          </div>

          <Button variant="outline" size="xs">
            Upload Image
          </Button>
        </div>
      </CardContent>

      <CardContent>
        <SectionTitle>Personal info</SectionTitle>
        <Card className=" rounded-lg shadow-none">
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>First name</FieldLabel>
                <Input defaultValue="Omar" />
              </Field>
              <Field>
                <FieldLabel>Last name</FieldLabel>
                <Input defaultValue="Al-Zoubi" />
              </Field>
            </div>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input defaultValue="admin@email.com" type="email" />
            </Field>

            <Field>
              <FieldLabel>Bio</FieldLabel>
              <Textarea
                defaultValue=""
                rows={3}
                className="resize-none text-sm"
              />
            </Field>
          </CardContent>

          <Separator />

          <CardFooter className="flex justify-end">
            <Button size="xs">Save changes</Button>
          </CardFooter>
        </Card>
      </CardContent>

      <CardContent>
        <SectionTitle>Danger zone</SectionTitle>
        <Card className="shadow-sm ">
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Delete account</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Permanently delete your account and all associated data.
              </p>
            </div>
            <Button variant="destructive" size="xs">
              Delete account
            </Button>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
