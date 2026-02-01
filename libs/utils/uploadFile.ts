import { UploadFileMutationResult } from '~/graphql/generated';

export async function uploadFile(file: File): Promise<string | undefined> {
  const operations = JSON.stringify({
    query: `
      mutation ($file: Upload!) {
        uploadFile(file: $file)
      }
    `,
    variables: { file: null },
  });

  const map = JSON.stringify({ '0': ['variables.file'] });

  const formData = new FormData();
  formData.append('operations', operations);
  formData.append('map', map);
  formData.append('0', file);

  const res = await fetch(process.env.NEXT_PUBLIC_PORTAL_API || '', {
    method: 'POST',
    body: formData,
    headers: {
      'apollo-require-preflight': 'true', // ✅ this tells Apollo to allow multipart
    },
  });

  const data = (await res.json()) as UploadFileMutationResult;
  return data.data?.uploadFile ?? undefined;
}
