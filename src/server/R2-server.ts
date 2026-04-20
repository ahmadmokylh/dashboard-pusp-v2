import { uploadImageSchema } from '#/schema/uploadImageSchema'
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { createServerFn } from '@tanstack/react-start'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { R2 } from '#/lib/R2'

export const uploadToR2 = createServerFn({ method: 'POST' })
  .inputValidator((data) => uploadImageSchema.parse(data))
  .handler(async ({ data }) => {
    const key = `products/${Date.now()}-${data.fileName}`

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      ContentType: data.fileType,
    })

    const uploadUrl = await getSignedUrl(R2, command, {
      expiresIn: 60,
    })

    return {
      key,
      uploadUrl,
      url: process.env.R2_PUBLIC_URL
        ? `${process.env.R2_PUBLIC_URL}/${key}`
        : null,
    }
  })

export const deleteFromR2 = createServerFn({ method: 'POST' })
  .inputValidator((data: { key: string }) => data)
  .handler(async ({ data }) => {
    await R2.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: data.key,
      }),
    )

    return { message: 'Deleted photo Successflly' }
  })
