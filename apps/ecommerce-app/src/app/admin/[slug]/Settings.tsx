import { FieldInput, UploadFile } from '@global';

export function Settings() {
  return (
    <div className="p-7">
      <h1 className="text-2xl font-bold mb-1">Settings</h1>
      <p className="text-xl">Manage your application settings here.</p>

      <FieldInput
        className="mt-8 w-[300px]"
        required
        label="High points threshold"
        value="0"
      />
      <FieldInput
        className="mt-8 w-[300px]"
        required
        label="Top sold threshold"
        value="0"
      />

      <UploadFile maxFiles={5} />
    </div>
  );
}
