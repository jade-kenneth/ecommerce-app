export const FileCreatedHandler = (filePath: string) => {
  return {
    type: 'file-created',
    filePath,
    timestamp: new Date().toISOString(),
    message: `File created at ${filePath}`,
  };
};
