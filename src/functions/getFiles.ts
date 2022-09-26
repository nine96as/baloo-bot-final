import { join } from 'path';
import fs from 'fs';
type path = string;

/**
 * fetches all '.ts' or '.js' files in a path
 * @param {string} path path to search
 * @returns {Array} list of files in path
 */
export function getFiles(path: path): Array<string> {
  const results = fs.readdirSync(path);
  const files: path[] = pushFiles(path, results);

  return files;
}

const pushFiles = (path: path, results: path[]) => {
  const files: path[] = [];

  results.forEach((result) => {
    const filePath = join(path, result);
    if (
      isFile(filePath) &&
      (result.endsWith('.ts') || result.endsWith('.js'))
    ) {
      files.push(filePath);
    } else {
      files.push(...pushFiles(filePath, fs.readdirSync(filePath)));
    }
  });

  return files;
};

const isFile = (path: string) => fs.lstatSync(path).isFile();
