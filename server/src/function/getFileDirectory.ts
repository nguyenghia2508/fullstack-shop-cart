import path from 'path';

export async function getFileDirectory(): Promise<string> {
  return path.join(process.cwd(), "fin_and_agrawal.py");
}